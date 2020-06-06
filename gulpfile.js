'use strict';

const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

function compileSass() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"));
}

function watch() {
    gulp.watch("./src/scss/*.scss", compileSass);
}

exports.compileSass = compileSass;
exports.watch = watch;