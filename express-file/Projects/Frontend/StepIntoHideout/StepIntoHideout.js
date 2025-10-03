const zipUploader = document.getElementById("zipUploader");
const gallery = document.getElementById("gallery");
const galleryIdInput = document.getElementById("galleryIdInput");
const findBtn = document.getElementById("findBtn");
const errorMessage = document.getElementById("errorMessage");
const uploadButton = document.getElementById("uploadButton");

// upload buttonの設定
uploadButton.addEventListener("click", () => {zipUploader.click()});

// サーバーにファイルを送る
zipUploader.addEventListener('change', handleInitialUpload);
findBtn.addEventListener('click', findGallery);

// ZIPをアップロード
async function handleInitialUpload() {
    const file = zipUploader.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('zipFile', file);

    try {
        const response = await fetch('/StepIntoHideout/step-in', {
            method: 'POST',
            body: formData,
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            alert(`エラー: ${result.error}`);
        }

    } catch (error) {
        alert('エラーが発生しました。');
        console.error(error);
    }
}

// gallery検索用の関数
async function findGallery() {
    const galleryId = galleryIdInput.value.trim();
    if (!galleryId) {
        return;
    } 

    try {
        const response = await fetch(`/Gallery/api/check/${galleryId}`);

        if (response.ok) {
            window.location.href = `/gallery/${galleryId}`;
        } else {
            errorMessage.textContent = 'そのGalleryは見つかりませんでした。';
        }
    } catch (error) {
        errorMessage.textContent = 'そのGalleryは見つかりませんでした。';
        console.error(error);
    }
}