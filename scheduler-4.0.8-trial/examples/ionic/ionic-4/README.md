# Ionic 4 demo

This project was generated with Ionic framework.

Run 
```
npm install
``` 
to install required modules before proceeding.

## Development server

Run 
```
npm run start
``` 
for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run 
```
npm run build
``` 
to build the project. The build artifacts will be stored in the `dist/` directory. 
Use the `npm run build_prod` for a production build.

## Further help

Installation and API documentation can be found at the Ionic project's page https://ionicframework.com/.

## Troubleshooting

Various compilation errors may be the result of using unsupported Node JS version.
We recommend using stable Node JS version 10.x.
Visit <https://nodejs.org/> for more information

If you are using Windows and receive 
`MSBUILD : error MSB3428: Could not load the Visual C++ component "VCBuild.exe"` on `npm install` then 
Run this command from console with Administrative rights and wait until build tools are installed.
Note that installation may take quite long time so please be patient.
```
npm install --global --production windows-build-tools
```

## IE 11 Compatibility

If your application requires compatibility with IE 11 then polyfilling is needed to support latest EcmaScript standards used within Bryntum library.
For the purpose we suggest use `core-js` v.3 polyfill solution. 
Angular 7 requires `core-js` v.2 for it's internal builder so we install `core-js` v.3 with alias to `core-js-3`.    
