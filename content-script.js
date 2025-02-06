//console.log('load content script');
// create a close button
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



// add the button to current page
document.body.appendChild(closeButton);
//console.log('append close button to the page');

// click the button to send a message to background script. request close current tab 
closeButton.addEventListener("click", () => {
  browser.runtime.sendMessage({ action: "closeTab" });
});

