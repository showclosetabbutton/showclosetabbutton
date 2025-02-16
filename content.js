// content.js - 在 active tab 的網頁中顯示按鈕並處理行為

function injectButtons(buttons, position, layout) {
	console.log('injectButtons...');
	console.log(buttons);
	console.log(position);
	console.log(layout);
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
	    console.log('load button: '+btn);
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
            	const pocketUrl = "https://getpocket.com/edit?url=" + encodeURIComponent(window.location.href) + "&title=" + encodeURIComponent(document.title);
		    console.log(pocketUrl);
 		const newWindow = window.open(pocketUrl, '_blank', 'width=550,height=420');
		    //autoClosePocketWindow(newWindow);
            });
        }
	    else if (btn === "scroll-to-top") {
            button.addEventListener("click", () => {
		 if(isPageScrollable()){
			window.scrollTo({
			    top: 0,
			    behavior: "smooth"
			});
		 }else{
			scrollLargestDivTo("Top");
		 }
		});
        }
	    else if (btn === "page-up") {
            button.addEventListener("click", () => {
		 if(isPageScrollable()){
                 	window.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
		 }else{
			scrollLargestDivTo("Up");
		 }
            });
        }
	    else if (btn === "page-down") {
            button.addEventListener("click", () => {
		 if(isPageScrollable()){
                 	window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
		 }else{
			scrollLargestDivTo("Down");
		 }
            });
        }
	    else if (btn === "scroll-to-bottom") {
            button.addEventListener("click", () => {
		 if(isPageScrollable()){
			window.scrollTo({
			  top: document.body.scrollHeight,
			  behavior: "smooth"
			});
		 }
		 else{
			scrollLargestDivTo("Bottom");
		 }
            });
        }
        container.appendChild(button);
    });
    
    document.body.appendChild(container);
}

function autoClosePocketWindow(newWindow){
if (newWindow) {
    let closeTimer;

    // 重置計時器的函式
    const resetCloseTimer = () => {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(() => {
            if (newWindow && !newWindow.closed) {
                newWindow.close();
                console.log("長時間未操作，自動關閉視窗");
            }
        }, 10000); // 10 秒後關閉
    };

    // 監聽使用者操作
    const addEventListeners = () => {
        newWindow.addEventListener("mousemove", resetCloseTimer);
        newWindow.addEventListener("keydown", resetCloseTimer);
        newWindow.addEventListener("click", resetCloseTimer);
    };

    // 每秒檢查新視窗是否還開著
    const checkWindow = setInterval(() => {
        if (!newWindow || newWindow.closed) {
            clearInterval(checkWindow);
            console.log("使用者已關閉視窗");
        }
    }, 1000);

    setTimeout(addEventListeners, 3000); // 3 秒後開始監聽事件
    resetCloseTimer(); // 立即啟動計時器
}
}


function scrollLargestDivTo(direction) {
	let largestDiv=null;
	if(window.location.href.indexOf("perplexity.ai")>-1){
		largestDiv=document.getElementsByClassName("scrollable-container")[0];
	}else{
		// 取得所有 div 元素
		  const divs = Array.from(document.querySelectorAll("div"));

		  // 過濾出 scrollHeight 大於 clientHeight 的可滾動 div
		  const scrollableDivs = divs.filter(div => div.scrollHeight > div.clientHeight);

		  if (scrollableDivs.length === 0) {
		    console.log("沒有可滾動的 div，滾動整個頁面");
		    window.scrollTo({
		      top: 0,
		      behavior: 'smooth'
		    });
		    return;
		  }

		  // 從可滾動的 div 中找出佔畫面最大的 div（以面積作為判斷依據）
		  largestDiv = scrollableDivs.reduce((maxDiv, currentDiv) => {
		    const currentRect = currentDiv.getBoundingClientRect();
		    const maxRect = maxDiv.getBoundingClientRect();
		    const currentArea = currentRect.width * currentRect.height;
		    const maxArea = maxRect.width * maxRect.height;
		    return currentArea > maxArea ? currentDiv : maxDiv;
		  }, scrollableDivs[0]);
	}
	console.log("Largest scrollable div:", largestDiv);
	if(largestDiv){
		if(direction=="Top"){
			  largestDiv.scrollTo({
			    top: 0,
			    behavior: 'smooth'
			  });
			console.log('scroll to '+direction);
		}else if(direction=="Up"){
			  largestDiv.scrollBy({ top: -largestDiv.clientHeight, behavior: "smooth" });
			console.log('scroll to '+direction);
		}else if(direction=="Down"){
			  largestDiv.scrollBy({ top: largestDiv.clientHeight, behavior: "smooth" });
			console.log('scroll to '+direction);
		}else{//Bottom
			  largestDiv.scrollTo({
				  top:largestDiv.scrollHeight - largestDiv.clientHeight,
				  behavior: 'smooth'
			  });
			console.log('scroll to '+direction);
		}
	}
}

function isPageScrollable() {
  // 如果整個頁面的 scrollHeight 大於視窗高度，表示頁面可翻頁
  return document.documentElement.scrollHeight > window.innerHeight;
}


function updateButtonsFromStorage() {
	console.log('updateButtonsFromStorage...');
    const buttons = loadButtonConfig();
	console.log(buttons);
    browser.storage.sync.get(["buttons", "position", "layout"]).then((data) => {
        injectButtons(
            data.buttons || ["close"],
            data.position || "top-right",
            data.layout || "vertical"
        );
    });
}

async function loadButtonConfig() {
    const data = await browser.storage.sync.get(["buttons", "position", "layout"]);
    console.log('loaded config: ', data);
    return {
        buttons: data.buttons || ["close"],  // 預設按鈕
        position: data.position || "top-right",  // 預設位置
        layout: data.layout || "vertical"  // 預設排版
    };
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

