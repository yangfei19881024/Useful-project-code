var webpack = require('webpack');
var path = require("path");
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin; //压缩js

var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  entry: {
    bundle1: './main1.js',
    bundle2: './main2.js'
  },
  output: {
    path:path.resolve(__dirname,"assets/"),
    filename: 'js/[name].[chunkhash:8].js'
  },
  plugins: [
    // new uglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new ExtractTextPlugin('app.css'),
    new CommonsChunkPlugin({
      name: 'vendors',
      filename:"vendors.min.js",
    }),
    new HtmlWebpackPlugin({ //如果没有这些配置默认在output.path设定的目录下自动生成index.html文件
      title:"测试webpack", //改变title
      filename:'demo.html',//在output.path设定的目录下生成的文件名
      template:'./index2.html',// 一般以src 里文件为模版
      inject:'body',//配合template 把output.filename 组合成script 注入到 html文件里的script上
      chunks:['vendors','bundle2'] //设置哪些chunks 会被注入在script里,一般是公共的文件，和［某个页面］所依赖的［所有］js文件
    })
  ],
  module: {
    loaders:[
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style','css?minimize')
      },
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react'
      },
    ]
  },
  resolve: {
    // 现在可以写 require('file') 代替 require('file.js')
    extensions: ['', '.js', '.json', '.coffee']
  }
};
