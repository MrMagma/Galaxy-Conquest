var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");
var babel = require("gulp-babel");
var browserify = require("gulp-browserify");
var jshint = require("gulp-jshint");
var spawnMocha = require("gulp-spawn-mocha");

var builds = {
    "transform-mars-src": function() {
        return gulp.src(["Mars/src/**/*.js"])
            .pipe(jshint({
                
            }))
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
            .pipe(jshint({
                
            }))
            .pipe(jshint.reporter("default"))
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

gulp.task("build", buildKeys);

gulp.task("test", function() {
    return gulp.src(["test/**/*.js"])
        .pipe(spawnMocha())
});

gulp.task("default", ["build", "test"], function() {
    
});
