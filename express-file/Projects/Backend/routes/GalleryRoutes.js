const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const AdmZip = require('adm-zip');

const upload = multer({ dest: 'uploads/' });

// ZIPアップロード
router.post("/step-in", upload.single("zipFile"), (req, res) => {
    const zipPath = req.file.path;
    const galleryId = Math.random().toString(36).substring(2, 12);
    const extractDir = path.join(__dirname, '..', 'tmp', galleryId);

    if (!fs.existsSync(extractDir)) fs.mkdirSync(extractDir, { recursive: true });

    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractDir, true);
        fs.unlinkSync(zipPath);

        const imageFiles = fs.readdirSync(extractDir)
                             .filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        if (imageFiles.length === 0) return res.status(400).json({ error: '画像が見つかりません。' });

        res.redirect(`/gallery/${galleryId}`);
    } catch (err) {
        res.status(500).json({ error: "ZIP処理に失敗しました。" });
    }
});

// ギャラリー確認
router.get('/api/check/:galleryId', (req, res) => {
    const galleryDir = path.join(__dirname, '..', 'tmp', req.params.galleryId);
    res.status(fs.existsSync(galleryDir) ? 200 : 404).send();
});

// ギャラリーのページ取得
router.get('/api/:galleryId/:page', (req, res) => {
    const { galleryId, page } = req.params;
    const galleryDir = path.join(__dirname, '..', 'tmp', galleryId);

    if (!fs.existsSync(galleryDir)) return res.status(404).json({ error: 'ギャラリーが見つかりません' });

    const imageFiles = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    const pageIndex = parseInt(page, 10) - 1;

    if (pageIndex < 0 || pageIndex >= imageFiles.length)
        return res.status(404).json({ error: 'ページが存在しません' });

    res.json({ totalPages: imageFiles.length, imageUrl: `/tmp/${galleryId}/${imageFiles[pageIndex]}` });
});

// ギャラリー削除
router.delete('/api/:galleryId', (req, res) => {
    const galleryDir = path.join(__dirname, '..', 'tmp', req.params.galleryId);
    if (!fs.existsSync(galleryDir)) return res.status(404).json({ error: 'ギャラリーが見つかりません' });

    fs.rmSync(galleryDir, { recursive: true, force: true });
    res.status(200).json({ message: '削除成功' });
});

module.exports = router;
