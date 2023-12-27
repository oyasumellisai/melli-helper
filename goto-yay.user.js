// ==UserScript==
// @name         goto-yay
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.12.27.00
// @description  Refresh media when somebody fucked up. Disable Nico on spam so recording machine doesn't die. what the fuck am I doing
// @author       (You)
// @match        https://witcheffect.com/
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/goto-melli.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/goto-melli.user.js
// @grant        none
// ==/UserScript==

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 40, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after the time, try tomorrow.
}
setTimeout(function(){window.location = "https://cytu.be/r/yayifications"}, millisTill10);
