gulp = require 'gulp'

bump = require 'gulp-bump'
git = require 'gulp-git'
path = require 'path'
yargs = require 'yargs'

gulp.task 'bump', (done) ->
  args = yargs.alias('m', 'minor').argv
  type = args.major && 'major' || args.minor && 'minor' || 'patch'
  src = './*.json'

  gulp.src src
    .pipe bump type: type
    .pipe gulp.dest './'
    .on 'end', =>
      version = require(path.join __dirname, 'package').version
      message = "Bump #{version}"
      gulp.src src
        .pipe git.add()
        .pipe git.commit message
        .on 'end', ->
          git.push 'origin', 'master', {}, ->
            git.tag version, message, {}, ->
              git.push 'origin', 'master', args: ' --tags', done
  return