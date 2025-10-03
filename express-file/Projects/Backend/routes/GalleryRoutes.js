const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { execFile } = require("child_process");

const app = express();

// ギャラリー確認
router.get('/api/check/:galleryId', (req, res) => {
    const galleryDir = path.join(__dirname, '..', 'tmp', req.params.galleryId);
    res.status(fs.existsSync(galleryDir) ? 200 : 404).send();
});

// ギャラリーのルート
router.get('/:galleryId', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'Frontend', 'Gallery', 'Gallery.html'));
});

// ギャラリーのページ取得
router.get('/api/:galleryId/:page', (req, res) => {
    const { galleryId, page } = req.params;
    const galleryDir = path.join(__dirname, '..', 'tmp', galleryId);

    if (!fs.existsSync(galleryDir)) return res.status(404).json({ error: 'ギャラリーが見つかりません' });

    const imageFiles = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|JPG)$/i.test(f));
    const pageIndex = parseInt(page, 10) - 1;

    if (pageIndex < 0 || pageIndex >= imageFiles.length)
        return res.status(404).json({ error: 'ページが存在しません' });

    const targetImageFile = imageFiles[pageIndex];
    const imageFullPath = path.join(galleryDir, targetImageFile); // C++に渡す画像ファイルのフルパス

    // C++実行ファイルの場所を指定
    const exePath = path.join(__dirname, "..", "cpp-files", "separation");

    // C++プログラムを実行。第2引数で画像ファイルのパスを渡す。
    execFile(exePath, [imageFullPath], (error, stdout, stderr) => {
        if (error) {
            console.error("C++実行エラー:", error);
            // return res.status(500).json({ error: "テキストの抽出中にエラーが発生しました。" });
        }
        if (stderr) {
            console.error("C++ stderr:", stderr);
        }

        // steghideに失敗したら"null"を返す
        const stegoText = stdout && stdout.trim() !== '' ? stdout.trim() : "null";
        // 名前から拡張子を排除
        const title = path.parse(targetImageFile).name;

        // C++の実行結果を、steganographyTextとして返す
        res.json({ 
            totalPages: imageFiles.length,
            imageUrl: `/tmp/${galleryId}/${targetImageFile}`,
            title: title, // 写真タイトルを追加
            steganographyText: stegoText // C++から抽出されたテキスト
        });
    });
});

// ギャラリー削除
router.delete('/api/:galleryId', (req, res) => {
    const galleryDir = path.join(__dirname, '..', 'tmp', req.params.galleryId);
    if (!fs.existsSync(galleryDir)) return res.status(404).json({ error: 'ギャラリーが見つかりません' });

    fs.rmSync(galleryDir, { recursive: true, force: true });
    res.status(200).json({ message: '削除成功' });
});

module.exports = router;
