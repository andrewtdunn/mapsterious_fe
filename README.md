![alt text](https://github.com/andrewtdunn/mapsterious_fe/blob/master/mapsterious.png "mapsterious")

# Mapsterious.com

<a href="http://www.mapsterious.com" target="_blank">Live Site</a>

> notes:

> Uses the panTo function [described here on stack overload](http://stackoverflow.com/questions/9335150/slow-down-google-panto-function/31203045)

> Restaurant reviews are generated from the yelp-fusion api.

> Recreation location and school information is from the wikipedia api

> api.mapsterious.com is used as middleware for yelp-fusion calls.

> mapsterious (v2) is written in vue.js. the <a href="https://github.com/andrewtdunn/fortGreeneMap" target="_blank">og</a> was written in knockout.js

> the mapsterious rest api is served by <a href="http://api.mapsterious.com" target="_blank">the admin site</a>which is written in flask




## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
