var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");
var babelify = require("babelify");

var builds = {
    "build-mars": function() {
        return gulp.src(["Mars/src/MarsEngine.js"])
            .pipe(browserify({
                transform: ["babelify"]
            }))
            .pipe(gulp.dest("Mars/build"))
    },
    "build-game": function() {
        return gulp.src(["Game/src/Game.js"])
            .pipe(browserify({
                transform: ["babelify"]
            }))
            .pipe(gulp.dest("Game/build"))
    }
}

var buildKeys = [];

for (var buildKey in builds) {
    if (builds.hasOwnProperty(buildKey)) {
        buildKeys.push(buildKey);
        gulp.task(buildKey, builds[buildKey]);
    }
}

gulp.task("build", buildKeys, function() {
    
});

gulp.task("default", ["build"], function() {
    
});
