import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const config: webpack.Configuration = {
    mode: 'production',
    devtool: "hidden-source-map",
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
                test: /\.svg$/,
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
        extensions: [".ts", ".tsx"]
    },
    optimization: {
        minimizer: [
            "...",
            new CssMinimizerPlugin(),
        ],
    }
};

export default config;