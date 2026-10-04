/*
 * Jessica Video-Hub engine, shared by Csu, Vms and Type-2-Diabetes.
 *
 * Those three projects each bundled an identical copy of this code into
 * js/app.js. They differed only in their content data (window.allData) and in
 * how the desktop idle timer was computed; the idle time is now data
 * (`timers["desktop-idle"]`, in ms) so each project keeps its own value.
 *
 * A project's main.js passes its data in:
 *
 *     startJessicaHub(allData, { project: "CSU" });
 *
 * Every user interaction goes through Analytics() -> the shared Tracker
 * (Adobe + GA4 + Matomo). Events and their vendor mappings are listed in
 * shared/js/tracking/events.js and in the monorepo README.
 */

import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Swiper from "swiper/bundle";
import Video from "@shared/js/player/BaymaxVideo";
import { createTracker } from "@shared/js/tracking";
import { trackPlayerControls } from "@shared/js/tracking/playerControls";
import { makeButtons } from "@shared/js/a11y/makeButtons";
import { titleVideosForMatomo } from "@shared/js/tracking/mediaTitles";

gsap.registerPlugin(TextPlugin);

export function startJessicaHub (allData, { project }) {

        window.allData = allData;

        const tracker = createTracker({
            project,
            context: {
                videoTopic: allData.campaign,
                videoOwner: allData.owner,
                videoPlayer: allData.player,
            },
        });

        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* :::::::::::::::: global variables :::::::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


        var appStatus = "intro";
		var container = document.getElementById("interactive-player");
        var avator = document.getElementById("avator-container");
        var mediaContainer = document.getElementById("media-container");
        var skipVDOBtn = document.getElementById("skip-intro");
        var cover = document.querySelector(".cover");
        var desktopAvatorPlayer = document.getElementById("desktop-avator-player");
        var mobileAvatorPlayer = document.getElementById("mobile-avator-player");

        var mobileINITtimer;
        var mobileautoTimer;
        var currentVDOurl;

        var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        var isMobile;

        if (window.innerWidth < 768) {isMobile = true;} else {isMobile = false;}

		window.currentIndex = 0;
        var playNext = "";
        var tween1;
        var tween2;
        var tween3;
        var tween4;
        let introWaitTimer;


        var DesktopMenuContainer = document.getElementById("desktop-menu");
        var MobileMenuContainer = document.getElementById("mobile-menu");
        var endScreenMenu = document.getElementById("end-screen-menu");
        var desktopTmbContainer = document.querySelector(".thumb-container");
        var mobileTmbContainer = document.querySelector(".swiper-wrapper");
        var introtitle = document.querySelector("#intro-copy .title");
        var introsubtitle = document.querySelector("#intro-copy .sub-title");
        var outtitle = document.querySelector("#end-screen-menu .title");
        var outsubtitle = document.querySelector("#end-screen-menu .sub-title");
        var mobileDotContainer = document.querySelector(".tumbnail-dot-container");


        for (var i = 0; i < window.allData.order.length; i++) {
            var tempIndex = window.allData.order[i];
            var tempteaser = window.allData[tempIndex].teaser;
            var tmbCopy = window.allData[tempIndex].thumbCopy;
            var tmbIMG = window.allData[tempIndex].thumb;
            //console.log(tempteaser);

            var tempDthumb = document.createElement("div");
            tempDthumb.classList.add("thumb");
            tempDthumb.id = "thumb-" + Number(i + 1);
            tempDthumb.setAttribute('data-index-number', Number( 1 + i));
            tempDthumb.setAttribute('data-name', tempIndex);
            tempDthumb.innerHTML = "<div class='thumb-bg'></div><div class='thumb-icon'></div><div class='thumb-status' data-label='NOW PLAYING' aria-hidden='true'></div><div class='thumb-copy'>"+tmbCopy+"</div>";

            var thumbBG = tempDthumb.querySelector(".thumb-bg");
            thumbBG.style.backgroundImage = "url('"+tmbIMG+"')";
            //console.log(thumbBG);

            var tempMthumb = document.createElement("div");
            tempMthumb.classList.add("thumb");
            tempMthumb.classList.add("swiper-slide");
            tempMthumb.id = "thumb-" + Number(i + 1);
            tempMthumb.setAttribute('data-index-number', Number( 1 + i));
            tempMthumb.setAttribute('data-name', tempIndex);
            tempMthumb.innerHTML = "<div class='thumb-bg'></div><div class='thumb-icon'></div><div class='thumb-status' data-label='NOW PLAYING' aria-hidden='true'></div><div class='thumb-copy'>"+tmbCopy+"</div>";

            var thumbMBG = tempMthumb.querySelector(".thumb-bg");
            thumbMBG.style.backgroundImage = "url('"+tmbIMG+"')";
            //console.log(thumbBG);
           
            var tempDesktopMenu = document.createElement("div");
            tempDesktopMenu.innerHTML = tempteaser;
            tempDesktopMenu.classList.add("btn-style");
            tempDesktopMenu.setAttribute('data-name', tempIndex);
            tempDesktopMenu.id = "btn-" + i;
            tempDesktopMenu.setAttribute('data-index-number', Number( 1 + i));

            var tempMobileMenu = document.createElement("div");
            tempMobileMenu.innerHTML = tempteaser;
            tempMobileMenu.classList.add("btn-style");
            tempMobileMenu.setAttribute('data-name', tempIndex);
            tempMobileMenu.id = "btn-" + i;
            tempMobileMenu.setAttribute('data-index-number', Number( 1 + i));

            var tempEndMenu = document.createElement("div");
            tempEndMenu.innerHTML = tempteaser;
            tempEndMenu.classList.add("end-btn-style");
            tempEndMenu.setAttribute('data-name', tempIndex);
            tempEndMenu.id = "end-btn-" + i;
            tempEndMenu.setAttribute('data-index-number', Number( 1 + i));

            var eachDot = document.createElement("div");
            eachDot.classList.add("dot-style");
            eachDot.id = "dot-" + Number( 1 + i);
            eachDot.setAttribute('data-index-number', Number( 1 + i));


            DesktopMenuContainer.appendChild(tempDesktopMenu);
            MobileMenuContainer.appendChild(tempMobileMenu);
            endScreenMenu.appendChild(tempEndMenu);
            desktopTmbContainer.appendChild(tempDthumb);
            mobileTmbContainer.appendChild(tempMthumb);
            mobileDotContainer.appendChild(eachDot);

        }

        introtitle.innerHTML = window.allData.intro.title;
        introsubtitle.innerHTML = window.allData.intro.subtitle;
        outtitle.innerHTML = window.allData.outro.title;
        outsubtitle.innerHTML = window.allData.outro.subtitle;
        

        
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* :::::::::::::::: common shared functions ::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


        var StopWatch = window.StopWatch = function () {

            var internalCounter = 0;
            var yoMTV;
            var internalInterval;
            //console.debug("this is stopwatch");
    
            return {
                
                remainingtime: function remainingtime () {
                    return yoMTV;
                },

                start: function start ( target, callbackfunction ) {
                    internalInterval = setInterval(function(){
                        //console.debug("timer :",internalCounter);
                        yoMTV = Number(target - internalCounter);
                        //console.debug("remaing time: ",yoMTV);
                        internalCounter++;

                        if (yoMTV < 1) {
                            //console.debug("clear out the interval please");
                            clearInterval ( internalInterval );
                            if (callbackfunction) {  callbackfunction (); }
                        }

                    }, 1000);
                },

                restart: function restart ( target, callbackfunction ) {
                    internalCounter = 0;
                    internalInterval = setInterval(function(){
                        //console.debug("timer :",internalCounter);
                        yoMTV = Number(target - internalCounter);
                        //console.debug("remaing time: ",yoMTV);
                        internalCounter++;

                        if (yoMTV < 1) {
                            //console.debug("clear out the interval please");
                            clearInterval ( internalInterval );
                            if (callbackfunction) {  callbackfunction (); }
                        }
                    }, 1000);
                },

                pause: function pause () {
                    clearInterval ( internalInterval );
                },

                reset: function reset () {
                    clearInterval ( internalInterval );
                    internalCounter = 0;
                }
               
            }

        }();



        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }
       


        function RemoveFromDOM (whichOne) {
            let removethisPlease = document.querySelector(whichOne);
            let itemsParent = removethisPlease.parentNode;
            itemsParent.removeChild(removethisPlease);

        }

        function getImgs (doc) {
            return Array.from(doc.getElementsByTagName('img'))
              .map(img => ({
                src: img.currentSrc, // img.src if you want the origin
                width: img.naturalWidth,
                height: img.naturalHeight
              }))
        }

        function getBgImgs (doc) {
            const srcChecker = /url\(\s*?['"]?\s*?(\S+?)\s*?["']?\s*?\)/i
            return Array.from(
              Array.from(doc.querySelectorAll('*'))
                .reduce((collection, node) => {
                  let prop = window.getComputedStyle(node, null)
                    .getPropertyValue('background-image')
                  let match = srcChecker.exec(prop)
                  if (match) { collection.add(match[1]) }
                  return collection
                }, new Set())
            )
          }
          

         
       
		function SetState (whichState) {
			var allStates = ["intro-state","topics-state","playlist-state","playing-state","paused-state","end-state","resume-jessica","pause-jessica"];
			for (var i = 0; i < allStates.length; i++) {
				if (allStates[i] == whichState) {container.classList.add(whichState);}
				else { container.classList.remove(allStates[i]); }
			}

            if (whichState == "intro-state") {
                container.classList.remove("show-thumbnail");
                container.classList.remove("hide-thumbnail");
                container.classList.add("show-jessica");
                container.classList.remove("hide-jessica");
            }

            else if (whichState == "topics-state") {
                container.classList.add("show-jessica");
                container.classList.remove("hide-jessica");
                container.classList.remove("show-thumbnail");
                container.classList.remove("hide-thumbnail");
            }

            else if (whichState == "playlist-state") {
                container.classList.add("show-thumbnail");
                container.classList.remove("hide-thumbnail");
            }

		}

        function resetThumbNails (whichClass) {

            var thmContainer

            if (isMobile) {thmContainer = document.querySelector(".swiper-wrapper");}
            else {thmContainer = document.querySelector(".thumb-container");}

            try {
                
                var siblingCount = thmContainer.childElementCount;
                for (var k = 0; k < siblingCount; k++) {thmContainer.children[k].classList.remove(whichClass)}
            }
            catch (Error) {}
		
		}

        function resetOverlays (whichOne) {

            currentTextBlob = document.getElementById("generic-blob-overlay");
            currentTextBlob.textContent = "";
            removeAllChildNodes(currentTextBlob);
        }

        /*
        function playAvator (avatorVDO, whichVDO, whichPlatform) {
            currentVDOurl = whichVDO;
            if (whichPlatform == "desktop") {updateDesktopAvator (avatorVDO);}
            else {updateMobileAvator (avatorVDO);}
		}
        */

        function playAvator (data) {
            console.group("playAvator");
            console.log("avator URL: ", data["avatorURL"]);
            console.log("video URL: ", data["videoURL"]);
            console.log("platform: ",data["platform"]);

            currentVDOurl = data["videoURL"];

            if (data["platform"] == "desktop") {updateDesktopAvator (data["avatorURL"]);}
            else {updateMobileAvator (data["avatorURL"]);}
            console.groupEnd("playAvator");
		}



        function togglevisibility (whichOne) {
            if (whichOne.classList.contains("show")) {
                whichOne.classList.remove("show");
                whichOne.classList.add("hide");
            }
            else {
                whichOne.classList.add("show");
                whichOne.classList.remove("hide");
            }
        }


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* :::::::::::::::: blob codes :::::::::::::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */

	
		function blobBtnsInit (platform) {
			for (var i = 0; i < 4; i++) {
				var tempBtn = document.getElementById("btn-" + i);
				tempBtn.addEventListener("click", function(event) {

                    console.log(":::::: MENU BUTTONS CLICKED :::::");

                    Analytics({
                        "name":"ctaAction",
                        "cta": window.allData.trackingmap[event.currentTarget.dataset.name],
                        "detail": "topic-menu"
                    });
                    container.classList.remove("just-talking");

                    StopWatch.reset();

                    appStatus = window.allData[event.currentTarget.dataset.name].appstate;
                    currentVDOurl =  window.allData[event.currentTarget.dataset.name].video;

                    var dataNameOfItem = event.currentTarget.dataset.name;

                    console.group("menu-button");
                    console.log("menu-selected: ", window.allData[event.currentTarget.dataset.name].appstate);
                    console.log("video selected: ",currentVDOurl );
                    console.groupEnd("menu-button");

                    SetState ("playlist-state");

                    if (platform == "desktop") {  
                        try {clearTimeout(introWaitTimer);} catch (Error) {}
                        try {
                            resetThumbNails ("playing");
                            var tmpContainer = document.querySelector(".thumb-container");
                            var corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                            corrospondingThumb.classList.add("playing");
                            corrospondingThumb.classList.add("played");
                        } catch (Error) {}

                       /* playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, "desktop" ); */

                        playAvator ({
                            "videoURL":window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatordesktop,
                            "platform": "desktop"
                        });

                        /*
                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual " + window.allData.campaign + " Assistant"
                        });
                        */

                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });
                    }

                    else if (platform == "mobile") { 
                        document.querySelector("#avator-container-mobile .blob-2").classList.add("hide"); 
                        document.getElementById("mobile-avator-player").pause();
                        updatenavDots ( event.currentTarget.dataset.indexNumber );
                        clearTimeout (mobileINITtimer);

                        try {
                            var tmpContainerMobile = document.querySelector(".swiper-wrapper");
                            var corrospondingThumbMobile = tmpContainerMobile.querySelector('[data-name~="'+dataNameOfItem+'"]');
                            corrospondingThumbMobile.classList.add("selected");
                            corrospondingThumbMobile.classList.add("played");
                        } catch (Error) {}

                        /* playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, "mobile" ); */

                        playAvator ({
                            "videoURL":window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatormobile,
                            "platform": "mobile"
                        });
                    }                 
				
				})
			}
		}


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* ::::::::::::::::: navigation init code ::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


		function initNav (platform) {

            var topNav = document.getElementById("back-to-topics");
            var showJessicaNav = document.getElementById("show-jessica");
			var hideJessicaNav = document.getElementById("hide-jessica");
            var pauseJessicaNav = document.getElementById("pause-jessica");
            var resumeJessicaNav = document.getElementById("resume-jessica");

            if (platform == "desktop") {

                topNav.addEventListener("click",function(){
                    Analytics({
                        "name":"ctaAction",
                        "cta": topNav.textContent.trim(),
                        "detail": "nav"
                    });
                    try { if (container.classList.contains("talking")) { 
                        desktopAvatorPlayer.pause();
                        container.classList.remove("talking");
                        container.classList.remove("show-jessica");
                        container.classList.remove("hide-jessica");
                        container.classList.remove("buffering");
                        container.classList.remove("just-talking");
                    }} 
                    catch (Error) {
                        //console.error("stop-speech-error: ",Error);
                    }
                    try { window.Player.PauseVideo();} catch (Error) {
                        //console.error("baymax-pause-error: ",Error);
                    }
                    setTimeout(function(){  SetState ("topics-state");}, 100);

                    for (var i = 1; i <= 4; i++) {
                        try {
                            var tempDot = document.getElementById("dot-" + i);
                            container.classList.remove("dot-selected-" + i); 
                            tempDot.classList.remove("active");
                        } 
                        catch(Error) {}
                    }

                    document.getElementById("avator-container-desktop").classList.remove("hide");

                });


                pauseJessicaNav.addEventListener("click",function(){
                    
                    container.classList.add("pause-jessica");
                    container.classList.remove("resume-jessica");
                    container.classList.remove("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    try {desktopAvatorPlayer.pause();} catch(Error) {}

                    try {
                        StopWatch.pause();
                        clearTimeout(introWaitTimer);
                    } 
                    
                    catch (Error) {}

                    //console.log("-------- both 12 ------------");
                    /*
                    Analytics({
                        "name":"videoPause",
                        "item":"Pause Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoPause",
                        "item":"Virtual Assistant",
                        "cta": pauseJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    
                })

                resumeJessicaNav.addEventListener("click",function(){
                    
                    container.classList.remove("pause-jessica");
                    container.classList.remove("just-talking");
                    container.classList.add("resume-jessica");
                    container.classList.remove("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    try {desktopAvatorPlayer.play();} catch(Error) {}

                    try {
                        var tempTimer = StopWatch.remainingtime();
                        StopWatch.restart(tempTimer, automatePlayer);
                       
                    } 
                    catch (Error) {}


                    function automatePlayer () {
                        SetState ("playlist-state");
                        appStatus = window.allData.order[0];
                        var dataNameOfItem = window.allData.order[0];
                        var tmpContainer = document.querySelector(".thumb-container");
                        var corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("playing");
                        corrospondingThumb.classList.add("playing");
                        corrospondingThumb.classList.add("played");

                        /*playAvator ( window.allData[window.allData.order[0]].avatordesktop, window.allData[window.allData.order[0]].video, "desktop" );*/

                        playAvator ({
                            "videoURL": window.allData[window.allData.order[0]].video,
                            "avatorURL": window.allData[window.allData.order[0]].avatordesktop,
                            "platform": "desktop"
                        });
                    }

                    //console.log("-------- both 11 ------------");
                    /*
                    Analytics({
                        "name":"videoResume",
                        "item":"Resume Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoResume",
                        "item":"Virtual Assistant",
                        "cta": resumeJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });


                })


    
                hideJessicaNav.addEventListener("click",function(){
                    console.log("-------- hide jessica BTN");
                    container.classList.remove("pause-jessica");
                    container.classList.remove("resume-jessica");
                    container.classList.add("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    
                    container.classList.remove("just-talking");
                   
                    try {desktopAvatorPlayer.pause();} catch(Error) {}
                    //blobTextControl2({"action":"pause"});
                    controlTextTimeline("pause");
                    if (!container.classList.contains("playing-state")) {
                        try { 
                            window.Player.LoadVideoAndPlay ({
                                "url": window.allData[appStatus].video,
                                "poster": window.allData[appStatus].poster
                            }); 
                        } catch (Error) {}
                    }


                    //console.log("-------- both 10 ------------");

                    /*
                    Analytics({
                        "name":"videoHide",
                        "item":"Hide Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoHide",
                        "item":"Virtual Assistant",
                        "cta": hideJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });


                    
                })
    
                showJessicaNav.addEventListener("click",function(){
                    console.log("-------- show jessica BTN");
                    container.classList.remove("pause-jessica");
                    container.classList.remove("resume-jessica");
                   // container.classList.add("resume-jessica");
                    container.classList.remove("hide-jessica");
                    container.classList.add("show-jessica");
                    //blobTextControl2({"content": false,"action":"resume"});
                    controlTextTimeline("resume");
                    
                    if ((appStatus != "topics") || (appStatus != "intro")) {
                        if (window.avatorStat == "ended") {}
                        else if (window.avatorStat == "playing") {
                             try {
                                 container.classList.add("just-talking");
                             } catch(Error) {}
                        }
                    }

                    if (container.classList.contains("talking")) {try {desktopAvatorPlayer.play();} catch(Error) {}}


                    //console.log("-------- both 9 ------------");

                    /*
                    Analytics({
                        "name":"videoShow",
                        "item":"Show Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoShow",
                        "item":"Virtual Assistant",
                        "cta": showJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                  
                    
                })
            }

            else {

                topNav.addEventListener("click",function(){
                    try { window.Player.PauseVideo();} catch (Error) {
                        //console.error("baymax-pause-error: ",Error);
                    }
                    setTimeout(function(){  SetState ("topics-state");}, 100);
                    document.getElementById("avator-container-mobile").classList.remove("hide");
                    document.querySelector("#avator-container-mobile .blob-2").classList.remove("hide");

                    //console.log("-------- both 8 ------------");
                    Analytics({
                        "name":"videoStart",
                        "item":"Menu Page",
                        "cta": topNav.textContent.trim(),
                        "detail": "nav"
                    });


                });


                pauseJessicaNav.addEventListener("click",function(){
                    console.log("pause jessica");
                    container.classList.add("pause-jessica");
                    container.classList.remove("resume-jessica");
                    container.classList.remove("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    try {mobileAvatorPlayer.pause();} catch (Error) {}
                    try {clearTimeout(mobileautoTimer);} catch (Error) {}


                    //console.log("-------- both 8 ------------");

                    /*
                    Analytics({
                        "name":"videoPause",
                        "item":"Pause Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoPause",
                        "item":"Virtual Assistant",
                        "cta": pauseJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });


                })

                resumeJessicaNav.addEventListener("click",function(){
                    console.log("resume jessica");
                    container.classList.remove("pause-jessica");
                    container.classList.add("resume-jessica");
                    container.classList.remove("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    try {mobileAvatorPlayer.play();} catch (Error) {}

                    //console.log("-------- both 7 ------------");

                    /*
                    Analytics({
                        "name":"videoResume",
                        "item":"Resume Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoResume",
                        "item":"Virtual Assistant",
                        "cta": resumeJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });


                })

            }
        
		}


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* ::::::::::::::::: thumbnail related code ::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
	

		function initThumbs (platform) {

            var thumbnailContainer = document.getElementById("playlist");

			for (var i = 1; i <= window.allData.order.length; i++) {
				var tempThumb = document.getElementById("thumb-" + i);
				tempThumb.addEventListener("click", function (event) {

                    Analytics({
                        "name":"ctaAction",
                        "cta": window.allData.trackingmap[event.currentTarget.dataset.name],
                        "detail": "playlist"
                    });

                  
                    thumbClicked (event.currentTarget.dataset.indexNumber);

                    container.classList.remove("just-talking");

					var currentItem = event.currentTarget;
					resetThumbNails ("playing");
					currentItem.classList.add("playing");
					currentItem.classList.add("played");

                    appStatus = window.allData[event.currentTarget.dataset.name].appstate;
                    currentVDOurl =  window.allData[event.currentTarget.dataset.name].video;
                    var tempPoster = window.allData[event.currentTarget.dataset.name].poster;

                    window.Player.LoadVideoAndPause({
                        "url":currentVDOurl,
                        "poster":tempPoster
                    });

					window.Player.PauseVideo();
                    window.Player.SetState (mediaContainer,"pause-state");	

                    // setTimeout(() => {
                    //     window.Player.UpdatePoster ("https://picsum.photos/1600/900");
                    // }, "1000")

                    if (platform == "desktop") { 
                        container.classList.add("show-jessica");
                        /*playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, "desktop" ); */

                        playAvator ({
                            "videoURL": window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatordesktop,
                            "platform": "desktop"
                        });
                        
                    }
                    else { 
                        /* playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, "mobile" ); */

                        playAvator ({
                            "videoURL": window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatormobile,
                            "platform": "mobile"
                        });
                    
                    }


                    //console.log("-------- both 6 ------------");
                    /*
                    Analytics({
                        "name":"videoStart",
                        "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoStart",
                        "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                    });

				
				})
			}

            var thumbnailShowHideBtn = document.querySelector(".show-hide-btn");
            thumbnailShowHideBtn.addEventListener("click",function () {

                Analytics({
                    "name":"ctaAction",
                    "cta": container.classList.contains("show-thumbnail") ? "Hide Playlist" : "Show Playlist",
                    "detail": "playlist"
                });

                if (container.classList.contains("show-thumbnail")) {
                    container.classList.remove("show-thumbnail");
                    container.classList.add("hide-thumbnail");                   
                }
                else {
                    container.classList.add("show-thumbnail");
                    container.classList.remove("hide-thumbnail");
                }
            })

		}

        function thumbClicked (whichOne) {
            
            for (var i = 1; i <= window.allData.order.length; i++) {

                var tempDot = document.getElementById("dot-" + i);

                if ( i == whichOne) { 
                    container.classList.add("dot-selected-" + i); 
                    tempDot.classList.add("active");
                }
                else { 
                    container.classList.remove("dot-selected-" + i); 
                    tempDot.classList.remove("active");
                }
            }

        }


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* :::::::::::: sitepal event listener code ::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


        let timeoutID;


        function introTextWriting () {
            tween1 = gsap.to(".blob-1", {
                text: {value: window.allData["intro"].copy}, 
                duration:  window.allData.intro.textduration, 
                delay: 1.5, 
                ease: "none",
                onComplete:function(){
                    // The intro text finishes ~15 s after Meet Jessica. If the user
                    // has picked a topic by then, leave them there: switching back
                    // to "topics" here used to yank the UI to the topic menu mid-video
                    // and blank the video name on every event that followed.
                    if (appStatus != "intro") { return; }
                    appStatus = "topics";
                    setTimeout(function(){ SetState ("topics-state");}, 1000);
                }
            })
        }


        var blobTextAnimationTL = gsap.timeline({paused: true});
        var currentTextBlob;

        var blobTextControl2 = window.blobTextControl2 = function (data) {

           
            //console.clear();

            currentTextBlob = document.getElementById("generic-blob-overlay"); 
            // 

            if (data.content) {

                //console.debug("data content is present: ");
                //console.debug(data);

                if(!blobTextAnimationTL.isActive()) {
                    //console.debug("old timeline is still working");
                    blobTextAnimationTL.kill();
                    currentTextBlob.textContent = "";
                    removeAllChildNodes(currentTextBlob);
                    setTimeout(() => {
                        blobTextAnimationTL = gsap.timeline({});
                        blobTextAnimationTL.to(currentTextBlob, {text: {value: data.content}, duration: data.textduration, delay: 1, ease: "none"});
                    }, 50);
                }
                else {
                    //console.debug(" ----- this just got triggered ");
                    blobTextAnimationTL.kill();
                    currentTextBlob.textContent = "";
                    removeAllChildNodes(currentTextBlob);
                    setTimeout(() => {
                        blobTextAnimationTL = gsap.timeline({});
                        blobTextAnimationTL.to(currentTextBlob, {text: {value: data.content}, duration: data.textduration, delay: 1, ease: "none"});
                    }, 50);
                }
            }

            else {
                //console.debug("data content NOT is present: ");
                if (data.action) {
                    if (data.action == "restart") { blobTextAnimationTL.restart();}
                    else if (data.action == "pause") {
                        //console.debug("pause timeline please :::::::::: ");
                        blobTextAnimationTL.pause();
                    }
                    else if (data.action == "resume") {
                        //console.debug("resume timeline please :::::::::: ");
                        blobTextAnimationTL.resume();
                    }
                }
            }

        }

        function controlTextTimeline (whichOne) {
            if (whichOne == "resume") {
                blobTextAnimationTL.resume();
            }
            else if (whichOne == "pause") {
                blobTextAnimationTL.pause();
            }
        }

       
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* ::::::::::::::::: video player init code ::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


       


		window.Player = new Video ({
			container: 'media-container',
            VideoTracking: {
                "25%": function () {
                    Analytics({
                        "name":"videoQuartile25",
                        "item": window.allData.trackingmap[appStatus]
                    });
                },
                "75%": function () {
                    Analytics({
                        "name":"videoQuartile75",
                        "item": window.allData.trackingmap[appStatus]
                    });
                }
            },
			mp4: window.allData[window.allData.order[0]].video,
			autoplay: false,
            //controls: true,
			//poster: "./assets/video-bg.jpg", 
            poster: "./assets/poster-clear-2.png", 
			callbackfunction: {
				onLoad: function(){},
				onAutoPlay: function() {},
				onPlay: function(event){
                    //console.debug("video--start",appStatus);

                    try {

                        let currentStats = window.Player.status();

                        if (currentStats.currentTime < 1) {
                            Analytics({
                                "name":"videoStart",
                                "item": window.allData.trackingmap[appStatus]
                            });
                        }
                        else {
                            Analytics({
                                "name":"videoResume",
                                "item": window.allData.trackingmap[appStatus]
                            });
                        }
                       
                    }
                    catch (Error) {
                        console.debug(Error);
                    }

					SetState ("playing-state");
					try {
                        if (container.classList.contains("talking")) { 
                           container.classList.remove("talking");
                           try {desktopAvatorPlayer.pause();} catch(Error) {}
                        }
                        if (container.classList.contains("buffering")) {container.classList.remove("buffering");}

                    }catch (Error) {}
				},
                onMidway: function(event){
                    //console.debug("video--midway",appStatus);

               

                    try {

                        /*
                        window._analytics({
                            Name: "videoHalfway",
                            videoName: appStatus,
                            videoOwner: "Sharecare Video Team - Atlanta",
                            videoPlayer: "Digital Citizen"
                        })
                        */

                        //console.log("-------- both 4 ------------");
                        Analytics({
                            "name":"videoHalfway",
                            "item": window.allData.trackingmap[appStatus]
                        });
                    }
                    catch (Error) {
                        console.debug(Error);
                    }
                    
                },
				onPause: function(){
                    SetState ("paused-state");
                    container.classList.add("show-jessica");
                    container.classList.remove("hide-jessica");

                    Analytics({
                        "name":"videoPause",
                       // "item":"Virtual Assistant"
                        "item": window.allData.trackingmap[appStatus]
                    });


                },
				onMute: function(){

                    Analytics({
                        "name":"videoMute",
                        "item":"Virtual Assistant"
                    });
                },
				onUnMute: function(){

                    Analytics({
                        "name":"videoUnMute",
                        "item":"Virtual Assistant"
                    });
                },
				onEnd: function(event) {
                    //console.debug("video--end",appStatus);

                    try {

                        /*
                        window._analytics({
                            Name: "videoComplete",
                            videoName: appStatus,
                            videoOwner: "Sharecare Video Team - Atlanta",
                            videoPlayer: "Digital Citizen"
                        });
                        */


                        //console.log("-------- both 3 ------------");
                        Analytics({
                            "name":"videoComplete",
                            "item": window.allData.trackingmap[appStatus]
                        });

                    }
                    catch (Error) {
                        console.log(Error);
                    }

					var videoJustPlayed = event.target.currentSrc;
					SetState ("paused-state");
                    resetOverlays ();
                    container.classList.add("show-jessica");
                    container.classList.remove("hide-jessica");

                    var howMany;

                    if (isMobile) {howMany = FindNext ("mobile");}
                    else {howMany = FindNext ("desktop");}
					
					if (howMany == undefined) {console.log("::::: DO NOTHING :::");}
					else if (howMany === window.allData.order.length) {
                        //console.log(" ---------- TADA ---------");
                        SetState("end-state");
                        resetThumbNails ("playing");
                        resetThumbNails ("played");
                        container.classList.remove("hide-jessica");
                        container.classList.remove("buffering");
                        container.classList.add("show-jessica");

                        for (var i = 1; i <= window.allData.order.length; i++) {
                            try {
                                var tempDot = document.getElementById("dot-" + i);
                                container.classList.remove("dot-selected-" + i); 
                                tempDot.classList.remove("active");
                            } 
                            catch(Error) {}
                        }

                        //console.log("-------- both 2 ------------");
                        /*
                        Analytics({
                            "name":"videoComplete",
                            "item": "Virtual " + window.allData.campaign + " Assistant"
                        });
                        */

                        Analytics({
                            "name":"videoComplete",
                            "item": "Virtual Assistant"
                        });

					}
				},
				onRePlay: function(){},
				onAbort: function() {},
				onStalled: function() {},
				onSuspend: function() {},
				onFullScreen: function(){},
				onCloseFullScreen: function(){}
			}
		});

        trackPlayerControls("media-container", Analytics, function () {
            return window.allData.trackingmap[appStatus];
        });

        // role="button" etc. on every tracked control, so Matomo's generic
        // AllElementsClick trigger reports them (see shared/js/a11y/makeButtons.js).
        makeButtons();

        // Titles for Matomo Media Analytics, which tracks the <video> elements itself.
        titleVideosForMatomo(function (video) {
            if (video.closest("#media-container")) {
                // The topic player preloads topic 1 while the intro is still on.
                var key = window.allData.order.indexOf(appStatus) > -1 ? appStatus : window.allData.order[0];
                return window.allData.trackingmap[key];
            }
            return (window.allData.trackingmap[appStatus] || appStatus) + " Virtual Assistant";
        });


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* ::::::::::::::::: video sequence code :::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */


		var FindNext = function (platform) {
			var howMany = 0;
			for (var i = 1; i <= window.allData.order.length; i++) {
				var tempItem = document.getElementById("thumb-" + i);
				if (tempItem.classList.contains("played")) { howMany++; }

				else {

                    appStatus = window.allData[tempItem.dataset.name].appstate;
                    currentVDOurl =  window.allData[tempItem.dataset.name].video;
                    
					tempItem.classList.add("played");

                    if (platform == "desktop") { 
                        resetThumbNails ("playing");
                        tempItem.classList.add("playing");
                        /* playAvator ( window.allData[tempItem.dataset.name].avatordesktop, window.allData[tempItem.dataset.name].video, "desktop" ); */

                        playAvator ({
                            "videoURL": window.allData[tempItem.dataset.name].video,
                            "avatorURL": window.allData[tempItem.dataset.name].avatordesktop,
                            "platform": "desktop"
                        });


                    }
                    else { 
                        resetThumbNails ("selected");
                        tempItem.classList.add("selected");
                        /* playAvator ( window.allData[tempItem.dataset.name].avatormobile, window.allData[tempItem.dataset.name].video, "mobile" ); */

                        playAvator ({
                            "videoURL": window.allData[tempItem.dataset.name].video,
                            "avatorURL": window.allData[tempItem.dataset.name].avatormobile,
                            "platform": "mobile"
                        });
                    }
				
					return;
				}
			}

			return howMany;
		}


        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* ::::::::::::::::: end screen init code ::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */

        function endScreenInit (platform) {

			for (var i = 0; i < window.allData.order.length; i++) {
				var tempBtn = document.getElementById("end-btn-" + i);
				tempBtn.addEventListener("click", function(event) {

                    Analytics({
                        "name":"ctaAction",
                        "cta": window.allData.trackingmap[event.currentTarget.dataset.name],
                        "detail": "end-screen"
                    });

                    appStatus = window.allData[event.currentTarget.dataset.name].appstate;
                    currentVDOurl =  window.allData[event.currentTarget.dataset.name].video;

                    var tmpContainer;
                    var corrospondingThumb;
					
					var dataNameOfItem = event.currentTarget.dataset.name;

					SetState ("playlist-state");

                    if (platform == "desktop") { 

                        tmpContainer = document.querySelector(".thumb-container");
                        corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("playing");

                        corrospondingThumb.classList.add("playing");
                        corrospondingThumb.classList.add("played");

                        /* playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, platform ); */

                        playAvator ({
                            "videoURL": window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatordesktop,
                            "platform": platform
                        });

                        //console.log("-------- both 1 ------------");
                        /*
                        Analytics({
                            "name":"videoStart",
                            "item":window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });
                        */

                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });

                    }
                    else { 

                        tmpContainer = document.querySelector(".swiper-wrapper");
                        corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("selected");

                        corrospondingThumb.classList.add("selected");
                        corrospondingThumb.classList.add("played");

                        /* playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, platform ); */

                        playAvator ({
                            "videoURL": window.allData[event.currentTarget.dataset.name].video,
                            "avatorURL": window.allData[event.currentTarget.dataset.name].avatormobile,
                            "platform": platform
                        });
                    }


                 

					
				})
			}
		}


        


        function initAvatorPlayer (platform) {

            let avatorPlayer;
            if (platform == "mobile") {avatorPlayer = mobileAvatorPlayer;}
            else if (platform == "desktop") {avatorPlayer = desktopAvatorPlayer;}

            

            avatorPlayer.addEventListener('playing', (event) => { 
                container.classList.add("talking");
                container.classList.remove("buffering");

                window.avatorStat = "playing";

                if (platform == "desktop") {
                    if (appStatus == "intro") { 
                        document.querySelector(".blob-1").classList.remove("hide");
                        introTextWriting ();
                    }

                    else { 

                        try {
                            blobTextControl2({ 
                                "content": window.allData[appStatus].copy, 
                                "textduration": window.allData[appStatus].textduration, 
                                "action": "restart" 
                            }); 
                        } catch (Error) {}
                       
                    }   

                }

                try { window.Player.UpdatePoster (window.allData[appStatus].poster); }
                catch (Error) { console.log(Error); }
            
            });
            avatorPlayer.addEventListener('ended', (event) => {

                window.avatorStat = "ended";

                //console.log("avator ended",appStatus);
                container.classList.remove("talking");
                container.classList.remove("just-talking");
                skipVDOBtn.classList.add("hide");
                if (appStatus == "intro") {} else { 
                    try { 
                        window.Player.LoadVideoAndPlay ({
                            url: window.allData[appStatus].video,
                            "poster": window.allData[appStatus].poster
                        });
                        //window.Player.UpdatePoster (window.allData[appStatus].poster);  
                    } catch (Error) {}
                }
                if (platform == "mobile") { document.getElementById("avator-container-mobile").classList.add("hide");}
            });
        }


        function updateMobileAvator (whichVDO) {
            //console.log("current appState: ",appStatus);
            for (var i = 0; i < window.allData.order.length; i++) {
                if (window.allData.order[i] == appStatus) {
                    updatenavDots ( i + 1);
                    continue;
                }
            }

            document.getElementById("avator-container-mobile").classList.remove("hide");
            mobileAvatorPlayer.src = whichVDO;
            mobileAvatorPlayer.play();

            skipVDOBtn.classList.remove("hide");

            if (appStatus != "intro") {
                //console.log("-------- mobile 1 ------------");
                /*
                Analytics({
                    "name":"videoStart",
                    "item":appStatus + " Virtual Assistant"
                });
                */

                // window.allData.trackingmap[appStatus]
                /*
                Analytics({
                    "name":"videoStart",
                    "item":window.allData.trackingmap[appStatus] + " " + "Virtual " + window.allData.campaign +  " Assistant"
                });
                */

                Analytics({
                    "name":"videoStart",
                    "item":window.allData.trackingmap[appStatus] + " " + "Virtual Assistant"
                });
            }

        }

        function updateDesktopAvator (whichVDO) {
            //console.log("::::: DESKTOP VIDEO SELECTED::::: ", whichVDO);
            document.getElementById("avator-container-desktop").classList.remove("hide");
            desktopAvatorPlayer.src = whichVDO;
            /* desktopAvatorPlayer.load(); */

            if (isSafari) { desktopAvatorPlayer.play();}
            else { desktopAvatorPlayer.load(); }
            //console.log("video player: ",desktopAvatorPlayer);
        }


        
        function updatenavDots (whichOne) {
            for (var i = 1; i <= window.allData.order.length; i++) {
                var tempDot = document.getElementById("dot-" + i);
                if ( i == whichOne) {
                    tempDot.classList.add("active");
                    container.classList.add("dot-selected-" + i);
                }
                else {
                    tempDot.classList.remove("active");
                    container.classList.remove("dot-selected-" + i);
                }
            }
        }


        /* :::::::::::::::::: Analytics Function ::::::::::::: */
        /* ::::::::::::::::::::::::::::::::::::::::::::::::::: */
      
        function Analytics (data) {
            tracker.track(data);
        }


        /* :::::: END OF Analytics Function :::::::::::::::::: */
        /* ::::::::::::::::::::::::::::::::::::::::::::::::::: */



        function init () {

            var startPage = document.querySelector(".startpage");

            if (isMobile) {
                container.classList.add("mobile");
                launchMobileVersion ();
            }
            else { 
                launchDesktopVersion ();
                container.classList.add("desktop");
            }
            
            function launchDesktopVersion () {
                //console.log("::::: launch DESKTOP ::::::");
                RemoveFromDOM ("#avator-container-mobile");
                RemoveFromDOM (".thumb-container-mobile");
               
                startPage.addEventListener("click",function(){

                    //console.log("-------- desktop 1 ------------");
                    /*
                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual " + window.allData.campaign + " Assistant",
                    });
                    */

                    Analytics({
                        "name":"intro-click",
                        "item":"Meet Jessica",
                        "cta": startPage.querySelector(".btn-copy").textContent.trim(),
                        "detail": "intro"
                    });

                    startPage.classList.add('hide');
                    initAvatorPlayer("desktop");
                    updateDesktopAvator(window.allData["intro"].avatordesktop);

                    /* StopWatch.start(35); */

        
                    let idleTime = window.allData["timers"]["desktop-idle"];
                    StopWatch.start(idleTime/1000);
                    //StopWatch.start(window.allData["timers"]["no-user-interaction"]/1000);

                    introWaitTimer = setTimeout(function(){
                        SetState ("playlist-state");
                        appStatus = window.allData.order[0];
                        var dataNameOfItem = window.allData.order[0];
                        var tmpContainer = document.querySelector(".thumb-container");
                        var corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("playing");
                        corrospondingThumb.classList.add("playing");
                        corrospondingThumb.classList.add("played");

                        /* playAvator ( window.allData[window.allData.order[0]].avatordesktop, window.allData[window.allData.order[0]].video, "desktop" ); */

                        playAvator ({
                            "videoURL": window.allData[window.allData.order[0]].video,
                            "avatorURL": window.allData[window.allData.order[0]].avatordesktop,
                            "platform": "desktop"
                        });

                        StopWatch.reset();


                    },
                     //window.allData["timers"]["no-user-interaction"]
                     idleTime
                     );
                })
                
                initThumbs ("desktop");
                initNav ("desktop");
                blobBtnsInit ("desktop");
                endScreenInit ("desktop");
                SetState ("intro-state");
            }

            function launchMobileVersion () {
                //console.log("::::: launch MOBILE ::::::");

                skipVDOBtn.addEventListener("click",function(){
                    resetThumbNails ("selected");

                    let tmpContainer = document.querySelector(".swiper-wrapper");
                    let corrospondingThumb = tmpContainer.querySelector('[data-name~="'+appStatus+'"]');

                    // During the intro itself appStatus is "intro", which has no thumb;
                    // without this guard the handler threw here and Skip did nothing.
                    if (corrospondingThumb) {
                        corrospondingThumb.classList.add("selected");
                        corrospondingThumb.classList.add("played");
                    }

                    SetState ("topics-state");
                    skipVDOBtn.classList.add("hide");
                    
                    //document.getElementById("mobile-avator-player").pause();
                    document.getElementById("mobile-avator-player").currentTime = 150;
                    //clearTimeout (mobileINITtimer);
                    //clearTimeout (mobileautoTimer);

                    console.log("-------- mobile 2 ------------");
                    /*
                    Analytics({
                        "name":"videoSkip",
                        "item":"Skip Virtual " + window.allData.campaign + " Assistant Intro",
                    });
                    */

                    Analytics({
                        "name":"videoSkip",
                        "item":"Virtual Assistant Intro",
                        "cta": skipVDOBtn.textContent.trim(),
                        "detail": "intro"
                    });

                    
                })

                container.classList.add("mobile-init-page");
                RemoveFromDOM (".blob-container .blob-2");

                startPage.addEventListener("click",function(){
                    Analytics({
                        "name":"ctaAction",
                        "cta": startPage.querySelector(".btn-copy").textContent.trim(),
                        "detail": "intro"
                    });
                    //console.log("Meet Jessica clicked");
                    initAvatorPlayer ("mobile");
                    updateMobileAvator(window.allData["intro"].avatormobile);
                    initThumbs ("mobile");
                    initNav ("mobile");
                    initThumbDots ();
                    blobBtnsInit ("mobile");
                    endScreenInit ("mobile");
                    //startPage.classList.add('hide');
                    
                    document.getElementById("avator-container-mobile").classList.remove("hide");
                    
                    SetState ("intro-state");
                    RemoveFromDOM (".thumb-container");
                    RemoveFromDOM (".startpage");

                    const swiper = new Swiper('.swiper', {
                        loop: false,
                        slidesPerView: 3,
                        spaceBetween: 5,

                        navigation: {
                          nextEl: '.swiper-button-next',
                          prevEl: '.swiper-button-prev',
                        },
                        on: {
                            init: function () {
                                //console.log('swiper initialized');
                            },
                            click: function(event) {

                                let talentName = String(event.clickedSlide.dataset.name);

                                Analytics({
                                    "name":"ctaAction",
                                    "cta": window.allData.trackingmap[talentName],
                                    "detail": "playlist"
                                });

                                try {appStatus = window.allData[talentName].appstate;}
                                catch (Error) {console.log("appStatus Error: ",Error);}

                                try {currentVDOurl =  window.allData[talentName].video;}
                                catch (Error) {console.log("CurrentVDO URL Error: ",Error);}
                                
                                try {thumbClicked (event.clickedSlide.dataset.indexNumber);}
                                catch (Error) {console.log("ThumbClicked Error: ",Error);}

                                try {
                                    window.Player.PauseVideo();
                                    window.Player.SetState (mediaContainer,"pause-state");
                                }
                                catch (Error) {console.log("video pause error: ",Error);}

                              
                        
                                for (var i = 1; i <= window.allData.order.length; i++) {
                                    var tempThumb = document.getElementById("thumb-" + i);
                                    if ( i == event.clickedSlide.dataset.indexNumber) {
                                        tempThumb.classList.add("selected");
                                        tempThumb.classList.add("played");
                                    }
                                    else { tempThumb.classList.remove("selected"); }
                                }

                               

                                playAvator ( {
                                    "avatorURL": window.allData[event.clickedSlide.dataset.name].avatormobile, 
                                    "videoURL": window.allData[event.clickedSlide.dataset.name].video, 
                                    "platform":"mobile" 
                                });

                            }
                          }
                      });

                    document.querySelector(".swiper-button-next").addEventListener("click", function () {
                        Analytics({ "name":"ctaAction", "cta": "Next", "detail": "playlist" });
                    });
                    document.querySelector(".swiper-button-prev").addEventListener("click", function () {
                        Analytics({ "name":"ctaAction", "cta": "Previous", "detail": "playlist" });
                    });

                    // Swiper just set role="group" on the slides; make them buttons again.
                    makeButtons();


                    mobileautoTimer = setTimeout(function(){ 
                        SetState ("topics-state");
                        //console.log("open menu");

                        mobileINITtimer = setTimeout(function(){ 
                            //console.log(" :::::::::::: timer function still running :::::::::::::: ");
                            appStatus = window.allData.order[0];
                            document.querySelector("#avator-container-mobile .blob-2").classList.add("hide"); 
                            document.getElementById("mobile-avator-player").pause();
                            updatenavDots (1);
                            var tmpContainer = document.querySelector(".thumb-container");
                            SetState ("playlist-state");
                            var dataNameOfItem = window.allData.order[0];

                            try {
                                var tmpContainerMobile = document.querySelector(".swiper-wrapper");
                                var corrospondingThumbMobile = tmpContainerMobile.querySelector('[data-name~="'+dataNameOfItem+'"]');
                                corrospondingThumbMobile.classList.add("selected");
                                corrospondingThumbMobile.classList.add("played");
                            } catch (Error) {}
                            
                            /* playAvator ( window.allData[window.allData.order[0]].avatormobile, window.allData[window.allData.order[0]].video, "mobile" ); */

                            playAvator ({
                                "videoURL": window.allData[window.allData.order[0]].video,
                                "avatorURL": window.allData[window.allData.order[0]].avatormobile,
                                "platform": "mobile"
                            });

                        }, window.allData["timers"]["mobile-menu"]);
                    }, window.allData["timers"]["mobile-intro-vid"]);
                    container.classList.remove("mobile-init-page");

                    //console.log("-------- mobile 3 ------------");

                    /*
                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual" + window.allData.campaign + "Assistant",
                    });
                    */

                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual Assistant",
                    });
                    
                })


                function initThumbDots () {
                    for (var i = 1; i <= window.allData.order.length; i++) {
                        var tempDot = document.getElementById("dot-" + i);
                        tempDot.addEventListener("click",function(event){
                            Analytics({
                                "name":"ctaAction",
                                "cta": "Dot " + event.currentTarget.dataset.indexNumber,
                                "detail": "playlist-dots"
                            });
                            //console.log("dot-clicked: ",event.target.dataset.indexNumber);
                            updatenavDots (event.currentTarget.dataset.indexNumber);
                        })
                    }
                }
            }

        }


        init ();

}
