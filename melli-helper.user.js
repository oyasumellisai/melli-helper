// ==UserScript==
// @name         25 Days Recording Helper 2023
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/oyasumellisai/melli-helper
// @version      2023.11.29
// @description  Refresh media when somebody fucked up. Disable Nico on spam so recording machine doesn't die. what the fuck am I doing
// @author       (You)
// @match        https://cytu.be/r/25_days_of_autism
// @match        https://cytu.be/r/BestKeyTube
// @match        https://cytu.be/r/yayifications
// @downloadURL  https://github.com/oyasumellisai/melli-helper/raw/main/melli-helper.user.js
// @updateURL    https://github.com/oyasumellisai/melli-helper/raw/main/melli-helper.user.js
// @grant        none
// ==/UserScript==
// Not tested on BKT / yay

let episodesSinceRefresh = 0;
let videosSinceRefresh = 0;
let activeVideoTitle = "";
let previousVideoTitle = "";
//document.querySelector("#pollwrap").scrollIntoView()
//document.querySelector('.playButton').click()

// The spam videos
let spamArr = new Array();
spamArr = ["papa", "tutu", "wawa",
           "days of", "dash",
           "gj-bu", "purely sky",
           "padoru",
           "a↑ba↓", "ababa",
           "foe", "f o e",
           "kiramekirari",
           "t ・ s ・ f in n i p p o n ！", "tsf", "stereoman bootleg",
           "13 merry", "merry", "melli",
           "densha",
          ];

// *unspoils your spoilers*
document.styleSheets[2].rules[58].style.setProperty('color', "rgb(255, 255, 255)")

// "main"
window.addEventListener('load', function() {
    'use strict';
    console.log("Helper started.");
    //console.log(spamArr.toString());

    window.setTimeout(setupFirstTime,2000);
    window.setTimeout(setupVideoTitleObserver,3000);
    /*
    // Initial Setup
    window.setTimeout(enableSpamBlocker,3020);
    window.setTimeout(enableEmbeddedContent,3030);
    // We set up an observer so we can perform actions when a new video is played
    window.setTimeout(setupVideoTitleObserver,3200);
    // Late loaders
    window.setTimeout(resizeVideo,3500);
    window.setTimeout(scrollToVideo,4000);
    window.setTimeout(getVideoDuration,4000);*/
}, false);


////////////////////////////////////////////////////////////////////////////////////////
////////////////////                   Video Setup                  ////////////////////
////////////////////////////////////////////////////////////////////////////////////////
function setupFirstTime() {
    setChatAutoScroll();
    resizeVideo();
    reloadVideo();
    activeVideoTitle = getActiveVideoTitle();
    setupVideo();
}

function setupVideo() {
    enableEmbeddedContent();
    checkSoundcloud();
    checkYoutube();
    enableSpamBlocker();
    setAutoRefresh();
    checkNico();
    window.setTimeout(scrollToVideo,100);
}

function setChatAutoScroll() {
    if(!isAutoScroll()) {
        document.getElementById("autoscrollbtn").click();
        console.log("Chat set to autoscroll.");
    }
}

function isAutoScroll() {
    var autoScrolling = document.getElementById("autoscrollbtn").className.includes("success");
    console.log("Is chat already autoscrolling? "+autoScrolling);
    return autoScrolling;
}

function resizeVideo() {
    console.log("Resizing video...");
    console.log("Resize 1...");
    document.getElementById("resize-video-larger").click();
    console.log("Resize 2...");
    document.getElementById("resize-video-larger").click();
    console.log("Resize complete.");
}

function scrollToVideo() {
    console.log("Scrolling to video...");
    document.querySelector("#videowrap-header").scrollIntoView();
    window.scrollBy(0,-5);
    console.log("Scrolled to video.");
}

function reloadVideo() {
    console.log("Reloading Video...");
    document.getElementById("mediarefresh").click();
    //console.log("vid on list? "+(spamArr.some(v => getActiveVideoTitle().includes(v))));
    console.log("vid on list? "+isOnList(getActiveVideoTitle(),spamArr));
}

function isOnList(str, list) {
    return list.some(v => str.includes(v));
}

function enableEmbeddedContent() {
    console.log("Attempting to enable embdedded content");
    try {
        document.querySelector("#ytapiplayer .btn-default").click();
    }
    catch(e) {
        console.error(e.stack);
    }
}

// Mod-approved autorefresh
function setAutoRefresh() {
    var bool = (document.getElementById("autorefreshbtn")!=null)
    console.log("Autorefresh available? "+bool);
    if(!bool){return;}
    if(!isAutoRefresh()) {
        document.getElementById("autorefreshbtn").click();
        console.log("Autorefresh has been enabled.");
    }
    else {
        console.log("Autorefresh is already enabled");
    }
}

function isAutoRefresh() {
    var autoRefresh = document.getElementById("autorefreshbtn").innerText.includes("ON");
    return autoRefresh;
}

// deprecated by setChatAutoScroll()
function scrollBottomChat() {
    if(document.getElementById("newmessages-indicator") != null) {
        console.log("Scrolling Chat...");
        document.getElementById("newmessages-indicator").click()
    };
}

// Possibly obsolete due to addition of automatic refresh option
function checkMediaError() {
    console.log("Checking media...");
    // This will throw an error if it's a youtube video or something but the script keeps running so ¯\_(ツ)_/¯
    if(document.getElementsByClassName("vjs-modal-dialog-content")[0].innerText == "The media could not be loaded, either because the server or network failed or because the format is not supported.") {
        setTimeout(refreshMedia(), 1000)
    }
    else {
        console.log("No refresh needed.");
    }
}

