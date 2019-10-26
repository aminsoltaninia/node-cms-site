// path packaje
require('app-module-path').addPath(__dirname);



const App = require('./app/index');
// congfig ro global tarif mikonim

//USE DOTENV
require('dotenv').config();
global.config =  require('./config/index');

new App();