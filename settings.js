document.addEventListener("DOMContentLoaded", function () {
    const notifyDaysInput = document.getElementById("notifyDays");
    const notifyMessageInput = document.getElementById("notifyMessage");
    const saveSettingsButton = document.getElementById("saveSettings");
    const ConstructorBtn = document.getElementById("constructorBtn");
    const notifyMessageTarget = document.getElementById("notifyMessageTarget");
    const guideText = document.getElementById("guideText");
    const modal = document.getElementById("guideModal");
    const closeBtn = document.querySelector(".close");

    chrome.storage.sync.get(["notifyDays", "notifyMessage", "notifyTarget", "startDate", "targetDate"], function (data) {
        let startDate = data.startDate ? new Date(data.startDate) : null;
        let targetDate = data.targetDate ? new Date(data.targetDate) : null;
        const today = new Date();

        let dayLeft = targetDate ? Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24)) : 0;
        let distanceDay = Math.max(0, dayLeft);

        notifyDaysInput.min = 0;
        notifyDaysInput.max = distanceDay;
        
        notifyDaysInput.value = (typeof data.notifyDays !== "undefined" && data.notifyDays >= 0 && data.notifyDays <= distanceDay) 
            ? data.notifyDays 
            : 0;
        
        notifyMessageInput.value = data.notifyMessage || "";
        notifyMessageTarget.value = data.notifyTarget || "";
    });

    saveSettingsButton.addEventListener("click", function () {
        let selectedDays = parseInt(notifyDaysInput.value) || 0;
        let maxDays = parseInt(notifyDaysInput.max) || 0;

        if (selectedDays < 0 || selectedDays > maxDays) {
            alert(`Vui lòng chọn số ngày trong khoảng 0 - ${maxDays}`);
            return;
        }

        chrome.storage.sync.set({
            notifyDays: selectedDays,
            notifyMessage: notifyMessageInput.value, 
            notifyTarget: notifyMessageTarget.value
        }, function () {
            alert("Cài đặt đã lưu!");
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                let currentTab = tabs[0];
                if (currentTab && currentTab.url.includes("chrome-extension://")) {
                    chrome.tabs.remove(currentTab.id);
                }
            });
        });
    });

    // Sự kiện khi ấn nút ConstructorBtn
    ConstructorBtn.addEventListener("click", function () {
        modal.style.display = "block";
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
