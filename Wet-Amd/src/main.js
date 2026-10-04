/*
 * Video-Hub · Wet Age-related Macular Degeneration
 *
 * Tracking: every interaction calls Analytics(), which forwards to the
 * shared Tracker (shared/js/tracking). Add ?debug to the URL to see events.
 */

import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "swiper/css/bundle";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Swiper from "swiper/bundle";
import Video from "@shared/js/player/BaymaxVideo";
import { createTracker } from "@shared/js/tracking";
import { trackPlayerControls } from "@shared/js/tracking/playerControls";
import { makeButtons } from "@shared/js/a11y/makeButtons";
import { titleVideosForMatomo } from "@shared/js/tracking/mediaTitles";

gsap.registerPlugin(TextPlugin);

		


        /*
       
        */
        
       

       

        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */
        /* :::::::::::::::: global variables :::::::::::::::: */
        /* :::::::::::::::::::::::::::::::::::::::::::::::::: */

        window.VERSION = 1.2;
        console.log(window.VERSION);
        
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

        var isMobile;

        if (window.innerWidth < 601) {isMobile = true;} else {isMobile = false;}

		window.currentIndex = 0;
        var playNext = "";
        var tween1;
        var tween2;
        var tween3;
        var tween4;
        window.AutoProceed;
        let introWaitTimer;



        window.allData = {
            "trackingmap":{
                "intro":"Sharecare Interactive",
                "understanding": "Understanding Wet AMD",
                "therapy": "What is Anti-VEGF Therapy?",
                "lifestyle": "What Lifestyle Changes Can Help with Wet AMD?",
                "discuss": "3 Things to Discuss with Your Eye Doctor"
            },
			"intro": {
                "title":"Sharecare Interactive",
                "subtitle": "Learn more about Wet Age-related Macular Degeneration from Jessica, your virtual wet AMD assistant",
                "avatormobile":"./assets/AMD-videos/AMD-mobile-intro.mp4",
                "avatordesktop":"./assets/AMD-videos/AMD-desktop-intro.mp4",
				"audio":"introduction",
                "appstate": "intro",
                "copy": "Hi, I'm Jessica, your virtual wet AMD assistant. If you are living with wet age-related macular degeneration, one of the best things you can do is keep learning more about the condition.",
                "textduration": 12
			},
			"understanding": {
                "teaser": "<div class='copy'>Understanding Wet AMD</div><div class='icon'></div>",
                "avatormobile":"./assets/AMD-videos/AMD-mobile-understanding.mp4",
                "avatordesktop":"./assets/AMD-videos/AMD-desktop-understanding.mp4",
                "video":"./assets/AMD-videos/AMD-understanding.mp4",
                "thumb":"./assets/thumbnails/tmb-1.jpg",
                "appstate": "understanding",
                "thumbCopy": "Understanding Wet AMD",
                "copy": "UNDERSTANDING WET AMD</br>Age-related macular degeneration is one of the leading causes of severe vision loss among older Americans. In this video, we look at what’s happening in the eye when a person has wet AMD, an advanced form of the disease that can cause rapid vision loss.",
                "textduration": 19
			},
			"therapy": {
                "teaser": "<div class='copy'>What is Anti-VEGF Therapy?</div><div class='icon'></div>",
                "avatormobile":"./assets/AMD-videos/AMD-mobile-therapy.mp4",
                "avatordesktop":"./assets/AMD-videos/AMD-desktop-therapy.mp4",
                "video":"./assets/AMD-videos/AMD-therapy.mp4",
                "thumb":"./assets/thumbnails/tmb-2.jpg",
                "appstate": "therapy",
                "thumbCopy": "What is Anti-VEGF Therapy?",
                "copy": "WHAT IS ANTI-VEGF THERAPY?<br>The preferred treatment for wet AMD is anti-VEGF therapy. This treatment can stabilize vision, and some people even see their vision improve. Anti-VEGF therapy involves a simple and painless procedure, but it can be a little intimidating. Learn what to expect in this video.",
                "textduration": 21
			},
			"lifestyle": {
                "teaser": "<div class='copy'>What Lifestyle Changes Can Help with Wet AMD?</div><div class='icon'></div>",
                "avatormobile":"./assets/AMD-videos/AMD-mobile-lifestyle.mp4",
                "avatordesktop":"./assets/AMD-videos/AMD-desktop-lifestyle.mp4",
                "video":"./assets/AMD-videos/AMD-lifestyle.mp4",
                "thumb":"./assets/thumbnails/tmb-3.jpg",
                "appstate": "lifestyle",
                "thumbCopy": "What Lifestyle Changes Can Help with Wet AMD?",
                "copy": "WHAT LIFESTYLE CHANGES CAN HELP WITH WET AMD?<br>If you have AMD, you want to do everything you can to protect your vision and slow the progression of the disease. In this video, we look at four strategies that may help prevent AMD from getting worse.",
                "textduration": 15
			},
			"discuss": {
                "teaser": "<div class='copy'>3 Things to Discuss with Your Eye Doctor</div><div class='icon'></div>",
                "avatormobile":"./assets/AMD-videos/AMD-mobile-discuss.mp4",  
                "avatordesktop":"./assets/AMD-videos/AMD-desktop-discuss.mp4",
                "video":"./assets/AMD-videos/AMD-3-things-to-discuss.mp4",
                "thumb":"./assets/thumbnails/tmb-4.jpg",
                "appstate": "discuss",
                "thumbCopy": "3 Things to Discuss with Your Eye Doctor",
                "copy": "3 THINGS TO DISCUSS WITH YOUR EYE DOCTOR<br>Age-related macular degeneration is a disease that can affect every aspect of a person’s life. Here are three key topics to discuss at your next appointment to help you and your healthcare provider better understand what you need from treatment.",
                "textduration": 16
			},
            "order": ["understanding","therapy","lifestyle","discuss"],
            "outro": {
                "title":"Thank you for stopping by!</br>We hope you found something helpful.",
                "subtitle": "If you would like to watch any of</br>the videos again, simply select</br>what you would like to see."
            },
            "player":"Digital Citizen",
            "owner": "Sharecare Video Team - Atlanta",
            "campaign": "Wet Age-Related Macular Degeneration"
		}


        const tracker = createTracker({
            project: "Wet-AMD",
            context: {
                videoTopic: window.allData.campaign,
                videoOwner: window.allData.owner,
                videoPlayer: window.allData.player,
            },
        });
        
        
        
        
        
        

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

        function playAvator (avatorVDO, whichVDO, whichPlatform) {
            currentVDOurl = whichVDO;
            if (whichPlatform == "desktop") {updateDesktopAvator (avatorVDO);}
            else {updateMobileAvator (avatorVDO);}
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

                       
                        playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, "desktop" );

                        console.log("---------- i don't know ------- ");
                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });
                        
                        /*
                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual " + window.allData.campaign + " Assistant"
                        });
                        */
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

                        playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, "mobile" );
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

                    
                    console.log("-------- both 12 ------------");
                    Analytics({
                        "name":"videoPause",
                        "item":"Virtual Assistant",
                        "cta": pauseJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    /*
                    Analytics({
                        "name":"videoPause",
                        "item":"Pause Virtual " + window.allData.campaign + " Assistant"
                    });
                    */
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

                        playAvator ( window.allData[window.allData.order[0]].avatordesktop, window.allData[window.allData.order[0]].video, "desktop" );
                    }

                    
                    console.log("-------- both 11 ------------");
                    Analytics({
                        "name":"videoResume",
                        "item":"Virtual Assistant",
                        "cta": resumeJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    //console.log("-------- both 11 ------------");
                    /*
                    Analytics({
                        "name":"videoStart",
                        "item":"Resume Virtual " + window.allData.campaign + " Assistant"
                    });
                    */


                })


    
                hideJessicaNav.addEventListener("click",function(){
                    console.log("-------- hide jessica BTN");
                    container.classList.remove("pause-jessica");
                    container.classList.remove("resume-jessica");
                    container.classList.add("hide-jessica");
                    container.classList.remove("show-jessica");
                    container.classList.remove("buffering");
                    container.classList.remove("just-talking");


                    let playerStats = window.Player.status();
                    console.log("player status: ",playerStats);

                    if (playerStats.currentTime > 0) {
                        window.Player.PlayVideo();
                    }
                    else {
                        if (!container.classList.contains("playing-state")) {
                            try { window.Player.LoadVideoAndPlay (window.allData[appStatus].video); } catch (Error) {}
                        }
                    }
                   
                    try {desktopAvatorPlayer.pause();} catch(Error) {}
                    //blobTextControl2({"action":"pause"});
                    controlTextTimeline("pause");


                 


                    
                    //console.log("-------- both 10 ------------");
                    Analytics({
                        "name":"videoHide",
                        "item":"Virtual Assistant",
                        "cta": hideJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    //console.log("-------- both 10 ------------");
                    /*
                        Analytics({
                        "name":"videoHide",
                        "item":"Hide Virtual " + window.allData.campaign + " Assistant"
                    });
                    */


                    
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
                    Analytics({
                        "name":"videoShow",
                        "item":"Virtual Assistant",
                        "cta": showJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    //console.log("-------- both 9 ------------");
                    /*
                    Analytics({
                        "name":"videoShow",
                        "item":"Show Virtual " + window.allData.campaign + " Assistant"
                    });
                    */
                  
                    
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

                    console.log("-------- both 8 ------------");
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


                    
                    console.log("-------- both 8 ------------");
                    Analytics({
                        "name":"videoPause",
                        "item":"Virtual Assistant",
                        "cta": pauseJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    /*
                    Analytics({
                        "name":"videoPause",
                        "item":"Pause Virtual " + window.allData.campaign + " Assistant"
                    });
                    */


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
                    Analytics({
                        "name":"videoResume",
                        "item":"Virtual Assistant",
                        "cta": resumeJessicaNav.textContent.trim(),
                        "detail": "nav"
                    });
                    

                    /*
                    Analytics({
                        "name":"videoResume",
                        "item":"Resume Virtual " + window.allData.campaign + " Assistant"
                    });
                    */


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

                    window.Player.LoadVideoAndPause(currentVDOurl);
					window.Player.PauseVideo();
                    window.Player.SetState (mediaContainer,"pause-state");	

                    if (platform == "desktop") { 
                        container.classList.add("show-jessica");
                        playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, "desktop" );
                        
                    }
                    else { playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, "mobile" ); }


                    
                    console.log("-------- both 6 ------------");
                    Analytics({
                        "name":"videoStart",
                        "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                    });
                    

                    /*
                    Analytics({
                        "name":"videoStart",
                        "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                    });
                    */

				
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
            poster: "./assets/poster-clear.png", 
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
                    console.log("pause clicked");

                    /*
                    Analytics({
                        "name":"videoPause",
                        "item":"Pause Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoPause",
                       // "item":"Virtual Assistant"
                        "item": window.allData.trackingmap[appStatus]
                    });

                },
				onMute: function(){
                    console.log("mute clicked");

                    /*
                    Analytics({
                        "name":"videoMute",
                        "item":"Mute Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

                    Analytics({
                        "name":"videoMute",
                        "item":"Virtual Assistant"
                    });

                },
				onUnMute: function(){
                    console.log("un-mute clicked");

                    /*
                    Analytics({
                        "name":"videoUnMute",
                        "item":"UnMute Virtual " + window.allData.campaign + " Assistant"
                    });
                    */

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

                        /*
                        console.log("-------- both 3 ------------");
                        Analytics({
                            "name":"videoComplete",
                            "item": appStatus
                        });
                        */

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
					else if (howMany === 4) {
                        //console.log(" ---------- TADA ---------");
                        SetState("end-state");
                        resetThumbNails ("playing");
                        resetThumbNails ("played");
                        container.classList.remove("hide-jessica");
                        container.classList.remove("buffering");
                        container.classList.add("show-jessica");

                        for (var i = 1; i <= 4; i++) {
                            try {
                                var tempDot = document.getElementById("dot-" + i);
                                container.classList.remove("dot-selected-" + i); 
                                tempDot.classList.remove("active");
                            } 
                            catch(Error) {}
                        }

                        
                        //console.log("-------- both 2 ------------");

                        Analytics({
                            "name":"videoComplete",
                            "item": "Virtual Assistant"
                        });
                        

                        /*
                        Analytics({
                            "name":"videoComplete",
                            "item": "Virtual " + window.allData.campaign + " Assistant"
                        });
                        */

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
                        playAvator ( window.allData[tempItem.dataset.name].avatordesktop, window.allData[tempItem.dataset.name].video, "desktop" ); 
                    }
                    else { 
                        resetThumbNails ("selected");
                        tempItem.classList.add("selected");
                        playAvator ( window.allData[tempItem.dataset.name].avatormobile, window.allData[tempItem.dataset.name].video, "mobile" ); 
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

                        playAvator ( window.allData[event.currentTarget.dataset.name].avatordesktop, window.allData[event.currentTarget.dataset.name].video, platform ); 

                        
                        console.log("-------- both 1 ------------");
                        Analytics({
                            "name":"videoStart",
                            "item": window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });
                        

                        /*
                        Analytics({
                            "name":"videoStart",
                            "item":window.allData.trackingmap[event.currentTarget.dataset.name] + " Virtual Assistant"
                        });
                        */

                    }
                    else { 

                        tmpContainer = document.querySelector(".swiper-wrapper");
                        corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("selected");

                        corrospondingThumb.classList.add("selected");
                        corrospondingThumb.classList.add("played");

                        playAvator ( window.allData[event.currentTarget.dataset.name].avatormobile, window.allData[event.currentTarget.dataset.name].video, platform ); 
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
            
            });
            avatorPlayer.addEventListener('ended', (event) => {

                window.avatorStat = "ended";

                //console.log("avator ended",appStatus);
                container.classList.remove("talking");
                container.classList.remove("just-talking");
                skipVDOBtn.classList.add("hide");
                if (appStatus == "intro") {} else { 
                    try { window.Player.LoadVideoAndPlay (window.allData[appStatus].video); } catch (Error) {}
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

                
                console.log("-------- mobile 1 ------------");
                Analytics({
                    "name":"videoStart",
                    "item":window.allData.trackingmap[appStatus] + " " + "Virtual Assistant"
                });
                

                /*
                Analytics({
                    "name":"videoStart",
                    "item":window.allData.trackingmap[appStatus] + " " + "Virtual " + window.allData.campaign +  " Assistant"
                });
                */
            }

        }

        function updateDesktopAvator (whichVDO) {
            //console.log("::::: DESKTOP VIDEO SELECTED::::: ", whichVDO);
            document.getElementById("avator-container-desktop").classList.remove("hide");
            desktopAvatorPlayer.src = whichVDO;
            desktopAvatorPlayer.load();
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
                    Analytics({
                        "name":"ctaAction",
                        "cta": startPage.querySelector(".btn-copy").textContent.trim(),
                        "detail": "intro"
                    });

                    
                    console.log("-------- desktop 1 ------------");

                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual Assistant",
                    });
                    

                    /*
                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual " + window.allData.campaign + " Assistant",
                    });
                    */

                    startPage.classList.add('hide');
                    initAvatorPlayer("desktop");
                    updateDesktopAvator(window.allData["intro"].avatordesktop);

                    StopWatch.start(35);

                    introWaitTimer = setTimeout(function(){
                        SetState ("playlist-state");
                        appStatus = window.allData.order[0];
                        var dataNameOfItem = window.allData.order[0];
                        var tmpContainer = document.querySelector(".thumb-container");
                        var corrospondingThumb = tmpContainer.querySelector('[data-name~="'+dataNameOfItem+'"]');
                        resetThumbNails ("playing");
                        corrospondingThumb.classList.add("playing");
                        corrospondingThumb.classList.add("played");

                        playAvator ( window.allData[window.allData.order[0]].avatordesktop, window.allData[window.allData.order[0]].video, "desktop" );

                        StopWatch.reset();


                    }, 35000);
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
                    console.log("skip intro mobile clicked");


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
                    
                   // document.getElementById("mobile-avator-player").pause();
                    document.getElementById("mobile-avator-player").currentTime = 100;
                    //clearTimeout (mobileINITtimer);
                    //clearTimeout (mobileautoTimer);

                    
                    //console.log("-------- mobile 2 ------------");

                    Analytics({
                        "name":"videoSkip",
                        "item":"Virtual Assistant Intro",
                        "cta": skipVDOBtn.textContent.trim(),
                        "detail": "intro"
                    });
                    

                    /*
                    Analytics({
                        "name":"videoSkip",
                        "item":"Skip Virtual " + window.allData.campaign + " Assistant Intro",
                    });
                    */

                    
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
                                Analytics({
                                    "name":"ctaAction",
                                    "cta": window.allData.trackingmap[event.clickedSlide.dataset.name],
                                    "detail": "playlist"
                                });
                                appStatus = window.allData[event.clickedSlide.dataset.name].appstate;
                                currentVDOurl =  window.allData[event.clickedSlide.dataset.name].video;
                                thumbClicked (event.clickedSlide.dataset.indexNumber);
                                window.Player.PauseVideo();
                                window.Player.SetState (mediaContainer,"pause-state");

                                for (var i = 1; i <= 4; i++) {
                                    var tempThumb = document.getElementById("thumb-" + i);
                                    if ( i == event.clickedSlide.dataset.indexNumber) {
                                        tempThumb.classList.add("selected");
                                        tempThumb.classList.add("played");
                                    }
                                    else { tempThumb.classList.remove("selected"); }
                                }

                                playAvator ( 
                                    window.allData[event.clickedSlide.dataset.name].avatormobile, 
                                    window.allData[event.clickedSlide.dataset.name].video, 
                                    "mobile" 
                                );
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
                            
                            playAvator ( window.allData[window.allData.order[0]].avatormobile, window.allData[window.allData.order[0]].video, "mobile" ); 

                        }, 20000);
                    }, 17000);
                    container.classList.remove("mobile-init-page");

                    
                    console.log("-------- mobile 3 ------------");
                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual Assistant",
                    });
                    
                    /*
                    Analytics({
                        "name":"videoStart",
                        "item":"Virtual" + window.allData.campaign + "Assistant",
                    });
                    */
                    
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
