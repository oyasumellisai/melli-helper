// ==UserScript==
// @name         goto-melli
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2024.12.01
// @description  Refresh media when somebody fucked up. Disable Nico on spam so recording machine doesn't die. what the fuck am I doing
// @author       (You)
// @match        https://witcheffect.com/*
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/goto-melli.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/goto-melli.user.js
// @grant        none
// ==/UserScript==
// Not tested on BKT / yay

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 10, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after the time, try tomorrow.
}
setTimeout(function(){window.location = "https://cytu.be/r/25_days_of_autism"}, millisTill10);
