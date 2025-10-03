const imageDisplay = document.getElementById('image-display');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const closeBtn = document.getElementById('closeBtn');

// ギャラリーの管理情報
let galleryId = null;
let totalPages = 0;
let currentPage = 1;

// ページの読み込み完了時
document.addEventListener('DOMContentLoaded', async () => {
    // URLからgalleryIdを取得 (/gallery/abcdef123 -> abcdef123)
    const pathParts = window.location.pathname.split('/');
    galleryId = pathParts[pathParts.length - 1];

    // 最初のページの情報をサーバから取得
    await fetchPageData(currentPage);
});

/* --- ボタン系 --- */
// ページ移動ボタン
nextBtn.addEventListener('click', () => {
    let nextPage = currentPage + 1;
    if (nextPage > totalPages) nextPage = 1;
    fetchPageData(nextPage);
});
prevBtn.addEventListener('click', () => {
    let prevPage = currentPage - 1;
    if (prevPage < 1) prevPage = totalPages;
    fetchPageData(prevPage);
});


// 閉鎖ボタン
closeBtn.addEventListener('click', closeGallery);

/* ---関数系--- */
// 指定されたページの画像データを取得する関数
async function fetchPageData(page) {
    try {
        // サーバに欲しいIDとページを伝える
        const response = await fetch(`/Gallery/api/${galleryId}/${page}`);
        const result = await response.json();

        console.log("サーバーからのレスポンス:", result); // ここで確認
        
        // サーバから返ってきた情報で更新
        imageDisplay.innerHTML = `<img src="${result.imageUrl}">`;
        document.getElementById('title').textContent = result.title;
        document.getElementById('daily').textContent = result.steganographyText;

        currentPage = page;
        totalPages = result.totalPages;
        pageIndicator.textContent = `${currentPage} / ${totalPages}`;

    } catch (error) {
        console.error('Error:', error);
        imageDisplay.innerHTML = '画像の読み込みに失敗しました。';
    }
}

// ギャラリーを閉鎖する関数
async function closeGallery() {
    if (!confirm('本当にこのギャラリーを閉鎖しますか？')) {
        return;
    }

    try {
        const response = await fetch(`/Gallery/api/${galleryId}`, {
            method: 'DELETE',
        });

        // 削除時のアナウンス
        if (response.ok) {
            alert('ギャラリーを閉鎖しました。');
            window.location.href = '/';
        } else {
            const result = await response.json();
            alert(`閉鎖に失敗ました。: ${result.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('エラーが発生しました。');
    }
}