var gulp = require('gulp');
var GulpEste = require('gulp-este');
var runSequence = require('run-sequence');

var este = new GulpEste(__dirname, undefined, '../../../..');

var paths = {
  jsx: 'src/**/*.jsx',
  js: [
    'bower_components/closure-library/**/*.js',
    'bower_components/chance/**/*.js',
    'bower_components/lodash/**/*.js',
    'bower_components/este-library/este/**/*.js',
    'src/**/*.js',
    'tmp/**/*.js',
    '!**/build/**'
  ],
  thirdParty: {
    development: ['bower_components/react/react-with-addons.js'],
    production: ['bower_components/react/react-with-addons.min.js']
  },
  compiler: 'bower_components/closure-compiler/compiler.jar',
  externs: ['bower_components/react-externs/externs.js']
};

gulp.task('default', ['watch', 'js']);

gulp.task('watch', function() {
  gulp.watch(paths.jsx, ['js']);
});

gulp.task('js', function(done) {
  runSequence(
    'jsx',
    'deps',
    'concat-deps',
    // 'compile-js',
    'concat-all',
    done
  );
});

gulp.task('jsx', function() {
  return este.jsx(paths.jsx);
});

gulp.task('deps', function() {
  return este.deps(paths.js);
});

gulp.task('concat-deps', function() {
  return este.concatDeps(paths.js);
});

gulp.task('concat-all', function() {
  return este.concatAll({'build/app.js': paths.thirdParty});
});

gulp.task('compile-js', function() {
  var files = [].concat(
    paths.js,
    paths.thirdParty.development
  );
  return este.compile(paths.js, 'build', {
    compilerPath: paths.compiler,
    compilerFlags: {
      // compilation_level: 'ADVANCED',
      compilation_level: 'SIMPLE',
      closure_entry_point: 'ris.index',
      externs: paths.externs,
      formatting: 'PRETTY_PRINT',
      create_source_map: 'build/app.js.map',
      debug: true
    }
  });
});
