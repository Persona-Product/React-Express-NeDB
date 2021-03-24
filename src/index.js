import React,{ useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Superagent from 'superagent'
 
const styles = {
    h1: {
        backgroundColor: 'blue',
        color: 'white',
        fontSize: 24,
        padding: 12
    },
    form: {
        padding: 21,
        border: '1px solid silver',
        backgroundColor: '#F0F0F0'
    },
    right: {
        texrAligh: 'right'
    },
    button: {
        marginTop: 10 
    }
}

// Formコンポーネント定義
const Form = (props) => {
//  const [変数, 変数に値を代入する関数名] = useState('変数の初期値')
    const [name, setName] = useState('')
    const [body, setBody] = useState('')

    // 名前入力イベント
    const nameChangeed = (event) => {
        setName(event.target.value)
    }
    // 本文入力イベント
    const bodyChangeed = (event) => {
        setBody(event.target.value)
    }

    // 送信ボタンクリックイベント
    const postClicked = (event) => {
        // Superagentでbbs-server.jsの'/api/write'と通信
        // .query()メソッドで'/api/write'に対してクエリーを送信
        // .end()メソッドはAPIのreturn値を取得し、内容によって処理分岐
        Superagent
        .get('/api/write')
        .query({
            name: name,
            body: body
        })
        .end((err, data) => {
            // エラー処理
            if (err) {
                console.log(err);
            }
            // 本文の変数を空にする
            setBody('')
            if (props.onPost){
                props.onPost
            }
        })
    }

    // Formコンポーネントの見た目の部分、return()で記述
    return (
        <div style={styles.form}>
            名前：<br/>
            <input type="text" value={name} onChange={nameChangeed} /><br/>
            本文：<br/>
            <input type="text" value={body} onChange={bodyChangeed} /><br/>
            <button  style={styles.button} onClick={postClicked}>送信</button>
        </div>
    )
}

// Appコンポーネント定義
const App = () => {
    //  const [変数, 変数に値を代入する関数名] = useState('変数の初期値')
    //  初期値が空配列なのでitemsの型はArray型
    const [items, setItems] = useState([])

    // Appコンポーネントのマウント時にloadLogs()関数実行
    useEffect(() => {
        loadLogs()
    }, [])

    // bbs.dbからデータを取得 ＆ 再読込ボタンクリックイベント
    const loadLogs = () => {
        // Superagentでbbs-server.jsの'/api/getItems'と通信
        // .end()メソッドはAPIのreturn値を取得し、内容によって処理分岐
        Superagent
        .get('/api/getItems')
        .end((err, data) => {
            // エラー処理
            if (err) {
                console.log(err);
                return
            }
            console.log('response', data);
            console.log('response.body', data.body);
            console.log('response.body.logs', data.body.logs);
            // 正常取得できたらsetItems()でitemsに代入
            setItems(data.body.logs)
        })
    }

    // Appコンポーネントの見た目の部分、Formコンポーネント → <Form/>
    return (
        <div>
            <h1  style={styles.h1}>掲示板</h1>
            <Form onPost={loadLogs} />
            <p style={styles.right}>
                <button onClick={loadLogs}>再読込</button>
            </p>
            <ul>
                {/* 【三項演算子】 { 条件式 ? ( true ) : ( false ) } */}
                { items.length !== 0 ? (
                        items.map((item) => (
                            <li key={item._id}>{item.name} - {item.body}</li>
                        ))
                    ) : ( null ) 
                }
            </ul>
        </div>
    )
}

// Reactの仮想DOMを'public/index.html'のid="root"が付いている<div>に<App/>を描画する
ReactDOM.render(
    <App/>,
    document.getElementById('root')
)
