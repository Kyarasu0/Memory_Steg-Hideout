const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");
const fileCount = document.getElementById("fileCount");

uploadButton.addEventListener("click", () => {fileInput.click()});
fileInput.addEventListener("change", () => {
    if (fileInput.files.length < 1000){
        const count = fileInput.files.length;
        fileCount.textContent = count;
    }else{
        alert("ファイル数は999個まででお願いします！");
    }
});



