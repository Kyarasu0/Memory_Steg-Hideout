const zipUploader = document.getElementById("zipUploader");
const gallery = document.getElementById("gallery");

// サーバーにファイルを送る
zipUploader.addEventListener('change', handleInitialUpload);

// ZIPをアップロード
async function handleInitialUpload() {
    const file = zipUploader.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('zipFile', file);

    try {
        const response = await fetch('/step-in', {
            method: 'POST',
            body: formData,
        });

        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const result = await response.json();
            gallery.innerHTML = `エラー: ${result.error}`;
        }

    } catch (error) {
        gallery.innerHTML = 'エラーが発生しました。';
        console.error(error);
    }
}