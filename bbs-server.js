// bbs.dbに接続
// NeDBっていうファイルベースのデータベース
const NeDB = require("nedb")
const path = require("path")
const db = new NeDB({
    filename: path.join(__dirname, 'bbs.db'),
    autoload: true
})

// Nodejsサーバーを起動
// ExpressっていうNodejsのフレームワーク
const express = require('express')
const app = express()
const portNo = 3001
app.listen(portNo, () => {
    console.log(`起動しました, http://localhost:${portNo}`);
})

// publicディレクトリ以下は自動的に返す
app.use('/public', express.static('./public'))
// トップへのアクセスを/publicへ返す
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

// ＝＝＝＝＝＝＝＝＝＝＝＝＝APIの定義＝＝＝＝＝＝＝＝＝＝＝＝＝
// データベースから取得するAPI
app.get('/api/getItems', (req, res) => {
    // .find({})はNeDBのクエリー、全てのデータを取得
    // データベースを書き込み時刻でソート
    // 結果をsrc/index.jsにreturnする
    db
    .find({})
    .sort({stime: 1})
    .exec((err, data) => {
        if (err) {
            return sendJSON(res, false, {logs: [], msg: err})
        }
        return sendJSON(res, true, {logs: data})
    })
})

// 新規投稿を書き込むAPI
app.get('/api/write', (req, res) => {
    const q = req.query
    // .insert({})はNeDBのクエリー、src/index.jsから受け取ったクエリーを書き込む
    // URLパラメーターの値をDBに書き込む
    // 結果をsrc/index.jsにreturnする
    db
    .insert({
        name: q.name,
        body: q.body,
        stime: (new Date()).getTime()
    }, (err, doc) => {
        if (err) {
            return sendJSON(res, false, {msg: err})
        }
        return sendJSON(res, true, {id: doc._id})
    })
})

function sendJSON(res, result, obj) {
    // result ・・・ 成功したかどうか？ 
    // trueかfalseをresultと紐付け
    console.log('before', obj);
    obj['result'] = result
    console.log('after', obj);
    // フロント側にreturnする実体はコレ
    return res.json(obj)
    
}