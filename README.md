# modata
Blog site for data visualizations about datasets that have fallen through the cracks of normal news sites.


##Seed
I used the [gulp angular yo generator](https://github.com/Swiip/generator-gulp-angular) to get started.

##Setup
##### Install required tools `gulp` and `bower`:
```
npm install -g gulp bower
```
##### Clone this repo
##### Run the `bower` and `npm` installs
```
npm install
bower install
```
##### To start the application 
```
gulp serve
```
##### Then navigate to `localhost:3000`

##### To run unit tests
```
karma start
```

##Deployment
Run to create an optimized version of the project
```
gulp build
```
Then run 
```
gulp serve:dist
```
To make sure everything is still working on the optimized build.

Lastly upload the files through ftp to goDaddy
