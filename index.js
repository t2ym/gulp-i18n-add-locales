/*
@license https://github.com/t2ym/gulp-i18n-add-locales/blob/master/LICENSE.md
Copyright (c) 2016, Tetsuya Mori <t2y3141592@gmail.com>. All rights reserved.
*/
'use strict';

var path = require('path');
var fs = require('fs');
var gutil = require('gulp-util');
var through = require('through2');
var dom5 = require('dom5');

/**
 * Gulp plug-in to add placeholder JSON files in target locales for i18n-behavior.
 *
 * @namespace gulp-i18n-add-locales
 */
module.exports = function (locales) {
  var localesFolder = 'locales';
  return through.obj(function (file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (!file.isBuffer()) {
      return callback(null, file);
    }

    var stream = this;
    var dirname = path.dirname(file.path);
    var basenames = [];
    var cwd = file.cwd;
    var base = file.base;
    var firstFile = true;

    var contents = String(file.contents);
    var document = dom5.parse(contents);
    var templates = [];
    var i, j;

    dom5.nodeWalkAll(document, function (node) {
      if (dom5.predicates.hasTagName('template')(node)) {
        var is = dom5.getAttribute(node, 'is');
        var parent = node.parentNode;
        var parentTagName = parent && parent.tagName ? 
                              parent.tagName.toLowerCase() : null;
        if (is === 'i18n-dom-bind') {
          return true;
        }
        switch (parentTagName) {
        case 'dom-module':
        case 'body':
        case 'head':
        case 'html':
        case 'i18n-dom-bind':
          return true;
        default:
          return false;
        }
      }
      else {
        return false;
      }
    }, templates);

    for (i = 0; i < templates.length; i++) {
      var moduleId = dom5.getAttribute(templates[i], 'id') ||
                      dom5.getAttribute(templates[i].parentNode, 'id');          
      //console.log('module id = ' + moduleId);
      basenames.push(moduleId);
    }

    var targetDir = path.join(path.dirname(file.path), localesFolder);
    for (j in basenames) {
      var basename = basenames[j];      
      try {
        fs.mkdirSync(targetDir);
      }
      catch (e) {}
      for (i in locales) {
        var target = path.join(targetDir, basename + '.' + locales[i] + '.json');
        var stats;
        try {
          stats = undefined;
          stats = fs.statSync(target);
        }
        catch (e) {}
        if (stats) {
          //console.log('addLocales: existing ' + target);
        }
        else {
          // create an empty placeholder file
          if (firstFile) {
            firstFile = false;
            file.path = target;
            file.contents = new Buffer('{}');
          }
          else {
            stream.push(new gutil.File({
              cwd: cwd,
              base: base,
              path: target,
              contents: new Buffer('{}')
            }));
          }
          //console.log('addLocales: creating ' + target);
        }
      }
    }

    callback(null, firstFile ? null : file);
  });
};
