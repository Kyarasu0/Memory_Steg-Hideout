const express = require('express');
const path = require('path');
const dotenv = require('dotenv').config();
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'uploads/' });

// ミドルウェア
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "Frontend")));
app.use('/tmp', express.static(path.join(__dirname, 'tmp')));

// ルーターの登録
const createHideoutRoutes = require('./routes/CreateHideoutRoutes');
const galleryRoutes = require('./routes/GalleryRoutes');
const stepIntoHideoutRoutes = require('./routes/StepIntoHideoutRoutes');
app.use("/CreateHideout", createHideoutRoutes);
app.use("/Gallery", galleryRoutes);
app.use("/StepIntoHideout", stepIntoHideoutRoutes);

// ルート（トップページなど）
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Frontend", "Home", "Home.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
