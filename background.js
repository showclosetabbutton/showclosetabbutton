// background.js - 處理 popup.js 與 content.js 之間的通訊

browser.runtime.onInstalled.addListener(() => {
    browser.storage.sync.set({
        buttons: ["close"],
        position: "top-right",
        layout: "vertical"
    });
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // 檢查該 tab 是否加載完畢（status: 'complete'），且 URL 包含指定字串
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('https://getpocket.com/edit') && tab.url.includes('&tags=')) {
    // 自動關閉該視窗
    chrome.tabs.remove(tabId);
  }
});


browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "applySettings") {
        let [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            browser.tabs.sendMessage(tab.id, {
                action: "updateButtons",
                buttons: message.buttons,
                position: message.position,
                layout: message.layout
            });
        }
    } else if (message.action === "closeTab") {
        // 優先使用 sender.tab.id 來關閉發送訊息的分頁
        let tabId;
        if (sender && sender.tab && sender.tab.id) {
            tabId = sender.tab.id;
        } else {
            // 如果 sender.tab 不存在則使用 active tab
            let tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                tabId = tabs[0].id;
            }
        }
        if (tabId !== undefined) {
            browser.tabs.remove(tabId);
        }
    } else if (message.action === "home") {
        // 優先使用 sender.tab.id 來關閉發送訊息的分頁
        let currentTab;
        if (sender && sender.tab ) {
            currentTab= sender.tab;
        } else {
            // 如果 sender.tab 不存在則使用 active tab
            let tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                currentTab= tabs[0];
            }
        }
	if (currentTab&& currentTab.url) {
            try {
                // 使用 URL 物件來解析 URL
                let urlObj = new URL(currentTab.url);
                // 取得 domain（主機名稱）
                let domain = urlObj.hostname;
                // 組合 domain 網址（維持協定）
                let domainUrl = urlObj.protocol + "//" + domain;
                // 重新導向 active tab 至該 domain 的網址
                browser.tabs.update(currentTab.id, { url: domainUrl });
            } catch (err) {
                console.error("無法解析 URL：", err);
            }
        }
    } else if (message.action === "duplicateTab") {
	    console.log('duplicateTab bg script');
        // 優先使用 sender.tab.id 來關閉發送訊息的分頁
        let currentTab;
        if (sender && sender.tab && sender.tab.id) {
            currentTab= sender.tab;
        } else {
            // 如果 sender.tab 不存在則使用 active tab
            let tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                currentTab= tabs[0];
            }
        }
        if (currentTab!== undefined) {
	    console.log('current tab is not null');
            //browser.tabs.remove(tabId);
		    
		    // 获取当前标签页的索引位置
		    const index = currentTab.index;

		    // 创建一个新的标签页，复制当前标签页的 URL
		    browser.tabs.create({
		      url: currentTab.url,
		      index: index + 1, // 新标签页在当前标签页的旁边
		    });
		
        }else{
	    console.log('current tab is null');
	}
    }//@4. add button click event
    else if (message.action === "open_url") {
        browser.tabs.create({ url: message.url }); // 在新標籤頁開啟 URL
        sendResponse({ status: "URL opened" });
    }
});