function refreshMedia() {
    console.log("Refreshing media.");
    document.getElementById("ytapiplayer").getElementsByClassName("btn-default").click();
    setTimeout(checkMediaError(), 1000)
}



function getActiveVideoDuration() {
    console.log("Getting active video duration");
    var videoDuration = 0;
    var videoDurationString = document.querySelector('.pluid-1 .qe_time').textContent;
    var hmsArray = videoDurationString.split(':');
    for(var i=hmsArray.length; i>=0; i--){
        videoDuration += hmsArray[i] * 60^i;
    }
    console.log(videoDuration);
}

function getActiveVideoTitle() {
    console.log("Getting Active Video...\n Active Video: "+document.querySelector(".queue_active .qe_title").textContent+"\nPrevious Video: "+previousVideoTitle);
    return document.querySelector(".queue_active .qe_title").textContent.toLowerCase();
}

function getActiveVideoURL() {
    return document.querySelector(".queue_active a").href.toLowerCase();
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////                 Observer Setup                 ////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// Kicked: Anonymous User
// document.getElementsByClassName("server-msg-disconnect").length
function setupVideoTitleObserver() {
    console.log("Setting up observer...");
    const targetNode = document.querySelector("#currenttitle");
    const observerOptions = {
        ///characterData: true, attributes: false, childList: false, subtree: true
        characterData:true,
        childList: true,
        attributes: false,
        // Omit (or set to false) to observe only changes to the parent node
        subtree: true
    }
    const observerVideoTitle = new MutationObserver(callbackVideoTitle);
    observerVideoTitle.observe(targetNode, observerOptions);
    console.log("Video Title observer setup complete.");
}

function callbackVideoTitle(mutationList, observer) {
    videosSinceRefresh++;
    previousVideoTitle = activeVideoTitle;
    activeVideoTitle = getActiveVideoTitle();
    console.log("New video detected...\nThis is video number " + videosSinceRefresh + "\nTitle: " + activeVideoTitle);
    // Videocount is not determined accurately on refresh; ends up being incremented to 3
    // On the second video after refresh we refresh for performance reasons
    /*
    if(videosSinceRefresh > 3) {
        // scroll to bottom of page to see polls
        window.scrollTo(0,document.body.scrollHeight);
        // reload
        window.setTimeout(location.reload(),3000);
    };
    window.setTimeout(scrollBottomChat,3000);
    */
    // disabling page refresh after spam for now
    /*
    if(isOnList(previousVideoTitle,spamArr)) {
        // scroll to bottom of page to see polls
        window.scrollTo(0,document.body.scrollHeight);
        // reload
        window.setTimeout(location.reload(),3000);
    }
    setupVideo();
    */
    /*
    scrollToVideo();
    checkNico();
    //checkMediaError();
    checkSoundcloud();
    checkYoutube();*/
}

function enableSpamBlocker() {
    var bool = (document.getElementById("spambtn")!=null)
    console.log("Spamblocker available? "+bool);
    if(!bool){return;}
    try{
        if(!isSpamBlocking()) {
            console.log("Blocking spam...");
            document.getElementById("spambtn").click();
        }
    }
    catch(e) {
        console.error(e.stack);
    }
}
function isSpamBlocking() {
        return document.getElementById("spambtn").className == "btn btn-sm btn-danger";
}

// Disables Nico for heavy spam videos
function checkNico() {
    var bool = (document.getElementById("nicobtn")!=null)
    console.log("Autorefresh available? "+bool);
    if(!bool){return;}

    console.log("Nico...");
    var title = getActiveVideoTitle();
    if(title == ">Streaming: PaPa TuTu WaWa full clip HD Kakuchou Shoujo-kei Trinary" || title == ">Streaming: DAYS OF GOAT" ||title == ">Streaming: GJ-bu ED3 (Purely Sky ~Watashi Dake no Sora~)" || title == ">Streaming: Padoru" || title == ">Streaming: A↑ba↓ba→ba→ba↓ba↑ba↓ba↓ba↑ba→ba→" || title == ">Streaming: 13 Merry" || title == ">Streaming: [IOSYS] F O E! (English subtitles)" || title == ">Streaming: Takatsuki Yayoi - Kiramekirari feat. John Jacobson [緑シャツおじさんがキラメキラリを再現する動画]" || title == ">Streaming: T ・ S ・ F in N I P P O N ！(Stereoman Bootleg Remix)") {
        if(isNico()) {
            console.log("Disabling Nico.");
            document.getElementById("nicobtn").click();
        }
        else {
            console.log("Nico already disabled.");
        }
    }
    else if(!isNico()){
        console.log("Enabling Nico.");
        document.getElementById("nicobtn").click();
    }
}

function isNico() {
    return document.getElementById("nicobtn").className == "btn btn-sm btn-success";
}

// "Play or Pause?"
function checkSoundcloud() {
    var urlBool = getActiveVideoURL().includes("soundcloud");
    console.log("Soundcloud? "+urlBool);
    if(!urlBool) {return;}
    try{
        if(document.getElementsByClassName("playButton medium")[0].title == "Pause") {
            console.log("Playing Soundloud.");
            document.getElementsByClassName("playButton medium")[0].click();
        }
    }
    catch(e) {
        console.error(e.stack);
    }
}

function checkYoutube() {
    var urlBool = getActiveVideoURL().includes("youtube");
    console.log("Youtube? "+urlBool);
    if(!urlBool) {return;}
    try{
        if(document.getElementsByClassName("ytp-large-play-button ytp-button")[0].ariaLabel == "Play") {
            console.log("Playing YouTube.");
            document.getElementsByClassName("ytp-large-play-button ytp-button")[0].click();
        }
    }
    catch(e) {
        console.error(e.stack);
    }
}























