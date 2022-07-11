import * as path from 'path';
import * as webpack from 'webpack';
import 'webpack-dev-server';
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const config: (_: any, args: any) => webpack.Configuration = (_, args) => {
    let SKELEARN_HOST = process.env["SKELEARN_HOST"];
    if (args.mode === "production") {
        console.log("Using host '" + SKELEARN_HOST + "' for production build.");
    }
    return {
        devtool: args.mode === "development" ? "inline-source-map" : false,
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
            new HtmlWebpackPlugin({ template: "./src/index.html", favicon: "./src/logo.svg", inject: true }),
            new webpack.DefinePlugin({
                API_URL: args.mode === "development" ? JSON.stringify("http://localhost:8080/api/v1") : JSON.stringify("https://" + SKELEARN_HOST + "/api/v1"),
            }),
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
};

export default config;