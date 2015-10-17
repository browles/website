module.exports = {
    entry: {
        'index': './js/home/index.js',
        'worker': './js/home/worker.js'
    },
    output: {
        filename: './public/[name].bundle.js'
    },
    module: {
        loaders: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            exclude: /node_modules/
        }
        ]
    }
};
