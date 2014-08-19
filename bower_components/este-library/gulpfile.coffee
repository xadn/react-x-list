gulp = require 'gulp'

GulpEste = require 'gulp-este'
express = require 'express'
runSequence = require 'run-sequence'

yargs = require 'yargs'

este = new GulpEste __dirname, true, '../../../..'

paths =
  stylus: 'este/**/*.styl'
  coffee: '{este,server}/**/*.coffee'
  jsx: '{este,server}/**/*.jsx'
  scripts: [
    'bower_components/closure-library/**/*.js'
    '{este,server}/**/*.js'
  ]
  unittest: [
    '{este,server}/**/*_test.js'
  ]
  compiler: 'bower_components/closure-compiler/compiler.jar'
  externs: [
    'bower_components/react-externs/externs.js'
  ]
  open: 'http://localhost:8000/este/demos'
  packages: './*.json'

dirs =
  googBaseJs: 'bower_components/closure-library/closure/goog'
  watch: [
    'este'
    'server'
  ]

gulp.task 'stylus', ->
  este.stylus paths.stylus

gulp.task 'coffee', ->
  este.coffee paths.coffee

gulp.task 'jsx', ->
  este.jsx paths.jsx

gulp.task 'deps', ->
  este.deps paths.scripts

gulp.task 'concat-deps', ->
  este.concatDeps()

gulp.task 'unittest', ->
  este.unitTest dirs.googBaseJs, paths.unittest

gulp.task 'transpile', (done) ->
  runSequence 'stylus', 'coffee', 'jsx', done

gulp.task 'js', (done) ->
  runSequence [
    'deps' if este.shouldCreateDeps()
    'concat-deps'
    'unittest'
    done
  ].filter((task) -> task)...

gulp.task 'build', (done) ->
  runSequence 'transpile', 'js', done

gulp.task 'compile', ->
  namespaces = este.getProvidedNamespaces './tmp/deps.js', /\['(este\.[^']+)/g
  este.compile paths.scripts, 'tmp',
    fileName: 'app.js'
    compilerPath: paths.compiler
    compilerFlags:
      # NOTE(steida): closure_entry_point ensures that whole este-library is
      # checked by compiler.
      closure_entry_point: namespaces
      externs: paths.externs

gulp.task 'test', (done) ->
  runSequence 'build', 'compile', done

gulp.task 'watch', ->
  este.watch dirs.watch,
    coffee: 'coffee'
    js: 'js'
    jsx: 'jsx'
    styl: 'stylus'
  , (task) -> gulp.start task

gulp.task 'server', ->
  require './server'
  args = yargs.alias('n', 'noopen').argv
  return if args.noopen
  este.open paths.open

gulp.task 'run', (done) ->
  runSequence 'watch', 'server', done

gulp.task 'default', (done) ->
  runSequence 'build', 'run', done

gulp.task 'bump', (done) ->
  este.bump './*.json', yargs, done