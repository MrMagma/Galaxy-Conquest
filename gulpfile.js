var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var babel = require("gulp-babel");

var _ = require("underscore");

var marsDeps = ["node_modules/underscore/underscore-min.js"];

var builds = {
    "build-mars": function() {
        return gulp.src(_.union(marsDeps, ["Mars/src/**/*.js"]))
            .pipe(babel())
            .pipe(concat("Mars.js"))
            .pipe(gulp.dest("Mars/build"))
    },
    "build-game": function() {
        return gulp.src(["Game/src/**/*.js"])
            .pipe(babel())
            .pipe(concat("Game.js"))
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
