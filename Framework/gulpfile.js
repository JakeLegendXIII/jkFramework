﻿
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var gulpRename = require('gulp-rename');
var angularFilesort = require('gulp-angular-filesort');
var strip = require('gulp-strip-line');
var templateCache = require('gulp-angular-templatecache');


gulp.task('buildMenuTemplateCache', function () {
    return gulp
        .src([
            './ext-modules/jkMenu/**/*.html'
        ])
        .pipe(templateCache({
            root: 'ext-modules/jkMenu/',
            module: 'jkMenu'
        }))
        .pipe(gulp.dest('./ext-modules/jkMenu/'))
    ;
});

gulp.task('buildDashboardTemplateCache', function () {
    return gulp
        .src([
            './ext-modules/jkDashboard/**/*.html'
        ])
        .pipe(templateCache({
            root: 'ext-modules/jkDashboard/',
            module: 'jkDashboard'
        }))
        .pipe(gulp.dest('./ext-modules/jkDashboard/'))
    ;
});

gulp.task('buildFrameworkTemplateCache', function () {
    return gulp
        .src([
            './ext-modules/jkFramework/**/*.html'
        ])
        .pipe(templateCache({
            root: 'ext-modules/jkFramework/',
            module: 'jkFramework'
        }))
        .pipe(gulp.dest('./ext-modules/jkFramework/'))
    ;
});

gulp.task('buildJavaScript', function () {
    return gulp
        .src([
            './ext-modules/**/*.js'
        ])
        .pipe(angularFilesort())
        .pipe(strip(["use strict"]))
        .pipe(concat('jkFramework.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulpRename('jkFramework.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'))
    ;
});

gulp.task('buildCSS', function () {
    return gulp
        .src([
            './ext-modules/**/*.css'
        ])
        .pipe(concat('jkFramework.css'))
        .pipe(gulp.dest('./dist/'))
        .pipe(gulpRename('jkFramework.min.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('./dist/'))
    ;
});

gulp.task('buildAllTemplateCache', ['buildFrameworkTemplateCache', 'buildDashboardTemplateCache', 'buildMenuTemplateCache']);

gulp.task('buildDist', ['buildJavaScript', 'buildCSS']);