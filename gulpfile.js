'use strict';

const gulp = require("gulp");
const sass = require("gulp-sass");
sass.compiler = require("node-sass");

function compileSass() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./css"));
}

exports.compileSass = compileSass;