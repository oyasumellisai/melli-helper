// ==UserScript==
// @name         witcheffect-helper
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.11.30.0
// @description  Refresh media when somebody fucked up. Disable Nico on spam so recording machine doesn't die. what the fuck am I doing
// @author       (You)
// @match        https://yayifications.com/
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-helper.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/witcheffect-helper.user.js
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

GM_addStyle ( `
    .spoilertext {
        background: black !important;
        color: #fff !important;
    }
` );
