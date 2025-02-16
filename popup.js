document.addEventListener("DOMContentLoaded", async () => {
    const buttonSelect = document.getElementById("button-select");
    const addButton = document.getElementById("add-button");
    const buttonList = document.getElementById("button-list");
    const applyButton = document.getElementById("apply-button");
    const helpButton= document.getElementById("help-button");
    const donateButton= document.getElementById("donate-button");

    const positionRadios = document.querySelectorAll("input[name='position']");
    const layoutRadios = document.querySelectorAll("input[name='layout']");
    const messageElement=document.getElementById("message");
    const buttonText= {};
    buttonText['close'] = {icon:"✖",desp:"Close Button"};
    buttonText['pocket'] = {icon:"➕",desp:"Pocket Button"};
    buttonText['home'] = {icon:"H",desp:"Home Button"};
    buttonText['duplicate-tab'] = {icon:"D",desp:"Duplicate Tab Button"};
    buttonText['scroll-to-top'] = {icon:"D",desp:"Scroll To Top Button"};
    buttonText['page-up'] = {icon:"D",desp:"Page Up Button"};
    buttonText['page-down'] = {icon:"D",desp:"Page Down Button"};
    buttonText['scroll-to-bottom'] = {icon:"D",desp:"Scroll To Bottom Button"};
	//@2.add new button infomation
	console.log(buttonText);

    // read sync storage
    let storedButtons = await browser.storage.sync.get("buttons");
    let buttons = storedButtons.buttons || ["close"];
	console.log('org buttons<<<<');
	console.log(buttons);
	console.log('org buttons>>>>');

    let storedSettings = await browser.storage.sync.get(["position", "layout"]);
    let position = storedSettings.position || "top-right";
    let layout = storedSettings.layout || "vertical";

    let draggedItem = null;
    function renderButtons() {
	    console.log('renderButtons---');
        buttonList.innerHTML = "";
        buttons.forEach((btn,index) => {
            const li = document.createElement("li");
		//add button list
            li.textContent = buttonText[btn].desp;//btn === "close" ? "Close Button" : "Add Button";
            li.setAttribute("value", btn); 
            li.setAttribute("draggable", "true"); 
		console.log(buttonText);
		console.log(btn);
		console.log(buttonText[btn].desp);
		console.log(li);
	    //li.dataset.index=index;
            const deleteIcon = document.createElement("span");
            deleteIcon.textContent = "❌";
            deleteIcon.style.cursor = "pointer";
            deleteIcon.addEventListener("click", () => {
                buttons = buttons.filter((b) => b !== btn);
                browser.storage.sync.set({ buttons });
                renderButtons();
            });

            li.appendChild(deleteIcon);
            buttonList.appendChild(li);
        });
	    // sort list

buttonList.addEventListener(
    "dragstart",
    (e) => {
	    console.log('drag start');
	     //dragStartIndex = +this.dataset.index;
	     // 將拖曳項目的 index 存入 dataTransfer
//      e.dataTransfer.setData('text/plain', dragStartIndex);

        draggedItem = e.target;
        setTimeout(() => {
            e.target.style.display =
                "none";
        }, 0);
});

buttonList.addEventListener(
    "dragend",
    (e) => {
	    console.log('drag end');
	    console.log(buttons);
        setTimeout(() => {
            e.target.style.display = "";
            draggedItem = null;
        }, 0);

//        browser.storage.sync.set({ buttons });
});
buttonList.addEventListener(
    "drop",
    (e) => {
	    console.log('drop');
	    //const dragEndIndex = +this.dataset.index;
      //swapItems(dragStartIndex, dragEndIndex);
      updateLocalStorage();

        /*setTimeout(() => {
            e.target.style.display = "";
            draggedItem = null;
        }, 0);*/

});

// 交換兩個項目的位置
    function swapItems(fromIndex, toIndex) {
      const itemOne = list.children[fromIndex];
      const itemTwo = list.children[toIndex];

      // 將 itemOne 移動到 itemTwo 前面
      if(fromIndex < toIndex){
        list.insertBefore(itemOne, itemTwo.nextSibling);
      } else {
        list.insertBefore(itemOne, itemTwo);
      }
      // 更新每個 li 的 data-index 屬性
      updateIndexes();
    }

    // 更新清單中各項目的 data-index 值
    function updateIndexes() {
      Array.from(list.children).forEach((item, index) => {
        item.dataset.index = index;
      });
    }
   // 更新排序結果並存入 sync storage
    function updateLocalStorage() {
	    console.log('updateLocalStorage----');
	    console.log(buttonList.children);

    Array.from(buttonList.children).forEach((item) => {
	    console.log(item);
	    console.log('item value is '+item.getAttribute('value'));
    });
      buttons = Array.from(buttonList.children).map(item => item.getAttribute('value').trim());
      //const sortedItems = Array.from(list.children).map(item => item.textContent.trim());
      //localStorage.setItem('sortedList', JSON.stringify(sortedItems));
        //browser.storage.sync.set({ buttons });
      console.log("排序後結果存入 sync storage：", buttons);
    }

buttonList.addEventListener(
    "dragover",
    (e) => {
	    console.log('drag over');
        e.preventDefault();
        const afterElement =
            getDragAfterElement(
                buttonList,
                e.clientY);
        const currentElement =
            document.querySelector(
                ".dragging");
        if (afterElement == null) {
            buttonList.appendChild(
                draggedItem
            );} 
        else {
            buttonList.insertBefore(
                draggedItem,
                afterElement
            );}
    });

const getDragAfterElement = (
    container, y
) => {
	    console.log('drag after element');
    const draggableElements = [
        ...container.querySelectorAll(
            "li:not(.dragging)"
        ),];

    return draggableElements.reduce(
        (closest, child) => {
            const box =
                child.getBoundingClientRect();
            const offset =
                y - box.top - box.height / 2;
            if (
                offset < 0 &&
                offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };} 
            else {
                return closest;
            }},
        {
            offset: Number.NEGATIVE_INFINITY,
        }
    ).element;
};
//end of sort list
    }

    addButton.addEventListener("click", () => {
/*        if (buttons.length >= 5) {
            messageElement.innerText="The button limit has been exceeded and no new buttons can be added. Please remove other buttons and try again.";
            messageElement.style.color= "red";*/
//            alert("已超過按鈕上限無法新增，請移除其他按鈕再重試");
/*            return;
        }*/
        let selected = buttonSelect.value;
        if (buttons.includes(selected)) {
            messageElement.innerText="This button already exists in the list and cannot be added.";
            messageElement.style.color= "red";
            //alert("列表中已有此按鈕無法新增");
            return;
        }
        buttons.push(selected);
        browser.storage.sync.set({ buttons });
        renderButtons();
    });

    positionRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            position = radio.value;
            browser.storage.sync.set({ position });
        });
        if (radio.value === position) radio.checked = true;
    });

    layoutRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
            layout = radio.value;
            browser.storage.sync.set({ layout });
        });
        if (radio.value === layout) radio.checked = true;
    });

    applyButton.addEventListener("click", async () => {
	    console.log('apply...');
	    console.log(browser.storage.sync.get());
        let tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
            browser.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: updateButtonsOnPage,
                args: [buttons, position, layout]
            });
		 // 重新 reload 目前網頁
        browser.tabs.reload(tabs[0].id);
        }
	    window.close();
    });

