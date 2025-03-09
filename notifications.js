document.addEventListener("DOMContentLoaded", function () {
    const notifyMessageTarget = document.getElementById("messageTarget");

    // Lấy dữ liệu từ Chrome Storage và cập nhật UI
    chrome.storage.sync.get(["notifyTarget"], function (data) {
        if (data.notifyTarget) {
            notifyMessageTarget.textContent = data.notifyTarget;
        }
    });

    // Xử lý khi nhấn nút đóng
    document.querySelector(".close-btn").addEventListener("click", function () {
        chrome.storage.sync.set({ dismissed: true }, function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.remove(tabs[0].id); // Đóng tab hiện tại
                }
            });
        });
    });
});
