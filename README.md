# One Roost / Next Steps
## Development Set up

This project uses NPM to manage dependencies.

```
npm install
```

To deploy to dev and watch changes, run the Gulp command:

```
gulp develop
```

this will kick off several tasks, including:

```
build
sass
fonts
transpile
bundle
```

Note, the first time you start the app, you'll need to run "gulp build", but for development after that, you can call "gulp start", which calls "gulp build:dev" under the hood, which is quite a bit faster as it doesn't clean and rebuild and compress files. 

Live application:
[http://aws.oneroost.com](http://aws.oneroost.com)

## Stylesheet Libraries
We depend on several libraries for styles
### Google Material Colors
For information and examples, visit [Google Material Colors](https://www.google.com/design/spec/style/color.html)

For information on the library used in this project: [Sass Material Colors Github](https://github.com/minusfive/sass-material-colors)

### Twitter Bootstrap v3.X
[Twitter Bootstrap Github](https://github.com/twbs/bootstrap-sass)
[Documentation](http://getbootstrap.com/)

## SSH
to ssh run this command:
```
ssh -i ~/.ssh/oneroost-aws-eb ec2-user@52.73.58.128
```

or 
```
eb ssh <env name: stage | prod-blue | prod-green> 
```
