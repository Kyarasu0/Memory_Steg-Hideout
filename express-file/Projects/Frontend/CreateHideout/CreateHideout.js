const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const fileCount = document.getElementById("fileCount");
// modal設定
const preview = document.getElementById("preview");
const confirm = document.getElementById("confirm");
const closeOverlay = document.getElementById("closeOverlay");
const overlay = document.getElementById("overlay");
// nextボタン設定
const next = document.getElementById("next");
// daily, title設定
const daily = document.getElementById("daily");
const title = document.getElementById("title");

// 初期化
let formData;
let pendingFiles = [];

// upload buttonの設定
uploadButton.addEventListener("click", () => {fileInput.click()});

// fileInputの設定
fileInput.addEventListener("change", () => {
    if (fileInput.files.length < 1000){
        const count = fileInput.files.length;
        fileCount.textContent = count;
    }else{
        alert("ファイル数は999個まででお願いします！");
    }
});

// confirmの設定
confirm.addEventListener("click", () => {
    // 画面の初期化
    preview.innerHTML = "";

    overlay.style.display = "flex";

    // http/httpsでの通信の準備
    formData = new FormData();
    pendingFiles = [];

    next.click();
});

// closeOverlayの設定
closeOverlay.addEventListener("click", () => {
    overlay.style.display = "none";
});

// nextボタンの設定
next.addEventListener("click", async () => {
    // ファイルが選択されていなければ終了
    if (!fileInput.files.length) return;

    // 現在表示中のファイルを取得
    let currentFile = null;
    for (let i = 0; i < fileInput.files.length; i++){
        const file = fileInput.files[i];

        if (!pendingFiles.includes(file.name)) {
            currentFile = file;
            break;
        }
    }
    
    // 未処理のファイルがなければclose
    if (!currentFile) {
        overlay.style.display = "none";

        try {
            // ファイルの処理が全て終わったらまとめて送信
            const response = await fetch("/CreateHideout/create", { 
                method: "POST", body: formData
            });

            // エラー対応
            if (!response.ok) throw new Error("Upload failed");

            // responseでもらったファイルを保存
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.next = "result.zip";
            a.click();
        } catch (err) {
            alert(err.message);
        }

        return;
    }else{
        preview.innerHTML = "";
        const img = document.createElement("img");
        img.src = URL.createObjectURL(currentFile);
        preview.appendChild(img);
    }

    // 複数ファイルの追加
    formData.append("files[]", currentFile);
    formData.append("daily[]", daily.value);
    formData.append("title[]", title.value);

    // 処理完了配列に追加
    pendingFiles.push(currentFile.name);

});



