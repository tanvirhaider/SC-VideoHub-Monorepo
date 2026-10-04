/* ::: BAYMAX Video Player :::::::: */
/* ::: version: 1.0.7-shared  ::::: */
/* ::: developer: Tanvir Haider ::: */

/*
 * Shared copy of the player that Csu, Vms and Type-2-Diabetes used to bundle
 * into their app.js, and that Wet-Amd loaded as Baymax.wf.v-0.1.js. Changes
 * from those copies:
 *   - ES module export.
 *   - LoadVideoAndPlay / LoadVideoAndPause accept a bare URL string (the older
 *     Wet-Amd API) as well as { url, poster }.
 *   - VideoTracking hooks are optional individually — pass only the
 *     percentages you need ("25%", "75%", ...).
 *   - Quartile flags reset on every new source (loadstart), not only on
 *     'ended'. Before, switching topics mid-video meant the next video never
 *     reported the milestones the previous one had already passed.
 */


export default class Video {
  constructor (data) {
    
   
    let options = {
        category: undefined,
        action: undefined,
        label: undefined,
        value: undefined,
    }
    const postDetails = document.title;
    const { category, action, label, value } = options;

    let GoogleAnalyticsDetection = false;
    if (typeof window.ga !== "undefined") { GoogleAnalyticsDetection = true; }
    else {
        //console.log("Google Analytics NOT found");
    }


    function track (data) {
        /*

        if (typeof window.ga !== "undefined") {
            let categoryStr = postDetails;
            if (typeof category === "string") { categoryStr += ` - ${category}`; }
            if (typeof data.action !== "undefined" && data.action !== null && typeof data.action !== "string") { throw new Error("track(): parameter `data.action` is not a string");}
            if (typeof data.label !== "undefined" && data.label !== null && typeof data.label !== "string") { throw new Error("track(): parameter `data.label` is not a string");}
            if (typeof data.value !== "undefined" && data.value !== null && typeof data.value !== "number") { throw new Error("track(): parameter `data.value` is not a number");}
            if (typeof data.value === "number" && (data.value < 0 || Math.floor(data.value) !== data.value)) { throw new Error( "track(): parameter `data.value` is not a non-negative integer");}
            window.ga("send", "event", categoryStr, data?.action, data?.label, data?.value);
        }
        else {
            console.log("data-action: " + data.action, "data-label: " + data.label,"data.value: " + data.value);
        }

        */

    }

    let Scope = this;
    Scope.data = data;
    let wrapper;
    let Q0 = true;
    let seconds3 = true;
    let seconds30 = true;
    let Q1 = true;
    let Q2 = true;
    let Q3 = true;
    let Q4 = true;
    let playerStyle = "video-style";
    let DEBUG2;
    let runHLS;
    let runMP4;
    let VideoPlayButton;
    let VideoPauseButton;
    let VideoMuteButton;
    let VideoUnMuteButton;
    let videoContainerWidth;
    let videoContainerHeight;
    let posterElement;
    let posterBG;
    let HLSCDN = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    let genericPlayButton = "./assets/play.svg";
    let genericPauseButton = "./assets/pause.svg";
    let genericMuteButton = "./assets/audio-on.svg";
    let genericUnMuteButton = "./assets/audio-off.svg";
    let progressBarStats = false;
    let progBar;
    let TrackingFunction0;
    let TrackingFunction3;
    let TrackingFunction25;
    let TrackingFunction50;
    let TrackingFunction75;
    let TrackingFunction100;
    let replaystats = false;
    Scope.replaystats = replaystats;
    let videoEnded = false;
    let autoplaystats = false;
    let playerVolumeStat;

    //console.log("page title: ",postDetails);

    if (data.VideoTracking) {
        TrackingFunction0 = data.VideoTracking["0%"];
        TrackingFunction3 = data.VideoTracking["3%"];
        TrackingFunction25 = data.VideoTracking["25%"];
        TrackingFunction50 = data.VideoTracking["50%"];
        TrackingFunction75 = data.VideoTracking["75%"];
        TrackingFunction100 = data.VideoTracking["100%"];
    }

    let clickOutFunction = data.clickOutFunction;
    let duration;
    let vidUnits;
    let vidParentContainer = document.getElementById(data.container);
    vidParentContainer.classList.add(playerStyle);
    vidParentContainer.classList.add("beginning-state");
    vidParentContainer.classList.add("pause-state");
    let Rvideo =  document.createElement('video');
     
    Rvideo.setAttribute('webkit-playsinline', '');
    Rvideo.setAttribute('playsinline', '');
    Rvideo.setAttribute('type', 'video/mp4');

    let vidID;
    if (data.id) {vidID = data.id;} else {vidID = "basic-player";}
    Rvideo.setAttribute('id', 'videoPlayer-' + vidID);
    vidParentContainer.appendChild(Rvideo); 
    Scope.video = Rvideo;
    Scope.playerVolumeStat = playerVolumeStat;

    if (data.wrapper) {
        wrapper = data.wrapper;
        Scope.wrapper = data.wrapper;
        if (data.maxwidth) { wrapper.classList.add("beginning-state"); }
    }
    
    if (data.progressBar) {
        progressBarStats = data.progressBar;
        if (data.progressBar == true) {
            progBar =  document.createElement('div');
            progBar.setAttribute('id', 'progress-bar-' + vidID);
            vidParentContainer.appendChild(progBar); 
            progBar.classList.add("progress-bar");
            Scope.progBar = progBar;
        }
    }

    /* :::::::: PLAY BUTTON ::::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.playbutton) {
        if (typeof data.playbutton === 'object') { VideoPlayButton = data.playbutton;}

        else if (typeof data.playbutton === 'string') {
            VideoPlayButton = Scope.MakeElements("div","video-play-button");
            vidParentContainer.appendChild(VideoPlayButton); 
            Scope.AssignBackgroundImage (VideoPlayButton, data.playbutton);
            VideoPlayButton.classList.add("default-play-buttom");
        }
    }
    else {
        VideoPlayButton = Scope.MakeElements("div","video-play-button");
        vidParentContainer.appendChild(VideoPlayButton); 
        Scope.AssignBackgroundImage (VideoPlayButton, genericPlayButton);
        VideoPlayButton.classList.add("default-play-buttom");
    }

    Scope.VideoPlayButton = VideoPlayButton;
    VideoPlayButton.addEventListener('click', function() {Scope.PlayVideo();});

    /* :::::::: PAUSE BUTTON :::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.pausebutton) {
        if (typeof data.pausebutton === 'object') { VideoPauseButton = data.pausebutton;}

        else if (typeof data.pausebutton === 'string') {
            VideoPauseButton = Scope.MakeElements("div","video-pause-button");
            vidParentContainer.appendChild(VideoPauseButton); 
            Scope.AssignBackgroundImage (VideoPauseButton, data.pausebutton);
            VideoPauseButton.classList.add("default-pause-buttom");
        }
    }
    else {
        VideoPauseButton = Scope.MakeElements("div","video-pause-button");
        vidParentContainer.appendChild(VideoPauseButton); 
        Scope.AssignBackgroundImage (VideoPauseButton, genericPauseButton);
        VideoPauseButton.classList.add("default-pause-buttom");
    }

    Scope.VideoPauseButton = VideoPauseButton;
    VideoPauseButton.addEventListener('click', function() {Scope.PauseVideo();});

    /* :::::::: MUTE BUTTON ::::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.mutebutton) {
        if (typeof data.mutebutton === 'object') { VideoMuteButton = data.mutebutton;}

        else if (typeof data.mutebutton === 'string') {
            VideoMuteButton = Scope.MakeElements("div","video-mute-button");
            vidParentContainer.appendChild(VideoMuteButton); 
            Scope.AssignBackgroundImage (VideoMuteButton, data.mutebutton);
            VideoMuteButton.classList.add("default-mute-buttom");
        }
       
    }
    else {
        VideoMuteButton = Scope.MakeElements("div","video-mute-button");
        vidParentContainer.appendChild(VideoMuteButton); 
        Scope.AssignBackgroundImage (VideoMuteButton, genericMuteButton);
        VideoMuteButton.classList.add("default-mute-buttom");
    }

    Scope.VideoMuteButton = VideoMuteButton;
    VideoMuteButton.addEventListener('click', function() {
        Scope.MuteVideo();
        vidParentContainer.classList.add("mute-state");
        vidParentContainer.classList.remove("un-mute-state");

        if (data.wrapper) {
            if (data.maxwidth) {
                wrapper.classList.add("mute-state");
                wrapper.classList.remove("un-mute-state");
            }
        }

        track ({
            "action":"video",
            "label":"muted"
        });
    });

   

    /* :::::::: UNMUTE BUTTON ::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.unmutebutton) {
        if (typeof data.unmutebutton === 'object') { VideoUnMuteButton = data.unmutebutton;}

        else if (typeof data.unmutebutton === 'string') {
            VideoUnMuteButton = Scope.MakeElements("div","video-unmute-button");
            vidParentContainer.appendChild(VideoUnMuteButton); 
            Scope.AssignBackgroundImage (VideoUnMuteButton, data.unmutebutton);
            VideoUnMuteButton.classList.add("default-un-mute-buttom");
        }
    }
    else {
        VideoUnMuteButton = Scope.MakeElements("div","video-unmute-button");
        vidParentContainer.appendChild(VideoUnMuteButton); 
        Scope.AssignBackgroundImage (VideoUnMuteButton, genericUnMuteButton);
        VideoUnMuteButton.classList.add("default-un-mute-buttom");
    }

    Scope.VideoUnMuteButton = VideoUnMuteButton;
    VideoUnMuteButton.addEventListener('click', function() {
        Scope.UnMuteVideo();
        vidParentContainer.classList.remove("mute-state");
        vidParentContainer.classList.add("un-mute-state");
    
        if (data.wrapper) {
            if (data.maxwidth) {
                wrapper.classList.remove("mute-state");
                wrapper.classList.add("un-mute-state");
            }
        }

        track ({
            "action":"video",
            "label":"unmuted"
        });

    });

    


    /* ::::::::: Autoplay settings ::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */


    if (data.autoplay) { 
        Scope.Show( Scope.VideoUnMuteButton);
        Scope.Show( Scope.VideoPauseButton);

        Scope.Hide( Scope.VideoMuteButton);
        Scope.Hide(Scope.VideoPlayButton);
        Scope.playerVolumeStat = 0;
    }
    else { 
        Scope.Hide( Scope.VideoUnMuteButton); 
        Scope.Hide( Scope.VideoPauseButton);
    }



    /* ::::::::: Mute settings :::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.muted) {
        Scope.Hide( Scope.VideoMuteButton);
        Scope.Show( Scope.VideoUnMuteButton);
    }
   

    setTimeout(function(){  settingRationWithDelay (); }, 50);

    function settingRationWithDelay () {
        var tempWidth = vidParentContainer.clientWidth;
        var tempHeight = vidParentContainer.clientHeight;

        if ((data.ratio == "square") || (data.ratio == "1:1")) {
            vidParentContainer.classList.add("video-1x1");
        }
        else if ((data.ratio == "widescreen") || (data.ratio == "16:9")) {
            vidParentContainer.classList.add("video-16x9");
        }

        else if ((data.ratio == "anamorphic") || (data.ratio == "2.4:1")) {
            vidParentContainer.classList.add("video-anamorphic");
        }

        else if (data.ratio == "custom") {vidParentContainer.classList.add("custom");}
        else {vidParentContainer.classList.add("custom");}
    }

    /* :::::::: ONLY FOR HLS :::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */
    

    if (data.hls) {
        let HLSscript = document.createElement('script');
        HLSscript.id = "HLS-script";
        HLSscript.src = HLSCDN;
        document.head.appendChild(HLSscript); 
        HLSscript.onload = function () { runHLS ();};
        HLSscript.onerror = function () { runMP4 (); }
    }

    Rvideo.addEventListener("click", function() {
        Rvideo.volume = 0;
        Rvideo.pause();
        if (data.clickOutFunction) {clickOutFunction();}
        
    });

    function settingUpEndFrame () {
        if (data.poster) {
            posterElement = Scope.MakePoster("video-end-frame", data.poster);
            posterBG = Scope.MakePosterBG(vidID, data.poster);
            Scope.posterBG = posterBG;
            var posterPlayBtn;

            if (data.posterPlayButton) {
                posterPlayBtn = Scope.MakePlayButtonOverPoster ("poster-play-button", data.posterPlayButton);
                posterElement.appendChild(posterPlayBtn);
                Scope.posterPlayBtn = posterPlayBtn;
                posterPlayBtn.addEventListener('click', function() {Scope.PlayVideo();});
            }
            else {
                posterPlayBtn = Scope.MakePlayButtonOverPoster ("poster-play-button", genericPlayButton);
                posterElement.appendChild(posterPlayBtn);
                Scope.posterPlayBtn = posterPlayBtn;
                posterPlayBtn.addEventListener('click', function() {Scope.PlayVideo();});
            }
            
            posterElement.classList.add("poster-frame");
            posterElement.appendChild(posterBG);
            vidParentContainer.appendChild(posterElement);  

            if (data.ratio != "custom") {
                posterElement.style.width = videoContainerWidth;
                posterElement.style.height = videoContainerHeight;
            }
            
            posterBG.addEventListener("click", function() {if (data.clickOutFunction) {clickOutFunction();}});

            if (data.autoplay) { posterElement.style.display = "none";}
            else { 
                if (data.poster) { Rvideo.setAttribute('poster', data.poster ); }
                Rvideo.style.display = "none";
            }
        }
    }

    //setTimeout(function(){  settingUpEndFrame (); }, 50);
    settingUpEndFrame ();        
    
    if (data.muted) { 
        Rvideo.muted = true;
        Rvideo.volume = 0;
        vidParentContainer.classList.add("mute-state");
    }
    if (data.controls) { Rvideo.controls = true;}
    if (data.autoplay) { 
        Scope.videostats = "autoplay";
        Rvideo.muted = true;
        Rvideo.setAttribute("muted","");
        Rvideo.autoplay = true;
        autoplaystats = true;
        vidParentContainer.classList.add("auto-play-state");
    
        if (data.callbackfunction) if (data.callbackfunction.onAutoPlay) { 
            if (autoplaystats) {data.callbackfunction.onAutoPlay();}
        }
    }
    if (data.preload) { Rvideo.setAttribute('preload', data.preload );}
    if (data.hls) {
        
        if (Scope.isApp()) {
            Rvideo.src = data.mp4;
            Rvideo.addEventListener('loadedmetadata', function() {if (data.autoplay) {Rvideo.play();}});
            if (data.debug) {}
        }
        else {

            runHLS = function () {
                Rvideo.src = data.hls;
                const hls = new window.Hls();
                hls.loadSource(data.hls);
                hls.attachMedia(Rvideo);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function() { if (data.autoplay) { Rvideo.play();}});
                if (data.debug) {}
            }

            runMP4 = function () {
                Rvideo.src = data.mp4;
                Rvideo.addEventListener('loadedmetadata', function() {if (data.autoplay) {Rvideo.play();}});
                if (data.debug) {}
            }
        }
    }

