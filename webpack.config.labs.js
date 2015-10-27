module.exports = {
    entry: {
        'gestures': './js/labs/gestures/index.js',
        'fan': './js/labs/fan/index.js',
        'ribbon': './js/labs/ribbon/index.js',
        'endlessscroll': './js/labs/endlessscroll/index.js',
        'bouncescroll': './js/labs/bouncescroll/index.js',
        'toss': './js/labs/toss/index.js',
    },
    output: {
        filename: './public/labs/[name]/index.bundle.js'
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
        }
        ]
    }
};
