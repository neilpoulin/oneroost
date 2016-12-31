
export const bootstrapRoot = "./node_modules/bootstrap-sass/";
export const bootstrapPaths = {
    fonts: bootstrapRoot + "assets/fonts/**/*",
    stylesheets: bootstrapRoot + "assets/stylesheets"
};

export const fontAwesomeRoot = "./node_modules/font-awesome/";
export const fontAwesomePaths = {
    fonts: fontAwesomeRoot + "fonts/**/*",
    stylesheets: fontAwesomeRoot + "scss"
};

export const materialColorsRoot = "./node_modules/sass-material-colors/";
export const GoogleMaterialColors = {
    stylesheets: materialColorsRoot + "sass"
};

export const reactModalBootstrap = {
    stylesheets: "./node_modules/react-bootstrap-modal/lib/styles/rbm-patch.less"
};

export const infiniteCalendar = {
    stylesheets: "./node_modules/react-infinite-calendar/styles.css"
}

export const paths = {
    src: {
        root: "./src",
        webpackModules: "./src/jsx",
        jsEntry: "./src/jsx/index.jsx",
        frontend: ["./src/jsx/**/*.jsx","./src/jsx/**/*.js"],
        node: ["./src/node/**/*.js"],
        nodetemplates: ["./src/node/**/*.hbs", "./src/node/**/*.scss", "./src/node/**/*.json", "./src/node/**/*.ejs" ],
        gulpfile: ["./gulpfile.babel.js"],
        styles: ["./src/scss/**/*.scss"],
        styleEntry: "./src/scss/index.scss",
        all: ["./src/**/*.js", "./src/**/*.jsx", "./cloud/**/*.js", "./gulpfile.js"],
        fonts: [bootstrapPaths.fonts, fontAwesomePaths.fonts, "./src/fonts/**/*"]
    },
    build: {
        root: "./build",
        frontendjs: "./build/frontendjs",
        node: "./build/node",
        nodeStyles: "./build/node/email/template/style/target",
        nodeFonts: "./build/node/email/template/style/target/fonts",
        jsbundle: "./build/dist/frontendjs",
        cssbundle: "./build/dist/css",
        sourceFile: "./build/frontendjs/index.js",
        sourceMaps: ".build/**/*.js.map"
    },
    dest: {
        root: "./public",
        css: "./public/css",
        frontendjs: "./public/bundle",
        cloud: "./cloud",
        fonts: "./public/css/fonts",
        styleName: "styles.css",
        scriptName: "bundle.js"
    }
};