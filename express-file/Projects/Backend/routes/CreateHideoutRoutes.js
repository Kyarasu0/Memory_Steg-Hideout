const express = require('express');
const path = require('path');
const router = express.Router();
const { execFile } = require("child_process");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");


const upload = multer({ dest: "uploads/" });

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "..", "Frontend", "CreateHideout", "CreateHideout.html"));
});

// ファイルを一時的に作ったフォルダに移動させる
router.post("/create", upload.array("files[]"), async (req, res) => {
    try{
        // sessionIDを作成
        const sessionID = uuidv4();

        // C++ 処理前のファイルを置くフォルダ
        const inputDir = `upload/${sessionID}/input`;
        // C++ 処理後のファイルを置くフォルダ
        const outputDir = `upload/${sessionID}/output`;

        // directoryを作成
        fs.mkdirSync(inputDir, { recursive: true });
        fs.mkdirSync(outputDir, { recursive: true });

        // multerで受け取ったファイルを inputDir に移動
        req.files.forEach(file => {
            const destPath = path.join(inputDir, file.originalname);
            fs.renameSync(file.path, destPath);
        });

        // 文字列配列として受け取る
        let dailyArray = req.body.daily;
        let titleArray = req.body.title;
        if (!Array.isArray(dailyArray)) dailyArray = [dailyArray];
        dailyArray = dailyArray.map(v => v ?? "");
        if (!Array.isArray(titleArray)) titleArray = [titleArray];
        titleArray = titleArray.map(v => v ?? "");

        console.log(req.body.daily); 
        console.log(req.body.title);


        // Json文字列化
        const dailyJSON = JSON.stringify(dailyArray);
        const titleJSON = JSON.stringify(titleArray);

        const cppPath = path.join(__dirname, "..", "cpp-files","create"); // C++ の実行ファイル

        await new Promise((resolve, reject) => {
            execFile(cppPath, [inputDir, outputDir, dailyJSON, titleJSON], (err, stdout, stderr) => {
                if (err) return reject(err);
                console.log(stdout);
                if (stderr) console.error(stderr);
                resolve();
            });
        });

        // C++ が生成したファイルを ZIP にまとめる処理
        const archiver = require("archiver");
        const outputZipPath = path.join(outputDir, `result.zip`);
        const output = fs.createWriteStream(outputZipPath);
        const archive = archiver("zip");

        archive.pipe(output);
        archive.glob("*.jpg", { cwd: outputDir });
        archive.finalize();

        output.on("close", () => {
            res.download(outputZipPath, "result.zip", (err) => {
                if (err) {
                    console.error("Download error:", err);
                }

                // ZIP送信後にセッションフォルダごと削除
                const sessionDir = path.join("upload", sessionID);
                fs.rm(sessionDir, { recursive: true, force: true }, (err) => {
                    if (err) console.error("Failed to delete sessionDir:", err);
                    else console.log(`Deleted sessionDir: ${sessionDir}`);
                });
            });
        });
    } catch (err) {
        console.error(err)
        res.status(500).send("Server error");
    }
});

module.exports = router;