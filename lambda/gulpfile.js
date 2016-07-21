var gulp   = require("gulp");
var lambda = require("gulp-awslambda");
var zip    = require("gulp-zip");
var eslint = require("gulp-eslint");

gulp.task("deploy:email", ["lint"], function() {
	var lambda_params = {
		FunctionName: "email-ingest",
		Role: "arn:aws:iam::062773471215:role/lambdaExecute"
	}

	var opts = {
		profile: "oneroost",
		region: "us-east-1",
		Publish: true
	}

	return gulp.src("./incoming-email/**/*")
		.pipe(zip("lambda.zip"))
		.pipe(lambda(lambda_params, opts))
		.pipe(gulp.dest("./incoming-email"));
});

gulp.task("lint", function () {
	return gulp.src("./incoming-email/index.js")
	.pipe(eslint())
	.pipe(eslint.format());
});
