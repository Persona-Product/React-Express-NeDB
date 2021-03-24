const path = require('path')
module.exports = {
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                      // プリセットを指定することで、ES2020 を ES5 に変換
                      "@babel/preset-env",
                      // React の JSX を解釈
                      "@babel/react"
                    ]
                  }
            },
            {
                test: /\.css$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader',
                        options: {
                            presets: ['style', 'css?modules']
                        },
                    },
                    { loader: 'sass-loader' }
                ],
            }
        ]
    },
    target: ["web", "es5"],
}