// content.js - 在 active tab 的網頁中顯示按鈕並處理行為

function injectButtons(buttons, position, layout) {
    // 若 container 已存在則先移除（避免重複注入）
    const existing = document.getElementById("custom-button-container");
    if (existing) {
        existing.remove();
    }
    const buttonText= {};
/*    buttonText['close'] = "✖";
    buttonText['pocket'] = "➕";
    buttonText['home'] = "H";
    buttonText['duplicate-tab'] = "D";*/
    
    buttonText['close'] ='/icons/close-tab-128.png';
    buttonText['pocket'] ='/icons/pocket-128.png';
    buttonText['home'] ='/icons/home-128.png';
    buttonText['duplicate-tab'] ='/icons/duplicate-tab-128.png';
    buttonText['scroll-to-top'] ='/icons/scroll-to-top-128.png';
    buttonText['page-up'] ='/icons/page-up-128.png';
    buttonText['page-down'] ='/icons/page-down-128.png';
    buttonText['scroll-to-bottom'] ='/icons/scroll-to-bottom-128.png';
	//@3.add new button icon path

    const container = document.createElement("div");
    container.id = "custom-button-container";
    container.style.position = "fixed";
    container.style.zIndex = "10000";
    container.style.display = "flex";
    container.style.flexDirection = layout === "vertical" ? "column" : "row";
    //container.style.gap = "5px";
    container.style.gap = "15px";

    const positions = {
        "top-left": { top: "10px", left: "10px" },
        "top-right": { top: "10px", right: "10px" },
        "bottom-left": { bottom: "10px", left: "10px" },
        "bottom-right": { bottom: "10px", right: "10px" }
    };
    Object.assign(container.style, positions[position]);
    
    buttons.forEach((btn) => {
        const button = document.createElement("button");
        //button.textContent = buttonText[btn];//btn === "close" ? "✖" : "➕";
	const url=browser.runtime.getURL(buttonText[btn]);
	console.log(url);
	button.style.backgroundImage=`url('${url}')`;
	button.style.backgroundRepeat="no-repeat";
	button.style.backgroundSize="cover";
	button.style.backgroundColor="transparent";
	button.style.border="none";
	button.style.width="24px";
	button.style.height="24px";
	button.style.cursor="pointer";

        button.style.padding = "5px";
        button.style.fontSize = "16px";
        button.style.cursor = "pointer";
	    console.log(button);
        if (btn === "close") {
            button.addEventListener("click", () => {
                // close tab via background.js , not use window.close()
		console.log('click close button on page');
                browser.runtime.sendMessage({ action: "closeTab" });
            });
        }
	    else if (btn === "duplicate-tab") {
            button.addEventListener("click", () => {
		console.log('click duplicate tab button on page');
                browser.runtime.sendMessage({ action: "duplicateTab" });
            });
        }
	    else if (btn === "home") {
            button.addEventListener("click", () => {
                browser.runtime.sendMessage({ action: "home" });
            });
        }
	    else if (btn === "pocket") {
            button.addEventListener("click", () => {
                 // save page to pocket
    const pocketUrl = "https://getpocket.com/save?url=" + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title);
    window.open(pocketUrl, '_blank', 'width=550,height=420');
            });
        }
	    else if (btn === "scroll-to-top") {
            button.addEventListener("click", () => {
		 window.scrollTo({
		    top: 0,
		    behavior: "smooth"
		  });
		});
        }
	    else if (btn === "page-up") {
            button.addEventListener("click", () => {
		 window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
            });
        }
	    else if (btn === "page-down") {
            button.addEventListener("click", () => {
                 window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
            });
        }
	    else if (btn === "scroll-to-bottom") {
            button.addEventListener("click", () => {
		window.scrollTo({
		  top: document.body.scrollHeight,
		  behavior: "smooth"
		});
            });
        }
        container.appendChild(button);
    });
    
    document.body.appendChild(container);
}

function updateButtonsFromStorage() {
    browser.storage.local.get(["buttons", "position", "layout"]).then((data) => {
        injectButtons(
            data.buttons || ["close"],
            data.position || "top-right",
            data.layout || "vertical"
        );
    });
}

// listen update message from  background 
browser.runtime.onMessage.addListener((request) => {
    if (request.action === "updateButtons") {
        injectButtons(request.buttons, request.position, request.layout);
    }
});

// 監聽頁面歷史紀錄變更（例如 AJAX 載入）時更新按鈕
window.addEventListener("popstate", updateButtonsFromStorage);

// initial load button 
updateButtonsFromStorage();

// 假設你的自訂按鈕容器 id 為 custom-button-container

function handleFullscreenChange() {
    const container = document.getElementById("custom-button-container");
    // 判斷是否有全螢幕的元素
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        // 進入全螢幕時隱藏按鈕
        if (container) {
            container.style.display = "none";
        }
    } else {
        // 退出全螢幕時顯示按鈕（根據原本排列方式決定 display 的值）
        if (container) {
            container.style.display = "flex";
        }
    }
}

// 監聽不同瀏覽器的全螢幕變更事件
document.addEventListener("fullscreenchange", handleFullscreenChange);
document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
document.addEventListener("mozfullscreenchange", handleFullscreenChange);
document.addEventListener("MSFullscreenChange", handleFullscreenChange);

