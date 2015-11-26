var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var babel = require("gulp-babel");
var browserify = require("gulp-browserify");

var builds = {
    "transform-mars-src": function() {
        return gulp.src(["Mars/src/**/*.js"])
            .pipe(babel())
            .pipe(gulp.dest("Mars/build/"))
    },
    "build-mars-src": function() {
        return gulp.src(["Mars/build/MarsEngine.js"])
            .pipe(browserify())
            .pipe(gulp.dest("build/"))
    },
    "build-mars": ["transform-mars-src", "build-mars-src"],
    "transform-game-src": function() {
        return gulp.src(["Game/src/**/*.js"])
            .pipe(babel())
            .pipe(gulp.dest("Game/build/"))        
    },
    "build-game-src": function() {
        return gulp.src(["Game/build/Game.js"])
            .pipe(browserify())
            .pipe(gulp.dest("build/"))        
    },
    "build-game": ["transform-game-src", "build-game-src"]
}

var buildKeys = [];

for (var buildKey in builds) {
    if (builds.hasOwnProperty(buildKey)) {
        buildKeys.push(buildKey);
        if (builds[buildKey].constructor === Array) {
            gulp.task(buildKey, builds[buildKey]);
        } else {
            gulp.task(buildKey, builds[buildKey]);
        }
    }
}

gulp.task("build", buildKeys, function() {
    
});

gulp.task("default", ["build"], function() {
    
});
