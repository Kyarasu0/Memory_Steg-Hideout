const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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
