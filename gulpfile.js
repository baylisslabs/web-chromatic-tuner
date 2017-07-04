"use strict";

let gulp = require("gulp");
let fs = require("fs");
let ts = require("gulp-typescript");
let source = require("vinyl-source-stream");
let buffer = require("vinyl-buffer");
let browserify = require("browserify");
let tsify = require("tsify");
let uglify = require("gulp-uglify");
let envify = require("envify/custom");
let sass = require("gulp-sass");
let autoprefixer = require("gulp-autoprefixer");
let imagemin = require("gulp-imagemin");
let uglifycss = require("gulp-uglifycss");
let sourcemaps = require("gulp-sourcemaps");
let rename = require("gulp-rename");
let transform = require("gulp-transform");
let env = require("gulp-environment");
let revCollector = require("gulp-rev-collector");
let revReplace = require("gulp-rev-replace");
let minifyHTML   = require("gulp-htmlmin");
let replace = require("gulp-replace");
let replaceAsync = require("gulp-replace-async");
let rev = require("gulp-rev");
let del = require("del");
let runSequence = require("run-sequence");
let inlineSource = require ("gulp-inline-source");
let exec = require('child_process').exec;

const tsProject = ts.createProject("tsconfig.json");

gulp.task('compile-server', () => {
    return tsProject.src()
        .pipe(tsProject())
        .pipe(gulp.dest("dist/iso"));
})

gulp.task('compile-web', (cb) => {
    let tasks = ["web/src/worker.ts","web/src/main.ts",].map(src=>()=>
        new Promise(function(resolve, reject) {
            browserify({
                debug: env.is.production(),
            })
            .add(src)
            .plugin(tsify, {
                target: "es5",
                lib: [ "es5", "es2015.promise", "es2015.core", "es2015.iterable", "dom" ]
            })
            .transform(envify())
            .bundle()
            .on('error', error => console.error(error.toString()))
            .pipe(source(src))
            .pipe(buffer())
            .pipe(rename({
                dirname: "",
                extname: ".bundle.js"
            }))
            .pipe(env.if.production(uglify()))
            .pipe(rev())
            .pipe(gulp.dest("dist/www/js"))
            .pipe(rev.manifest("rev/js/rev-manifest.json",{
                merge: true
            }))
            .pipe(gulp.dest(""))
            .on("end",resolve)
        }));

    /* todo clean up */
    return tasks[0]().then(()=>tasks[1]());
})

gulp.task("jss", () => {
    let { render } = require("./dist/iso/styles/render-css");
    let css = render();
    let stream = source("main.css");
    stream.end(css);
    stream.pipe(env.if.production(uglifycss({
        "maxLineLen": 80,
        "uglyComments": true
    })))
    .pipe(gulp.dest("dist/www/css"));
});

gulp.task('images', () => {
    return gulp.src('web/images/**/*.+(png|jpg|gif|svg)')
    .pipe(env.if.production(uglifycss(imagemin())))
    .pipe(gulp.dest('dist/www/images'))
});

gulp.task('fonts', () => {
    return gulp.src('web/fonts/**/*')
    .pipe(gulp.dest('dist/www/fonts'))
})

gulp.task('static', () => {
    return gulp.src('web/**/*.+(json|xml)')
    .pipe(gulp.dest('dist/www'))
})

gulp.task('templates', () => {
    let { renderAppComponent } = require("./render-component");
    let { version } = JSON.parse(fs.readFileSync("web/package.json"));

    return gulp.src(['rev/**/*.json','web/**/*.+(html)'])
    .pipe(revCollector())
    .pipe(inlineSource({
        rootpath: "dist/www",
        compress: false
    }))
    .pipe(replaceAsync(/{% appComponent %}/, (match,cb)=>
        renderAppComponent().then(html=>cb(null,html))
    ))
    .pipe(env.if.production(minifyHTML({
        removeComments: true,
        collapseWhitespace: true
    })))
    .pipe(replace(/{% version %}/,`<!-- ${version} -->`))
    .pipe(gulp.dest('dist/www'))
})

gulp.task("offline-manifest",() => {
    let manifest = JSON.parse(fs.readFileSync("rev/js/rev-manifest.json"));
    let { version } = JSON.parse(fs.readFileSync("web/package.json"));
    return gulp.src(['web/**/*.appcache'])
    .pipe(replace(/main.bundle\.js/,manifest["main.bundle.js"]))
    .pipe(replace(/worker.bundle\.js/,manifest["worker.bundle.js"]))
    .pipe(replace(/{% version %}/,version))
    .pipe(gulp.dest('dist/www'))
});

gulp.task("watch", ["build"], () => {
    gulp.watch("web/src/**/*.+(ts|tsx)", ["compile-web"]);
    gulp.watch("web/scss/**/*.scss", ["sass"]);
    gulp.watch("web/images/**/*.+(png|jpg|gif|svg)", ["images"]);
    gulp.watch("web/fonts/**/*'", ["fonts"]);
    gulp.watch("web/**/*.+(html)", ["static"]);
    gulp.watch("app/**/*.ts", ["compile-server"]);
});

gulp.task('clean-web', () => {
    return del.sync(['dist/www','rev']);
});

gulp.task('clean-server', () => {
    return del.sync('dist/iso');
});

gulp.task('clean', () => {
    return del.sync('dist');
});

gulp.task('build-web', (callback) => {
    runSequence("clean-web",
      "bump-dist-version",
      "jss",
      "compile-web",
      [ "static", "images", "fonts" ],
      ["templates", "offline-manifest"],
      callback
    );
});

gulp.task('bump-dist-version', (cb) => {
    exec('cd web && npm version patch', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
  });
});

gulp.task('build-server', (callback) => {
    runSequence("clean-server", "compile-server",
        callback
    );
});

gulp.task('build', (callback) => {
    runSequence("build-server","build-web",
        callback
    );
});

