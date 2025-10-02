const imageDisplay = document.getElementById('image-display');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');

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

// ページ移動のボタン
nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchPageData(currentPage + 1);
    }
});
prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchPageData(currentPage - 1);
    }
});


// 指定されたページの画像データを取得する関数
async function fetchPageData(page) {
    try {
        // サーバに欲しいIDとページを伝える
        const response = await fetch(`/api/gallery/${galleryId}/${page}`);
        const result = await response.json();
        
        // サーバから返ってきた情報で更新
        imageDisplay.innerHTML = `<img src="${result.imageUrl}">`;
        currentPage = page;
        totalPages = result.totalPages;
        pageIndicator.textContent = `${currentPage} / ${totalPages}`;

    } catch (error) {
        console.error('Error:', error);
        imageDisplay.innerHTML = '画像の読み込みに失敗しました。';
    }
}