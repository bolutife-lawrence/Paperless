var gulp = require('gulp'),
  less = require('gulp-less'),
  jade = require('gulp-jade'),
  bower = require('gulp-bower'),
  gutil = require('gulp-util'),
  // concat = require('gulp-concat'),
  chmod = require('gulp-chmod'),
  minify = require('gulp-minify'),
  babelify = require('babelify'),
  notify = require('gulp-notify'),
  livereload = require('gulp-livereload'),
  jshint = require('jshint'),
  browserify = require('browserify'),
  path = require('path'),
  source = require('vinyl-source-stream'),
  imagemin = require('gulp-imagemin'),
  nodemon = require('gulp-nodemon'),
  karma = require('gulp-karma'),
  protractor = require('gulp-protractor').protractor,
  paths = {
    public: 'public/**',
    jade: ['!app/shared/**', 'app/**/*.jade'],
    scripts: 'app/**/*.js',
    main: './app/scripts/application.js',
    images: 'app/images/**/*',
    staticFiles: [
      '!app/**/*.+(less|css|js|jade)',
      '!app/images/**/*',
      'app/**/*.*'
    ],
    unitTests: [
      'public/lib/angular/angular.min.js',
      'public/lib/angular-mocks/angular-mocks.js',
      'public/lib/angular-ui-router/release/angular-ui-router.min.js',
      'public/lib/angular-aria/angular-aria.min.js',
      'public/lib/angular-animate/angular-animate.min.js',
      'public/lib/angular-material/angular-material.min.js',
      'public/lib/angular-resource/angular-resource.min.js',
      'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
      'public/lib/sweetalert/dist/sweetalert.min.js',
      'public/lib/ng-file-upload/ng-file-upload.min.js',
      'public/lib/ng-file-upload-shim/ng-file-upload-shim.min.js',
      'public/lib/ngprogress/build/ngprogress.min.js',
      'public/lib/angular-endless-scroll/dist/angular-endless-scroll.min.js',
      'public/js/bundle.js',
      'tests/unit/**/*.spec.js'
    ],
    libTests: ['lib/tests/**/*.js'],
    styles: 'app/styles/*.+(less|css)'
  };

gulp.task('less', () => {
  gulp.src(paths.styles)
    .pipe(less({
      paths: [path.join(__dirname, './app/styles')]
    }))
    .pipe(chmod(755))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('jade', () => {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(chmod(755))
    .pipe(gulp.dest('./public/'));
});

gulp.task('images', () => {
  gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(chmod(755))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('bower', () => {
  return bower()
    .pipe(chmod(755))
    .pipe(gulp.dest('public/lib/'));
});

gulp.task('minifyJs', ['browserify'], () => {
  gulp.src('./public/js/bundle.js')
    .pipe(minify())
    .pipe(chmod(755))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('browserify', () => {
  return browserify({
      entries: paths.main,
      debug: true
    })
    .transform(babelify, {
      presets: ['es2015']
    })
    .bundle()
    // vinyl-source-stream makes the bundle compatible with gulp
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Browserify ' +
      'Error: in browserify gulp task'))
    .pipe(source('bundle.js')) // Desired filename
    // Output the file
    .pipe(chmod(755))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('lint', () => {
  return gulp.src(['./app/**/*.js', './tests/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('static-files', () => {
  return gulp.src(paths.staticFiles)
    .pipe(chmod(755))
    .pipe(gulp.dest('public/'));
});

gulp.task('nodemon', () => {
  nodemon({
      script: 'server.js',
      ext: 'js',
      ignore: ['public/', 'node_modules/']
    })
    .on('change', ['lint'])
    .on('restart', () => {
      // when the app has restarted, run livereload.
      gulp.src('server.js')
        .pipe(livereload())
        .pipe(notify('Reloading. please wait...'));
    });
});

gulp.task('test:e2e', (cb) => {
  return gulp.src(['./tests/e2e/*.js'])
    .pipe(protractor({
      configFile: './protractor.conf.js',
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))
    .on('error', (e) => {
      console.log(e);
    })
    .on('end', cb);
});

gulp.task('test:unit', () => {
  // Be sure to return the stream
  return gulp.src(paths.unitTests)
    .pipe(karma({
      configFile: __dirname + '/karma.conf.js',
      // autoWatch: false,
      // singleRun: true
      action: 'run'
    }))
    .on('error', () => {
      process.exit(0);
    });
});

gulp.task('watch', () => {
  gulp.watch(paths.jade, ['jade']);
  gulp.watch(paths.styles, ['less']);
  gulp.watch(paths.scripts, ['minifyJs']);
});

gulp.task('build', ['bower', 'jade', 'less', 'static-files',
  'images', 'minifyJs'
]);

gulp.task('heroku', ['build']);
gulp.task('test', ['test:unit', 'test:e2e', 'coveralls']);
gulp.task('default', ['nodemon', 'watch', 'build']);
