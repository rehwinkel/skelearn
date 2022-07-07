import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const config: webpack.Configuration = {
    devtool: "inline-source-map",
    entry: './src/main.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "assets/[name].[contenthash:8].js",
        publicPath: "/",
        clean: true,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "assets/[name].[contenthash:8].css"
        }),
        new HtmlWebpackPlugin({ template: "./src/index.html", favicon: "./src/logo.svg", inject: true })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                        envName: "production"
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(svg|png)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "assets/[name].[contenthash:8].[ext]"
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    optimization: {
        minimizer: [
            "...",
            new CssMinimizerPlugin(),
        ],
    },
    devServer: {
        port: 3000,
        historyApiFallback: true,
    }
};

export default config;