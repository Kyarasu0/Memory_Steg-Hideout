// 必要なモジュール読み込み
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const multer = require('multer');
const { execFile } = require("child_process");

/*----------expressの初期化----------*/
const app = express();

/*----------port番号の設定系----------*/
const PORT = process.env.PORT || 3000;

/*----------use系----------*/
// JSONを読み込めるようにする
app.use(express.json());
// CSSやJSなどの静的ファイルを読み込めるようにする
app.use(express.static(path.join(__dirname, "..", "Frontend")));

/*----------ルーティング系----------*/
// ホーム
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "Frontend", "Home", "Home.html"));
});

// CreateHideout ページ
app.get("/CreateHideout", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "CreateHideout", "CreateHideout.html"));
});

// C++ 実行ファイルを呼び出すAPI
app.get("/runCpp", (req, res) => {
    // separation.cpp を事前に g++ separation.cpp -o separation.exe でコンパイルしておくこと
    const exePath = path.join(__dirname, "separation.exe"); // Windowsの場合
    // const exePath = path.join(__dirname, "separation"); // Linux/Macの場合

    execFile(exePath, (error, stdout, stderr) => {
        if (error) {
            console.error("エラー:", error);
            res.status(500).send("C++ 実行中にエラーが発生しました");
            return;
        }
        if (stderr) {
            console.error("stderr:", stderr);
        }
        // C++ の標準出力をそのまま返す
        res.send(`C++ 実行結果: ${stdout}`);
    });
});

/*----------サーバー起動----------*/
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// サーバー起動方法: Projects/Backend 内で
// npx nodemon server.js
