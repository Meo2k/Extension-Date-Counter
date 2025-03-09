// Khi mở Chrome, kiểm tra thông báo
chrome.runtime.onStartup.addListener(() => {
    checkAndNotify();
});

// Khi extension được cài đặt hoặc cập nhật
chrome.runtime.onInstalled.addListener(() => {
    checkAndNotify();
});

// Hàm kiểm tra & hiển thị thông báo
function checkAndNotify() {
    chrome.storage.sync.get(["targetDate", "notifyDays", "notifyMessage", "dismissed"], function (data) {
        if (!data.targetDate || data.notifyDays === undefined) return;
        if (data.dismissed) return; // Nếu đã đóng thông báo, không hiển thị lại

        const targetDate = new Date(data.targetDate);
        const notifyDays = parseInt(data.notifyDays);
        const today = new Date();
        const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));

        let message = data.notifyMessage || `Bạn còn ${daysLeft} ngày đến ngày mục tiêu!`;
        message = message.replace("{day}", daysLeft);

        // Nếu đã đến ngày mục tiêu, mở tab thông báo
        if (daysLeft <= 0) {
            openOrFocusTab();
            return;
        }

        // Nếu đến ngày thông báo và chưa bị tắt
        if (daysLeft === notifyDays) {
            chrome.notifications.create("goalReminder", {
                type: "basic",
                iconUrl: "icon.png",
                title: "Nhắc nhở!",
                message: message,
                buttons: [{ title: "OK" }],
                priority: 2
            });
        }
    });
}

// Khi nhấn OK trong thông báo, lưu trạng thái để không hiện thông báo nữa
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === "goalReminder" && buttonIndex === 0) {
        chrome.storage.sync.set({ dismissed: true });
        chrome.notifications.clear("goalReminder");
    }
});

// Hàm mở tab hoặc chuyển sang tab đã mở
function openOrFocusTab() {
    let url = "notifications.html?alert=true";

    chrome.tabs.query({}, function (tabs) {
        let existingTab = tabs.find(tab => tab.url && tab.url.includes(url));

        if (existingTab) {
            // Nếu tab đã tồn tại, chuyển sang tab đó
            chrome.tabs.update(existingTab.id, { active: true });
        } else {
            // Nếu tab chưa mở, tạo tab mới
            chrome.tabs.create({ url: url });
        }
    });
}
