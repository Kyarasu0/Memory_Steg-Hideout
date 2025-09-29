// import express from "express";みたいな感じ
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();

/*----------expressの初期化----------*/
// expressのままでは使えないのでappに代入
const app = express();

/*----------file/directory操作の豆知識(今回は自動で反映されているらしい)----------*/
// 例: import.meta.url = file:///C:/projects/Backend/server.js
// 例: fileURLToPath(import.meta.url) = C:/projects/Backend/server.js(file:///を取り除いた)
// const __filename = fileURLToPath(import.meta.url);

// 例: path.dirname(__filename) = C:/projects/Backend(Directory名のみに変換する)
// const __dirname = path.dirname(__filename);
/*----------file/directory操作の豆知識(今回は自動で反映されているらしい)----------*/

/*----------port番号の設定系----------*/
//port番号を設定する
const PORT = process.env.PORT || 3000;

/*----------use系----------*/
// jsonを読み込めるようにする
app.use(express.json());
// cssやjsを読めるようにする
app.use(express.static(path.join(__dirname, "Frontend")));

/*----------ルーティング系----------*/
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "Frontend", "Home", "Home.html"));
});

/*----------サーバー起動----------*/
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// サーバーを起動するときはProjects/Backend内でnpx nodemon server.jsを実行