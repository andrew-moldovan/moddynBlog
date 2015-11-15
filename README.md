# simplysocial -- Bootstrap-Free Demo Project

I wanted to play with building a fully responsive front-end without using Bootstrap and to see how difficult it would be.

##Seed
I used the [gulp angular yo generator](https://github.com/Swiip/generator-gulp-angular) to get started. I hadn't used this generator before, so I figured I would give it a try for this project. I found it to be really awesome, giving all the necessary tools right out of the box. 

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
