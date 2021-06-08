const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    context: path.resolve(__dirname, './src/Private/Scss'),
    entry: "./style.scss",
    output: {
        path: path.resolve(__dirname, "./src/Public/Styles")
    },
    module: {
        rules: [
            {
                test: /.(scss|css)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: path.resolve(__dirname, './src/Public/Styles'),
                        }
                    },
                    "css-loader",
                    'postcss-loader',
                    "sass-loader"
                ]
            }
        ]
    },
    
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}