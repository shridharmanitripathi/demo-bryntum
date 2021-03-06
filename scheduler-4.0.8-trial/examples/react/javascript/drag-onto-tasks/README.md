## React drag onto tasks demo

This demo contains a React drag onto tasks example. It contains Grid and Scheduler where you can drag equipment from the grid onto tasks.

Please mind that Grid is licensed separately.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Bryntum Shared Library

This example uses BryntumScheduler wrapper which is implemented in shared library.
 
Library package is located in `examples/react/_shared` folder. 

This library is automatically installed and built during `npm install` for the example by `preinstall` script in `package.json` so it not required do it separately.    

To install and build it manually go to library folder and run:

```
npm install
npm run build
```

## Start development server

To start development server run: 

```
npm install
npm start
``` 

This runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Build example

To build example run:

```
npm install
npm run build
```

This builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Troubleshooting

In the case of compile error (`npm run build` or `npm start` fails) try to delete `node_modules` folder and `package-lock.json` file in example's folder and then build example or run development server as suggested above.