    else {
        Rvideo.src = data.mp4;
        Rvideo.addEventListener('loadedmetadata', function() {if (data.autoplay) {Rvideo.play();}});
        if (data.debug) {}
    }
    

    Rvideo.addEventListener('play', (event) => {

        if (Scope.videostats == "autoplay") {
            track ({
                "action":"video",
                "label":"autoplay start"
            });
        }
        else {
            track ({
                "action":"video",
                "label":"resume"
            });
        }

        
       
    });

    Rvideo.addEventListener('pause', (event) => {
        autoplaystats = false;
    
    
        if (data.debug) {}
        if (data.poster) {posterElement.style.display = "block";}
        Scope.Show( Scope.VideoPlayButton);
        Scope.Hide( Scope.VideoPauseButton);

        if (data.callbackfunction) if (data.callbackfunction.onPause) { 
            if (!videoEnded) {data.callbackfunction.onPause();}
        }
     

        Scope.SetState (vidParentContainer,"pause-state");
        if (data.wrapper) {if (data.maxwidth) Scope.SetState (wrapper,"pause-state");}

        track ({
            "action":"video",
            "label":"pause"
        });

    });

    Rvideo.addEventListener('loadedmetadata', (event) => {
      
        duration = event.target.duration;
        vidUnits = duration / 100;
        if (data.debug) {}
    });

