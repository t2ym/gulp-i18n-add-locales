# gulp-i18n-add-locales

Add placeholder JSON files for target locales for [i18n-behavior](https://github.com/t2ym/i18n-behavior)

Project template available at [polymer-starter-kit-i18n](https://github.com/t2ym/polymer-starter-kit-i18n). On Github Pages (https://t2ym.github.io/polymer-starter-kit-i18n)

## Features

- Add placeholder empty JSON files in locales folder for the target custom element
- `<template is="i18n-dom-bind" id="module id">` is searched for id
- `<dom-module id="module id">` is searched for id

## Install

```
    npm install --save-dev gulp-i18n-add-locales
```

## Usage

```javascript
    var gutil = require('gulp-util');
    var i18nAddLocales = require('gulp-i18n-add-locales');

    var config = {
      // list of target locales to add
      locales: gutil.env.targets ? gutil.env.targets.split(/ /) : []
    }

    // Add locales to I18N-ready elements and pages
    gulp.task('locales', function() {
      var elements = gulp.src([ 'app/elements/**/*.html' ], { base: 'app' })
        .pipe($.grepContents(/i18n-behavior.html/))
        .pipe($.grepContents(/<dom-module /));

      var pages = gulp.src([
          'app/**/*.html',
          '!app/{bower_components,styles,scripts,images,fonts}/**/*'
        ], { base: 'app' })
        .pipe($.grepContents(/is=['"]i18n-dom-bind['"]/));

      return merge(elements, pages)
        .pipe(i18nAddLocales(config.locales))
        .pipe(gulp.dest('app'))
        .pipe($.size({
          title: 'locales'
        }));
    });
```

## API

`i18nAddLocales(locales)`

- locales: Array of String, list of target locales to add their placeholder JSON files

## License

[BSD-2-Clause](https://github.com/t2ym/gulp-i18n-add-locales/blob/master/LICENSE.md)
