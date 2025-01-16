// 創建一個按鈕
const closeButton = document.createElement("button");
closeButton.textContent = "X";
closeButton.id= "addon-show-tab-close-button";
const url=browser.runtime.getURL('/icons/cross-128.png');
closeButton.style.backgroundImage=`url('${url}')`;
closeButton.style.backgroundRepeat="no-repeat";
closeButton.style.backgroundSize="cover";
closeButton.style.backgroundColor="transparent";
closeButton.style.position="fixed";
closeButton.style.top="10px";
closeButton.style.right="10px";
closeButton.style.zIndex="9999";
closeButton.style.color="transparent";
closeButton.style.border="none";
closeButton.style.width="24px";
closeButton.style.height="24px";
closeButton.style.cursor="pointer";



// 將按鈕插入到頁面
document.body.appendChild(closeButton);

// 點擊按鈕時，發送訊息給背景腳本，要求關閉分頁
closeButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "closeTab" });
});

