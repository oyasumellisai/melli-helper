// ==UserScript==
// @name         witcheffect-refresh
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.12.11.01
// @description  Refresh on new media
// @author       (You)
// @match        https://witcheffect.com/
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-refresh.user.js
// @grant        none
// ==/UserScript==
// Not tested on BKT / yay

/*
    1) Get the time the current video ends
    2) Calculate how long til that is
    2) Set a timeout to refresh after that time passes
*/

console.log("Refresher started.");
const time = { finish: "", ampm: "", time: "", hr: 0, min: 0, sec: 0 };

// run main func
(function() {
    //console.log("func");
    setTimeout(main, 2000);
})();

// XPath works better than regular selectors
function getElementByXpath(path) {
    //console.log("getting xpath");
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// grab finish time from schedule
function getFinishTime() {
    console.log("Getting finish time");
    getElementByXpath('/html/body/div/section/c/header/nav/div[3]/div').click();
    setTimeout(function() { 
        time.finish = document.querySelector('#tableContainer > table > tr:nth-child(2) > td:nth-child(4)').innerText;
        console.log("Finish time: "+time.finish);
        getElementByXpath('/html/body/div/section/c/header/nav/div[3]/div').click();
    },200); 
}

// parse the finish time 
function parseTime() {
    var finishSplit = time.finish.split(' ');
    //console.log("fs1: "+finishSplit[0]+" fs2: "+finishSplit[1]);
    time.time = finishSplit[0];
    time.ampm = finishSplit[1];
    var timeSplit = time.time.split(':');
    time.hr = Number(timeSplit[0]);
    time.min = Number(timeSplit[1]);
    time.sec = Number(timeSplit[2]);

    if(time.ampm == "PM") {
        time.hr += 12;
    }
}

// calculate ms until time to refresh
function getMillisTillRefresh() {
    var now = new Date();
    var millisTillRefresh = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hr, time.min, time.sec, 0) - now;
    if (millisTillRefresh < 0) {
         millisTillRefresh += 86400000; // it's after the time, try tomorrow.
    }
    console.log("Millis till refresh: "+millisTillRefresh);
    return millisTillRefresh
}

// setTimeout based on getMillisTillRefresh
function setRefreshTimeout() {
    var millisTillRefresh = getMillisTillRefresh()
    setTimeout(function(){ location.reload(); }, millisTillRefresh);
}

// main: add delays between functions because Im too stupid for async + observer funcs
function main() {
    //console.log("main");
    setTimeout(getFinishTime,400);
    setTimeout(parseTime, 800);
    setTimeout(setRefreshTimeout, 1200);
}
