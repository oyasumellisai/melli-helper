// ==UserScript==
// @name         witcheffect-refresh
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.12.11.00
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
setTimeout(main(), 2000);

// XPath works better than regular selectors
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// grab finish time from schedule
function getFinishTime() {
    getElementByXpath('/html/body/div/section/c/header/nav/div[3]/div').click();
    setTimeout(function() { 
        time.finish = document.querySelector('#tableContainer > table > tr:nth-child(2) > td:nth-child(4)').innerText;
        console.log("Finish time: "+time.finish)
        getElementByXpath('/html/body/div/section/c/header/nav/div[3]/div').click();
    },200); 
}

// parse the finish time 
function parseTime() {
    var finishSplit = time.finish.split(' ');
    time.time = finishSplit[0];
    time.ampm = finishSplit[1];
    var timeSplit = time.time.split(':');
    time.hr = Number(timeSplit[0]);
    time.min = Number(timeSplit[1]);
    time.sec = Number(timeSplit[2]);

    if(time.ampm.toLowerCase() == "pm") {
        time.hr += 12;
    }
}

function getMillisTillRefresh() {
    var now = new Date();
    var millisTillRefresh = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hr, time.min, time.sec, 0) - now;
    if (millisTillRefresh < 0) {
         millisTillRefresh += 86400000; // it's after the time, try tomorrow.
    }
    console.log("Millis till refresh: "+millisTillRefresh);
    return millisTillRefresh
}

function main() {
    getFinishTime();
    parseTime();
    setTimeout(function(){ location.reload(); }, millisTillRefresh())
}
