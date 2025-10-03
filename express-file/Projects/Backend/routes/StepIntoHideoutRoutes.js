const express = require('express');
const path = require('path');
const router = express.Router();
const AdmZip = require('adm-zip');
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "Frontend", "StepIntoHideout", "StepIntoHideout.html"));
});

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

module.exports = router;