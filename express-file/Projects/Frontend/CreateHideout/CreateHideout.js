const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const fileCount = document.getElementById("fileCount");
// modal設定
const preview = document.getElementById("preview");
const confirm = document.getElementById("confirm");
const closeOverlay = document.getElementById("closeOverlay");
const overlay = document.getElementById("overlay");
// downloadボタン設定
const download = document.getElementById("download");

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

   if(fileInput.files.length > 0){
        // 最初の一枚を表示
        const file = fileInput.files[0];
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
   }

    overlay.style.display = "flex";

});

// closeOverlayの設定
closeOverlay.addEventListener("click", () => {
    overlay.style.display = "none";
});



