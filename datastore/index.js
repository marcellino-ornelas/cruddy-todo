const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const async = require('async');
const counter = require('./counter');

var items = {};
// var exports.dataDir = path.join( process.cwd(), './data/');

var _cb = (function(id, text, callback) {

  if ( typeof text === 'function' ) {
    callback = text;
    text = null;
  }

  return function(err, result) {
    err ? callback(err) : callback(null, {id: id, text: (text || result || '') });
  };
});

// Public API - Fix these CRUD functions ///////////////////////////////////////

var getPath = (id) => path.join(exports.dataDir, id + '.txt');

exports.create = (text, callback) => {
  counter.getNextUniqueId(function( err, id ) {
    
    fs.writeFile( getPath(id), text, _cb(id, text, callback) );

  });
};

exports.readOne = (id, callback) => {
  
  fs.readFile( getPath(id), 'utf8', _cb(id, callback));

};

exports.readAll = (callback) => {

  async.map( 
    fs.readdirSync(exports.dataDir), 
    function(id, done) { exports.readOne( path.basename(id, '.txt'), done ); },
    callback
  );

};

exports.update = (id, text, callback) => {

  var path = getPath(id);

  fs.access( path, fs.constants.F_OK, (err) => {
    if (err) { return callback(err); }
    
    fs.writeFile( path , text, _cb(id, text, callback) );

  });

};

exports.delete = (id, callback) => {

  fs.unlink( getPath(id), callback );

};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
