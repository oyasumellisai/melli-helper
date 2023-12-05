// ==UserScript==
// @name         witcheffect-refresh
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.12.05.0
// @description  Refresh on new media
// @author       (You)
// @match        https://witcheffect.com/
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @grant        none
// ==/UserScript==
// Not tested on BKT / yay

/*
    Trying to do this 2 ways
    - refresh after new video is loaded (this didnt work as I hoped)
    - refresh on every hour / half hour
*/


console.log("Refresher started.");

// Refresh on every half hour / hour
var now = new Date();
var millisTillRefresh = 1800000 - (now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)) % 1800000;
setTimeout(function(){ location.reload(); }, millisTillRefresh);

// Refresh on video load
window.setTimeout(setupVideoTitleObserver,5000);
function setupVideoTitleObserver() {
    console.log("Setting up observer...");
    const targetNode = document.getElementById('videoContainer').getElementsByTagName("iframe")[0];
    const observerOptions = {
        ///characterData: true, attributes: false, childList: false, subtree: true
        characterData:true,
        childList: true,
        attributes: true,
        // Omit (or set to false) to observe only changes to the parent node
        subtree: true
    }
    const observerVideoTitle = new MutationObserver(callbackVideoTitle);
    observerVideoTitle.observe(targetNode, observerOptions);
    console.log("Video Title observer setup complete.");
}

function callbackVideoTitle(mutationList, observer) {
    console.log("New video detected...\nThis is video title " + document.getElementById('videoContainer').getElementsByTagName("iframe")[0].getAttribute('src'));
    //refresh in 10 seconds
    setTimeout(function(){ location.reload(); }, 10*1000);
}

