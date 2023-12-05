// ==UserScript==
// @name         witcheffect-refresh
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.12.05.3
// @description  Refresh on new media
// @author       (You)
// @match        https://witcheffect.com/
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @grant        none
// ==/UserScript==
// Not tested on BKT / yay

console.log("Refresher started.");
setupFallbackRefresh()
setTimeout(setupObserver, 2000);

// Refresh every 24m
function setupFallbackRefresh(){
    var now = new Date();
    //var millisTillRefresh = 1800000 - (now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)) % 1800000;
    var millisTillRefresh = 24*60*1000;
    console.log("Fallback: Refreshing in "+(millisTillRefresh/1000/60)+" minutes")
    setTimeout(function(){ location.reload(); }, millisTillRefresh);
}

// Refresh on video load
function setupObserver() {
    console.log("Setting up observer...")
    console.log("This is video src=" + document.getElementById('videoContainer').getElementsByTagName("iframe")[0].getAttribute('src'));
    // Get the iframe body
    let node = document.getElementById('videoContainer');
    // Setup the config
    let config = { attributes: true, childList: true }
    // Create a callback
    let callback = function(mutationsList) {
        console.log("callback");
        console.log("New video detected...\nThis is video src=" + document.getElementById('videoContainer').getElementsByTagName("iframe")[0].getAttribute('src'));
        //refresh in 10 seconds
        setTimeout(function(){ location.reload(); }, 10*1000);
    }

    // Watch the iframe for changes
    let observer = new MutationObserver(callback);
    observer.observe(node, config);
}

/*
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

*/