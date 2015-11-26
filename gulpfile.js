var gulp = require("gulp");
var util = require("gulp-util");
var concat = require("gulp-concat");

var builds = {
    "build-mars": function() {
        return gulp.src(["Mars/src/**/*.js"])
            .pipe(concat("Mars.js"))
            .pipe(gulp.dest("Mars/build"))
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
