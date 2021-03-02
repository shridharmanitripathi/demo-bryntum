#Using a Store
This guide shows how to manage records in a `Store`, for example how to retrieve records and how to sort or filter the
store. It applies to all stores used by the Scheduler and assumes you have read the "Displaying data" guide, which has 
basic info on how to use stores with the Scheduler.

##Store example
The store outlined in code below is referred to in the examples ahead in this guide:

```javascript
const store = new ResourceStore({
    data : [
        { id : 1, name : 'Ms. Marvel', powers : 'Shapeshifting' },
        { id : 2, name : 'Black Widow', powers : 'Martial arts' },
        { id : 3, name : 'Captain Marvel', powers : 'Flight, Energy projection' },
        { id : 4, name : 'X-23', powers : 'Regeneration' },
        { id : 5, name : 'Mockingbird', powers : 'Martial arts' }       
    ]
});
```

##Retrieving records
A `Store` can be seen as a collection of records with functionality to manage them. To retrieve a record, it is easiest
to do it using its index or id:

```javascript
store.getAt(1); // Black Widow
store.getById(3); // Captain Marvel
```

There are also shortcuts to get the first or last record:

```javascript
store.first; // Ms. Marvel
store.last; // Mockingbird
```

Because stores are iteratables, you can also use destructuring assignments:

```javascript
// Ms. Marvel, Black Widow, Captain Marvel
const [ first, second, third ] = store;
```

You can search for a single record:

```javascript
store.find(record => record.name.startsWith('M')); // Ms. Marvel
store.findRecord('name', 'X-23'); // X-23, surprise
```

Or query for multiple:

```javascript
store.query(record => record.name.startsWith('M')); // [Ms. Marvel, Mockingbird]
```

##Sorting
A `Store` can be sorted by a single field or by multiple fields. Sort can be specified at creation time using stores config:

```javascript
const store = new Store({
    sorters : [
        { field : 'powers' }, // ascending
        { field : 'name', ascending: false } // descending
    ]
});
```

After creation it can be sorted as below: 

```javascript
resourceStore.sort('name'); // Sort by name, ascending first time, toggles on additional calls
resourceStore.sort('name', false); // Sort by name, descending

resourceStore.addSorter('powers'); // Also sort by powers
resourceStore.removeSorter('powers'); // Stop sorting by powers
```

##Filtering
Filtering makes the store expose a subset of its records. When iterating or querying the store only this subset will be 
used. Examples on filtering:

```javascript
resourceStore.filter('powers', 'Martial arts'); // Black Widow, Mockingbird

resourceStore.filter({
    property : 'id',
    operatior : '<',
    value : 4
}); // Ms. Marvel, Black Widow, Captain Marvel

resourceStore.removeAllFilters(); // Remove filters
```

##Iterating over records
The records in the store can be iterated over in a couple of ways. Using for-of:

```javascript
for (const record of resourceStore) {
    console.log(record.name);
}
```

Or by using forEach:

```javascript
resourceStore.forEach(record => {
    console.log(record.name);
});
```

The stores implementation of `forEach()` differs from the native arrays by allowing you to terminate the iteration by
returning false.

##CRUD operations
###Adding records
You can easily add existing records or raw data:

```javascript
resourceStore.add({ name : 'Scarlet Witch' });

// or

resourceStore.add(new Model({
  name : 'Storm',
  powers : 'Weather'
}));
```

Same goes for insertion:

```javascript
resourceStore.insert(0, { name : 'She-Hulk' });

// or

resourceStore.insert(0, new Model({
  name : 'Medusa',
  powers : 'Hair'
}));
```

Please note that Scheduler uses a calculation engine to determine dates, durations and references between records.
This engine operates asynchronously, thus the results of the calculations are not immediataly available after CRUD 
operations. To make sure that results are available, either call `await project.commitAsync()` or use `addAsync` or 
`insertAsync()`.

Using `project.commitAsync()`:

```javascript
eventStore.add({ startDate : '2020-09-15', duration : 2 });

// endDate is not yet calculated, because calculations happen async

await eventStore.project.commitAsync();

// endDate is available now
```

Using `addAsync()`:

```javascript
await eventStore.addAsync({ startDate : '2020-09-15', duration : 2 });

// endDate is available now
```

###Removing records
Either retrieve a record and and call `Model#remove()` or remove it using its id:

```javascript
resourceStore.remove(1); // Removes Ms. Marvel

resourceStore.last.remove(); // Removes Mockingbird
``` 

###Modifying records
Fields in a record are turned into setters which can be assigned to to update the record, making it reactive. Doing so 
triggers events that updates the scheduler (if the store is used with a scheduler). To modify a record, simply retrieve 
it and set values:

```javascript
resourceStore.last.name = 'Jennifer Walters';
```  

To set multiple fields in a single go:

```javascript
resourceStore.last.set({
    name : 'Jennifer Walters',
    powers : 'Strength'
});
```

Setting multiple fields and making sure calculations and references are up to date:

```javascript
await eventStore.first.setAsync({
    startDate : new Date(2020, 8, 14),
    duration  : 4
});
```

##JSON

If you want to serialize the contents of a store, you can access the data from all of its records in JSON format:

```javascript
 const jsonString = eventStore.json;
 
 // or
 
 const jsonArray = eventStore.toJSON();
```
 
 To plug the JSON data back in later:
 
```javascript
 eventStore.json = jsonString;
 
 // or
 
 eventStore.data = jsonArray;
```
