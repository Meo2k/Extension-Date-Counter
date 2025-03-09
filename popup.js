document.addEventListener("DOMContentLoaded", function () {
    const startDateInput = document.getElementById("startDate");
    const targetDateInput = document.getElementById("targetDate");
    const saveButton = document.getElementById("saveDate");
    const daysPassedSpan = document.getElementById("daysPassed");
    const daysLeftSpan = document.getElementById("daysLeft");
    const clearButton = document.getElementById("clearButton");
    const settingsButton = document.getElementById("settingsButton");

    // Lấy dữ liệu đã lưu từ Chrome Storage
    chrome.storage.sync.get(["startDate", "targetDate"], function (data) {
        if (data.startDate) startDateInput.value = data.startDate;
        if (data.targetDate) targetDateInput.value = data.targetDate;
        updateDaysCount();
    });

    // Khi nhấn "Lưu ngày"
    saveButton.addEventListener("click", function () {
        const startDate = startDateInput.value;
        const targetDate = targetDateInput.value;

        if (!startDate || !targetDate) {
            alert("Vui lòng nhập đầy đủ ngày!");
            return;
        }

        chrome.storage.sync.set({ startDate, targetDate, dismissed: false }, function () {
            updateDaysCount();
        });
    });

    // Cập nhật số ngày đã trôi qua và còn lại
    function updateDaysCount() {
        const startDate = new Date(startDateInput.value);
        const targetDate = new Date(targetDateInput.value);
        const today = new Date();

        let dayPass = Math.max(0, Math.floor((today - startDate) / (1000 * 60 * 60 * 24))); 
        let dayLeft = Math.max(0, Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)));

        daysPassedSpan.textContent = isNaN(dayPass) ? 0 : dayPass;
        daysLeftSpan.textContent = isNaN(dayLeft) ? 0 : dayLeft;
    }

    // Khi nhấn "Clear", xóa toàn bộ trạng thái thông báo
    clearButton.addEventListener("click", function () {
        chrome.storage.sync.remove(["startDate", "targetDate", "dismissed"], function () {
            startDateInput.value = "";
            targetDateInput.value = "";
            daysPassedSpan.textContent = "0";
            daysLeftSpan.textContent = "0";
            alert("Đã xóa dữ liệu thông báo!");
        });
    });

    // Mở trang cài đặt khi nhấn "Settings"
    settingsButton.addEventListener("click", function () {
        chrome.tabs.create({ url: "settings.html" });
    });
});