helpButton.addEventListener('click', function() {
	openUrl('https://showclosetabbutton.github.io/help.html');
});

function openUrl(_url) {
    browser.runtime.sendMessage({ action: "open_url", url: _url })
        .then(response => {
            console.log("Message sent, response:", response);
		window.close();
        })
        .catch(error => {
            console.error("Error sending message:", error);
        });
};

donateButton.addEventListener('click', function() {
    openUrl('https://paypal.me/zhihaushiu');
});

    renderButtons();
});

function updateButtonsOnPage(buttons, position, layout) {
    let container = document.getElementById("custom-button-container");
    if (container) container.remove();
    
    container = document.createElement("div");
    container.id = "custom-button-container";
    container.style.position = "fixed";
    container.style.zIndex = "10000";
    container.style.display = "flex";
    container.style.flexDirection = layout === "vertical" ? "column" : "row";
    container.style.gap = "5px";

    let positions = {
        "top-left": { top: "10px", left: "10px" },
        "top-right": { top: "10px", right: "10px" },
        "bottom-left": { bottom: "10px", left: "10px" },
        "bottom-right": { bottom: "10px", right: "10px" }
    };
    Object.assign(container.style, positions[position]);
	console.log(buttons);
	console.log(buttonText);
    
    buttons.forEach((btn) => {
        let button = document.createElement("button");
	    console.log(btn);
	    //update button on page
        button.textContent = buttonText[btn].icon;//btn === "close" ? "✖" : "➕";
        button.style.padding = "5px";
        button.style.fontSize = "16px";
        button.addEventListener("click", () => {
            if (btn === "close") window.close();
        });
        container.appendChild(button);
    });

    document.body.appendChild(container);
}