    Rvideo.addEventListener('loadeddata', (event) => {
      if (data.debug) {}
    });

    Rvideo.addEventListener('error', (event) => {
        track ({
            "action":"video",
            "label":"media-error"
        });
    });

    Rvideo.addEventListener('ended', (event) => {
    
        replaystats = true;
        autoplaystats = false;
        Scope.replaystats = replaystats;
        Scope.videostats = "ended";

        Q0 = true;
        seconds3 = true;
        seconds30 = true;
        Q1 = true;
        Q2 = true;
        Q3 = true;
        Q4 = true;

        if (data.poster) {posterElement.style.display = "block";}
        Scope.Show( Scope.VideoPlayButton);
        Scope.Hide( Scope.VideoPauseButton);

        if (data.callbackfunction) if (data.callbackfunction.onEnd) { 
            data.callbackfunction.onEnd (event); 
        }
        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"end-state");}

        track ({
            "action":"video",
            "label":"media-complete"
        });

    });

    Rvideo.addEventListener('emptied', (event) => {});
    Rvideo.addEventListener('durationchange', (event) => {});
    Rvideo.addEventListener('canplaythrough', (event) => {});
    Rvideo.addEventListener('canplay', (event) => {});
    Rvideo.addEventListener('abort', (event) => {
        track ({
            "action":"video",
            "label":"media-error"
        });
    });
    Rvideo.addEventListener('progress', (event) => {});
    Rvideo.addEventListener('ratechange', (event) => {});
    Rvideo.addEventListener('seeking', (event) => {});
    Rvideo.addEventListener('stalled', (event) => {});
    Rvideo.addEventListener('suspend', (event) => {
        /*
        track ({
            "action":"video",
            "label":"media-suspend"
        });
        */
    });
    Rvideo.addEventListener('volumechange', (event) => {
        /*
        var currentVidVolume = Rvideo.volume;
        if (currentVidVolume == 1) {
            track ({
                "action":"video",
                "label":"unmuted"
            });
        }
        else {
            track ({
                "action":"video",
                "label":"muted"
            });
        }

        */

    });
    Rvideo.addEventListener('waiting', (event) => { 
        
        track ({
            "action":"video",
            "label":"buffering"
        });
    });
    Rvideo.addEventListener('loadstart', (event) => {
        // A new source is loading: re-arm the progress milestones.
        Q0 = true;
        seconds3 = true;
        seconds30 = true;
        Q1 = true;
        Q2 = true;
        Q3 = true;
        Q4 = true;

        track ({
            "action":"video",
            "label":"media-load"
        });
    });
    Rvideo.addEventListener('timeupdate', (event) => {

        let CurTime = event.target.currentTime;
        let CurTimeRounded = Math.round(CurTime);
        let CurPercent = CurTime / vidUnits;
        let curPerRounded = Math.round(CurPercent);

       // console.log("current time: ",CurTimeRounded);

        if ((CurTimeRounded == 3) && (seconds3 == true)) {
            //console.log("video reached 3 seconds");
            track ({
                "action":"video",
                "label":"3-seconds"
            });
            seconds3 = false;
        }

        else if ((CurTimeRounded == 30) && (seconds30 == true)) {
            track ({
                "action":"video",
                "label":"30-seconds"
            });

           // track ("video","30-seconds");
            seconds30 = false;
        }

        if (progressBarStats) {
            progBar.style.width = curPerRounded + "%";
        }

        if ((curPerRounded >= 1) && (curPerRounded < 25) && (Q0)) {
            if (data.debug) {}
            if (TrackingFunction0) {TrackingFunction0();}   
            Q0 = false;

        }
    
        if ((curPerRounded >= 25) && (curPerRounded < 50) && (Q1)) {
            if (data.debug) {}
            if (TrackingFunction25) {TrackingFunction25();}   
            Q1 = false;

            track ({
                "action":"video",
                "label":"percent-25-consumed"
            });


        }
    
        if ((curPerRounded >= 50) && (curPerRounded < 75) && (Q2)) {
            
            if (data.debug) {}
            if (TrackingFunction50) {TrackingFunction50();}   
            Q2 = false;
            if (data.callbackfunction.onMidway) {data.callbackfunction.onMidway(event);}

            track ({
                "action":"video",
                "label":"percent-50-consumed"
            });
        }
    
        if ((curPerRounded >= 75) && (curPerRounded < 90) && (Q3)) {
            if (data.debug) {}
            if (TrackingFunction75) {TrackingFunction75();}   
            Q3 = false;

            track ({
                "action":"video",
                "label":"percent-75-consumed"
            });
        }
    
        if ((curPerRounded >= 90)&& (Q4)) {
            if (data.debug) {}
            if (TrackingFunction100) {TrackingFunction100();}
            Q4 = false;
            videoEnded = true;

            track ({
                "action":"video",
                "label":"percent-90-consumed"
            });
        }
        
        if (data.debug) {}

    });

    Rvideo.addEventListener('playing', (event) => {
        if (videoEnded) {videoEnded = false;}
        if (data.debug) {}
        if (data.poster) {posterElement.style.display = "none";}
        Rvideo.style.display = "block";
        Scope.Hide( Scope.VideoPlayButton);
        Scope.Show( Scope.VideoPauseButton);
        if (data.callbackfunction) if (data.callbackfunction.onPlay) 
          { if (!autoplaystats) { data.callbackfunction.onPlay(event); }}

        Scope.SetState (vidParentContainer,"play-state");

    });

  }

  /* ::::::::::: public functions here ::::::::::::: */
  /* ::::::::::::::::::::::::::::::::::::::::::::::: */

  
    status () {
        var Scope = this;
        //console.log(Scope);
        var status = {};
        status.volume = Scope.video.volume;
        status.playing =  String(Scope.videostats);
        status.replaystats = Scope.replaystats;
        status.mute = Scope.video.muted;
        status.currentTime = Scope.video.currentTime;
        return status;
    }

    isSafari () {
        var areyouSafari = false;
        var ua = navigator.userAgent.toLowerCase(); 
        if (ua.indexOf('safari') != -1) { 
            if (ua.indexOf('chrome') > -1) { areyouSafari = false;} 
            else { areyouSafari = true; }
        }
        return areyouSafari;
    }

    isApp () {
        var returnVal = false;
        var safeFrame = window["$sf"];
        if (safeFrame != undefined) { returnVal = true;}
        return returnVal;
    }

    ToggleSoundBtnImages () {

        let MuteBtn = document.getElementById("mute-btn");
        let UnMuteBtn = document.getElementById("unmute-btn");

        if (MuteBtn.style.display == "block") {
            MuteBtn.style.display = "none";
            UnMuteBtn.style.display = "block";
        }
        else {
            MuteBtn.style.display = "block";
            UnMuteBtn.style.display = "none";
        }
      }

      ToggleSound () {
        var Scope = this;
        let currentVolume = Scope.video.volume;
        let currentVideoVolumeStats = Scope.video.muted;
        if (currentVideoVolumeStats == true) {
            Scope.video.volume = 1;
            Scope.video.muted = false;	
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onUnMute) {Scope.data.callbackfunction.onUnMute();}		
        }
        else {
            Scope.video.volume = 0;
            Scope.video.muted = true;	
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onMute) {Scope.data.callbackfunction.onMute();}
        }

        Scope.ToggleSoundBtnImages();
    }

    MuteVideo () {
        var Scope = this;
        Scope.video.volume = 0;
        Scope.video.muted = true;	
        Scope.Hide( Scope.VideoMuteButton);
        Scope.Show( Scope.VideoUnMuteButton);

        Scope.playerVolumeStat = 0;
        if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onMute) {Scope.data.callbackfunction.onMute();}

        
    }

    UnMuteVideo () {
        var Scope = this;
        Scope.video.volume = 1;
        Scope.video.muted = false;	
        Scope.Show( Scope.VideoMuteButton);
        Scope.Hide( Scope.VideoUnMuteButton);

        Scope.playerVolumeStat = 1;
        if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onUnMute) {Scope.data.callbackfunction.onUnMute();}	

    }

    PlayVideo () {
        var Scope = this;
        Scope.video.play();

        /* :::::: code to play with audio onPlay ::::: */
        Scope.video.volume = 1;
        Scope.video.muted = false;	
        Scope.Show( Scope.VideoMuteButton);
        Scope.Hide( Scope.VideoUnMuteButton);

        Scope.videostats = "playing";
        Scope.Hide( Scope.VideoPlayButton);

        if (Scope.replaystats) {
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onRePlay) {Scope.data.callbackfunction.onRePlay();}
        }

        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"play-state");}
    }

    PauseVideo () {
        var Scope = this;
        Scope.video.pause();
        Scope.videostats = "userpaused";

        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"pause-state");}
        
    }

    AutoPauseVideo () {
        var Scope = this;
        Scope.video.pause();
        Scope.videostats = "autopaused";
    }

    LoadVideo (data) {
        var Scope = this;
        Scope.video.src = data;
        Scope.video.load();
        Scope.videostats = "playing";
    }

    Unload () {
        var Scope = this;
       // Scope.video.src = data;
        Scope.video.load();
    }

    LoadVideoAndPlay (data) {
        var Scope = this;
        if (typeof data === "string") { data = { url: data }; }
        Scope.video.src = data.url;
        Scope.video.load();
        Scope.videostats = "playing";
        Scope.video.play();
        Scope.video.volume = 1;

        if (data.poster) {
            setTimeout(() => {
                console.debug("poster image: ", data.poster);
                document.getElementById("background-basic-player").style.backgroundImage = "url('"+data.poster+"')";
            }, "100")
        }
    }

    LoadVideoAndPause (data) {

        var Scope = this;
        if (typeof data === "string") { data = { url: data }; }
        Scope.video.src = data.url;
        Scope.video.load();
        Scope.videostats = "playing";
        Scope.video.volume = 0;
        
        var playPromise = Scope.video.play();
        if (playPromise !== undefined) {playPromise.then(_ => {Scope.video.pause();}).catch(error => {});}

        if (data.poster) {
            setTimeout(() => {
                console.debug("poster image: ", data.poster);
                document.getElementById("background-basic-player").style.backgroundImage = "url('"+data.poster+"')";
            }, "100")
        }
    }

    MakeElements (what,ID) {
        var Element = document.createElement(what); 
        Element.setAttribute('id',ID);
        return Element;
    }
    
    AssignBackgroundImage (object, imgLoc) {
        object.style.backgroundImage = 'url(' + imgLoc + ')';
        object.style.backgroundSize = "contain";
        object.style.backgroundPosition = "center";
        object.style.backgroundRepeat = "no-repeat";
    }

    AssignSize (object, width, height) {
        object.style.width = width;
        object.style.height = height;
    }

    MakePoster (ID, imageurl) {
        var poster = this.MakeElements("div",ID);
        poster.classList.add("poster");
        return poster;
    }

    UpdatePoster (data) {
        document.getElementById("background-basic-player").style.backgroundImage = "url('"+data+"')";
    }

    MakePosterBG (ID, imageurl) {  
        var posterBG = this.MakeElements("div","background-" + ID);
        posterBG.style.backgroundImage = 'url(' + imageurl + ')';
        posterBG.classList.add("poster-background");
        return posterBG;
    }

    MakePlayButtonOverPoster (ID, imageurl) {
        var playBtn = this.MakeElements("div",ID);
        playBtn.style.backgroundImage = 'url(' + imageurl + ')';
        playBtn.classList.add("poster-frame-playBtn");
        return playBtn;
    }

    FirePixel(x) {
        var pixel = x;
        var img = document.createElement("img");
        img.setAttribute("src", pixel);
        img.setAttribute("style", "display:none");
        document.body.appendChild(img);
        console.log("impressions pixel is firing");
    }

    Show (item) {
        try {item.classList.add("show");} catch (Error) {}
        try {item.classList.remove("hide");} catch (Error) {}
    }

    Hide (item) {
        try { item.classList.add("hide");} catch (Error) {}
        try { item.classList.remove("show");} catch (Error) {}
    }

    SetState (item,whichState) {
        var allStates = ["play-state","beginning-state","pause-state","end-state","auto-play-state","non-auto-play-state","low-power-mode"];
        for (var i = 0; i < allStates.length; i++) {
            if (allStates[i] == whichState) {item.classList.add(whichState);}
            else { item.classList.remove(allStates[i]); }
        }
    }
}


/* :::::::::::::::::::::::::::::::::::::::::::: */
/* :::::::: END OF VIDEO PLAYER CODE :::::::::: */
