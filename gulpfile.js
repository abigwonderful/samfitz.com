var gulp = require('gulp'),
		gutil = require('gulp-util'),
		uglify = require('gulp-uglify'),
		compass = require('gulp-compass'),
		concat  = require('gulp-concat'),
		notify = require('gulp-notify'),
		EXPRESS_PORT = 4000,
		EXPRESS_ROOT = __dirname,
		LIVERELOAD_PORT = 35729;;

// making things more readable by
// encapsulating each part's setup
// in its own method
function startExpress() {
  var express = require('express');
  var app = express();
  app.use(require('connect-livereload')());
  app.use(express.static(EXPRESS_ROOT));
  app.listen(EXPRESS_PORT);
}

// We'll need a reference to the tinylr
// object to send notifications of file changes
var lr;
function startLivereload() {
  lr = require('tiny-lr')();
  lr.listen(35729);
}

// Notifies livereload of changes detected
// by `gulp.watch()` 
function notifyLivereload(event) {
  // `gulp.watch()` events provide an absolute path
  // so we need to make it relative to the server root
  var fileName = require('path').relative(EXPRESS_ROOT, event.path);
 
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

//paths for css/scss
var paths = {
  styles: {
    src:  'scss/*.scss',
    dest: 'stylesheets'
  }
};
// our task for watching scsss and building the css
gulp.task('styles', function () {
  return gulp.src(paths.styles.src)
    .pipe(compass({
      config_file: './config.rb',
      css: 'css',
      sass: 'scss'
    }))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(gulp.dest(paths.styles.dest));
});


gulp.task('default', function() {
	// get our scss going
  gulp.start('styles');
  // fire up express
  startExpress();
  startLivereload();
});

gulp.task('watch', function() {
	gulp.watch('scss/*.scss', ['styles']);
	gulp.watch('*.html', notifyLivereload);

	
});