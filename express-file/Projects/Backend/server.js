// import express from "express";みたいな感じ
const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');

/*----------expressの初期化----------*/
// expressのままでは使えないのでappに代入
const app = express();
const upload = multer({ dest: 'uploads/' });

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
app.use(express.static(path.join(__dirname, "..", "Frontend")));
// 解凍した画像が入るtmpフォルダ
app.use('/tmp', express.static(path.join(__dirname, 'tmp')));

/*----------ルーティング系----------*/
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "..", "Frontend", "Home", "Home.html"));
});

app.get("/StepIntoHideout", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "StepIntoHideout", "StepIntoHideout.html"));
});

app.get('/gallery/:galleryId', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Gallery', 'Gallery.html'));
});

// ZIPの解凍処理と初期データの返却
app.post("/step-in", upload.single("zipFile"), (req, res) => {
    const zipPath = req.file.path;
    // ランダムな文字列でギャラリー名を生成
    const galleryId = Math.random().toString(36).substring(2, 12);
    const extractDir = path.join(__dirname, 'tmp', galleryId);

    if (!fs.existsSync(extractDir)) {
        fs.mkdirSync(extractDir, { recursive: true });
    }

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractDir, true);
        fs.unlinkSync(zipPath); 

        const imageFiles = fs.readdirSync(extractDir)
                             .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));

        if (imageFiles.length === 0) {
            return res.status(400).json({ error: 'ZIP内に画像ファイルが見つかりません。' });
        }
        res.redirect(`/gallery/${galleryId}`);

    } catch (err) {
        res.status(500).json({ error: "ファイルの処理に失敗しました。" });
    }
});

// ギャラリーの存在確認API
app.get('/api/gallery/check/:galleryId', (req, res) => {
    const { galleryId } = req.params;
    const galleryDir = path.join(__dirname, 'tmp', galleryId);

    if (fs.existsSync(galleryDir)) {
        res.status(200).send(); 
    } else {
        res.status(404).send();
    }
});

// 新しいギャラリーページを表示
app.get('/gallery/:galleryId', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'Gallery', 'Gallery.html'));
});


// ギャラリーの情報を返すAPI
app.get('/api/gallery/:galleryId/:page', (req, res) => {
    const { galleryId, page } = req.params;
    const pageIndex = parseInt(page, 10) - 1;
    const galleryDir = path.join(__dirname, 'tmp', galleryId);

    if (!fs.existsSync(galleryDir)) {
        return res.status(404).json({ error: 'ギャラリーが見つかりません。' });
    }
    
    const imageFiles = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    
    if (pageIndex < 0 || pageIndex >= imageFiles.length) {
        return res.status(404).json({ error: '指定されたページは存在しません。' });
    }
    
    // totalPagesも一緒に返すように変更
    res.json({ 
        totalPages: imageFiles.length,
        imageUrl: `/tmp/${galleryId}/${imageFiles[pageIndex]}`
    });
});

// 指定したギャラリーを削除するAPI
app.delete('/api/gallery/:galleryId', (req, res) => {
    const { galleryId } = req.params;
    const galleryDir = path.join(__dirname, 'tmp', galleryId);

    try {
        if (!fs.existsSync(galleryDir)) {
            return res.status(404).json({ error: 'ギャラリーが見つかりません。' });
        }else {
            fs.rmSync(galleryDir, { recursive: true, force: true });
            console.log(`ギャラリー${galleryId}削除`);
            res.status(200).json({ message: 'ギャラリーを正常に削除しました。' });
        }
    } catch (error) {
        console.error('Error deleting gallery:', error);
        res.status(500).json({ error: 'ギャラリーの削除に失敗しました。' });
    }
});

/*----------サーバー起動----------*/
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// サーバーを起動するときはProjects/Backend内でnpx nodemon server.jsを実行