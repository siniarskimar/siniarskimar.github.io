const gulp = require("gulp");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const gulpSass = require("gulp-sass")(require("sass"));

function clean(cb) {
    const distDir = path.resolve(__dirname, "dist");
    if (fs.existsSync(distDir)) {
        fsp.rm(distDir, { recursive: true, force: true })
    }
    cb();
}
function scssCompile() {
    return gulp.src(
        ["./scss/index.scss"]
    ).pipe(gulpSass.sync().on('error', gulpSass.logError))
        .pipe(gulp.dest("./dist/css"));
}
function copyPublic() {
    return gulp.src(["./public/**/*"])
        .pipe(gulp.dest("./dist"));
}
function copyJs() {
    return gulp.src(["./js/**/*"]).pipe(gulp.dest("./dist/js"));
}

exports.clean = clean;
exports.build = gulp.parallel(copyPublic, copyJs, scssCompile);
exports.default = exports.build;
exports.watch = gulp.series(exports.build, function () {
    gulp.watch("./scss/**/*.scss", scssCompile);
    gulp.watch("./js/**/*", copyJs);
    gulp.watch("./public/**/*", copyPublic);
})