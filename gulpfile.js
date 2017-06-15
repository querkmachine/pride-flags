'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', ['watch']);
gulp.task('production', ['sass', 'js', 'js:vendor', 'images']);
gulp.task('force', ['production']);

gulp.task('watch', () => {
	const watch = require('gulp-watch');
	const batch = require('gulp-batch');
	watch('./src/scss/**/*.scss', batch((events, done) => { gulp.start('sass', done); }));
	watch('./src/js/**/*.js', batch((events, done) => { gulp.start('js', done); }));
	watch('./src/images/**/*', batch((events, done) => { gulp.start('images', done); }));
});

/*
 * Sass compilation
 */

gulp.task('sass', () => {
	const sass = require('gulp-sass');
	const autoprefixer = require('gulp-autoprefixer');
	gulp.src('./src/scss/*.scss')
	.pipe(plumber())
	.pipe(sass({
		outputStyle: 'compressed'
	}))
	.pipe(autoprefixer({
		browsers: ['last 2 version', 'ie 9', 'ie 10'],
		cascade: true
	}))
	.pipe(gulp.dest('./dst/css'));
});

/**
 * JavaScript compilation
 */

gulp.task('js', ['js:vendor'], () => {
	const babel = require('gulp-babel');
	const concat = require('gulp-concat');
	const merge = require('merge-stream');
	var folders = ['scripts'];
	var tasks = folders.map((folder) => {
		return gulp.src(`./src/js/${folder}/**/*.js`, {
			base: `./src/js/${folder}`
		})
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(concat(`${folder}.js`))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./dst/js'))
	});
	merge(tasks);
});

gulp.task('js:vendor', () => {
	const concat = require('gulp-concat');
	const merge = require('merge-stream');
	const folders = ['preload', 'vendor'];
	const tasks = folders.map((folder) => {
		return gulp.src(`./src/js/${folder}/**/*.js`, {
			base: `./src/js/${folder}`
		})
		.pipe(plumber())
		.pipe(concat(`${folder}.js`))
		.pipe(gulp.dest('./dst/js'))
	});
	merge(tasks);
});

/**
 * Image teleportation
 */

gulp.task('images', () => {
	gulp.src('./src/images/**/*')
	.pipe(gulp.dest('./dst/images'));
});