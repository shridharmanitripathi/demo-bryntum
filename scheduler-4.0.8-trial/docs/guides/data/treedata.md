# Using tree data
The built in `Store` (and its subclass `AjaxStore`) both handle tree data. This guide shows the basics of working with
such data.

## Loading tree data
As with flat data, tree data can be loaded either inline or using Ajax (see other "Working with data" guides for more 
details on loading). Both methods by default expect data to contain child nodes in a `children` property on the parents:

```javascript
resourceStore.data = [
    {
        id : 1,
        name : 'Proud parent',
        age : 38,
        children : [
            { id : 11, name : 'First born', age : 6 },
            { id : 12, name : 'Some kid', age : 3 }
        ]
    }
]
```  

The name of this property can be changed, by assigning to `Model.childrenField`. See API docs for more information.

Records that are used in a tree are commonly also called nodes.

In the case illustrated above, the store will have a `rootNode` property 
with one child node which itself has two children.

A node has the following extra properties by virtue of its position in
the tree structure:

* `parent` A reference to the parent node.
* `parentIndex` The node's index in the parent's `children` array.
* `previousSibling` A reference to the node's previous sibling if any.
* `nextSibling` A reference to the node's next sibling if any.
* `level` The visible level of the node with 0 being the top level nodes.

## Saving row order
When data is loaded to the store, [`parentIndex`](#Core/data/mixin/TreeNode#field-parentIndex) is set automatically based on the nodes position. Then you can change the order
using [RowReorderer](#Grid/feature/RowReorder) feature or [Sort](#Grid/feature/Sort) feature for example. When task order is changed
[`parentIndex`](#Core/data/mixin/TreeNode#field-parentIndex) is updated. Therefore to save row order, need to persist the field on the server,
and when data is fetched to be loaded, need to sort it on the server by the field. This will put nodes in correct order and nodes will
receive correct parent indexes.

## Retrieving nodes
The "Using a Store" guide describes different ways of retrieving records. Currently only a couple of those are supported
for trees:

```javascript
// get node at any level by id
resourceStore.getById(12); // -> Some kid

// query for multiple nodes
resourceStore.query(node => node.age < 10); // -> [First born, Some kid]
```

## Traversing nodes
The nodes in a tree can be traversed using `Store#traverse()`:

```javascript
resourceStore.traverse(node => {
    // code to run per node
});
```

## CRUD operations
### Adding nodes
Add child nodes by first retrieving the parent node and then calling its `appendChild()` method supplying a model data Object or a Model instance:

```javascript
const newBaby = resourceStore.getById(1).appendChild({
    name : 'Baby',
    age : 0
});
```

Same goes for insertion using `insertChild()`:

```javascript
const parent = resourceStore.getById(1),
    firstBorn = parent.insertChild({
        name : 'Actual first born',
        age : 18
    }, parent.children[0]);
```

### Removing nodes
Remove child nodes by first retrieving the parent node and then calling its `removeChild()` method supplying a Model instance,
or call the node's `remove()` method which routes through to its parent's `removeChild()` method:

```javascript
const parent = resourceStore.getById(1);
parent.removeChild(parent.children[1]); // Removes second kid

parent.removeChild(parent.children[0]); // Removes First born
``` 

### Modifying records
Works the same way as with flat data, see the ["Using a store"](#guides/data/storebasics.md) guide.
