

/* ::: BAYMAX Video Player :::::::: */
/* ::: version: 1.0.8  :::::::::::: */
/* ::: last updated: 9.28.2021 :::: */
/* ::: developer: Tanvir Haider ::: */

/*
 * Shared copy of Pam's js/Baymax.js. Changes: ES module export, and the
 * internal legacy `track()` no longer logs every milestone to the console
 * when Universal Analytics (window.ga) is absent — the app's own tracking
 * (and the ?debug panel) covers those events now. Progress milestones are
 * re-armed on every new source (loadstart), not only on 'ended'/clearTracking.
 */


export default class Media {
  constructor (data) {
    
    let options = {
        category: undefined,
        action: undefined,
        label: undefined,
        value: undefined,
    }
    const postDetails = document.title;
    const { category, action, label, value } = options;



    function track (data) {
        if (typeof window.ga !== "undefined") {
            let categoryStr = postDetails;
            if (typeof category === "string") { categoryStr += ` - ${category}`; }
            if (typeof data.action !== "undefined" && data.action !== null && typeof data.action !== "string") { throw new Error("track(): parameter `data.action` is not a string");}
            if (typeof data.label !== "undefined" && data.label !== null && typeof data.label !== "string") { throw new Error("track(): parameter `data.label` is not a string");}
            if (typeof data.value !== "undefined" && data.value !== null && typeof data.value !== "number") { throw new Error("track(): parameter `data.value` is not a number");}
            if (typeof data.value === "number" && (data.value < 0 || Math.floor(data.value) !== data.value)) { throw new Error( "track(): parameter `data.value` is not a non-negative integer");}
            window.ga("send", "event", categoryStr, data.action, data.label, data.value);
        }
    }

    let Scope = this;
    Scope.data = data;
    let wrapper;
    let Q0 = true;
    //let seconds3 = true;
    //let seconds30 = true;
    let Q1 = true;
    let Q2 = true;
    let Q3 = true;
    let Q4 = true;
    Scope.Q0 = Q0;
    Scope.Q1 = Q1;
    Scope.Q2 = Q2;
    Scope.Q3 = Q3;
    Scope.Q4 = Q4;

    let playerStyle;
    let DEBUG2;
    let runHLS;
    let runMP4;
    let MediaPlayButton;
    let MediaPauseButton;
    let MediaMuteButton;
    let MediaUnMuteButton;
    let videoContainerWidth;
    let videoContainerHeight;
    let posterElement;
    let posterBG;
    let HLSCDN = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    let genericPlayButton = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjEuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA0MCA0MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDAgNDA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbC1vcGFjaXR5OjAuNTtzdHJva2U6I0ZGRkZGRjt9Cgkuc3Qxe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yMCwwLjVMMjAsMC41YzEwLjgsMCwxOS41LDguNywxOS41LDE5LjVsMCwwYzAsMTAuNy04LjcsMTkuNS0xOS41LDE5LjVIMjBDOS4yLDM5LjQsMC41LDMwLjcsMC41LDIwbDAsMAoJQzAuNSw5LjIsOS4yLDAuNSwyMCwwLjV6Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0xNSwyNlYxNGwxMiw2TDE1LDI2eiIvPgo8L3N2Zz4K";
    let genericPauseButton = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMjQ1LjcgMTI0NS4zIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMjQ1LjcgMTI0NS4zOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxnIGlkPSJMYXllcl8yXzAwMDAwMTYxNjA4OTg3NjYwNDE3NTU2NDQwMDAwMDAzNDkzNDIxNzgwOTU5NTgyODY1XyI+Cgk8ZyBpZD0iTGF5ZXJfMS0yIj4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNOTguNSwzMi44Qzk4LjUsMTQuNywxMTMuMiwwLDEzMS4zLDBjMCwwLDAsMCwwLDBoMjYyLjJjMTguMSwwLDMyLjgsMTQuNywzMi44LDMyLjhjMCwwLDAsMCwwLDB2MTE3OS43CgkJCWMwLDE4LjEtMTQuNywzMi44LTMyLjgsMzIuOGwwLDBIMTMxLjNjLTE4LjEsMC0zMi44LTE0LjctMzIuOC0zMi44YzAsMCwwLDAsMCwwVjMyLjh6Ii8+CgkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTgxOS41LDMyLjhjMC0xOC4xLDE0LjYtMzIuNywzMi43LTMyLjhoMjYyLjJjMTguMSwwLDMyLjgsMTQuNywzMi44LDMyLjhjMCwwLDAsMCwwLDB2MTE3OS43CgkJCWMwLDE4LjEtMTQuNywzMi44LTMyLjgsMzIuOGMwLDAsMCwwLDAsMEg4NTIuMmMtMTguMSwwLTMyLjctMTQuNy0zMi43LTMyLjhWMzIuOHoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K";
    let genericMuteButton = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDUwLjIgMTA1MC45IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxMDUwLjIgMTA1MC45OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU+CjxnIGlkPSJMYXllcl8yXzAwMDAwMDczNjkzMTk2MDcxMzQ2NjM3NjIwMDAwMDE1ODUyNTk1MDc4MTE0MjQxNDMyXyI+Cgk8ZyBpZD0iTGF5ZXJfMS0yIj4KCQk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDIzLjQsMTU2LjRjNDguNy0zMi40LDExMy45LDIuNCwxMTMuOSw2MXY2NDEuMWMwLDU4LjUtNjUuMiw5My40LTExMy45LDYwLjlMMTgwLjYsNzU3LjdINzMuMwoJCQlDMzIuOCw3NTcuNywwLDcyNC45LDAsNjg0LjV2LTI5M2MwLTQwLjUsMzIuOC03My4yLDczLjItNzMuMmMwLDAsMCwwLDAsMGgxMDcuM0w0MjMuNCwxNTYuNHogTTQzOS42LDI2M0wyMjIuNSw0MDcuNwoJCQljLTgsNS4zLTE3LjQsOC4yLTI3LjEsOC4ySDk3LjdWNjYwaDk3LjdjOS42LDAsMTkuMSwyLjksMjcuMSw4LjJMNDM5LjYsODEzVjI2M3ogTTczMi43LDUzOGMwLjEtNTcuMy0yMi4zLTExMi4zLTYyLjMtMTUzLjMKCQkJYy05LjQtOS43LTExLTI1LTIuNS0zNS40bDMxLTM3LjdjOC42LTEwLjQsMjQtMTIsMzMuOC0yLjZjMTI2LjUsMTIxLjMsMTMwLjcsMzIyLjIsOS4zLDQ0OC43Yy0zLDMuMi02LjIsNi4zLTkuMyw5LjMKCQkJYy05LjcsOS4zLTI1LjIsNy44LTMzLjgtMi42bC0zMS0zNy43Yy04LjYtMTAuNC03LTI1LjcsMi41LTM1LjRDNzEwLjQsNjUwLjMsNzMyLjgsNTk1LjMsNzMyLjcsNTM4eiBNODMwLjcsMjIxLjkKCQkJYy04LjcsMTAuMy03LjUsMjUuNiwyLjMsMzVjMTU1LjMsMTQ5LjcsMTU5LjgsMzk2LjksMTAuMiw1NTIuMmMtMy4zLDMuNC02LjcsNi44LTEwLjIsMTAuMmMtOS43LDkuNC0xMSwyNC43LTIuMywzNWwzMS43LDM3LjIKCQkJYzguNywxMC4zLDI0LjIsMTEuNSwzNCwyLjNjOTQuNi04OSwxNTMuOC0yMTUuNCwxNTMuOC0zNTUuNlM5OTEsMjcxLjMsODk2LjQsMTgyLjNjLTkuOC05LjItMjUuMy04LTM0LDIuM0w4MzAuNywyMjEuOXoiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K";
    let genericUnMuteButton = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjQuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxMDcyLjUgMTA3MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTA3Mi41IDEwNzI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7ZmlsbDojRkZGRkZGO30KPC9zdHlsZT4KPGcgaWQ9IkxheWVyXzJfMDAwMDAwNTI4MDg1NzY3NTc3NDMwODc4ODAwMDAwMDMzMTEwNDM2OTQzMzk1MDMwMTRfIj4KCTxnIGlkPSJMYXllcl8xLTIiPgoJCTxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik01MzYuMiwyMTUuOWMwLTU4LjQtNjUuMS05My4yLTExMy43LTYwLjlMMTgwLjIsMzE2LjdINzMuMUMzMi44LDMxNi43LDAsMzQ5LjQsMCwzODkuN3YyOTIuNQoJCQljMCw0MC40LDMyLjcsNzMuMSw3My4xLDczLjFoMTA3LjFsMjQyLjMsMTYxLjVjNDguNiwzMi40LDExMy43LTIuNCwxMTMuNy02MC44VjIxNS45eiBNNjQwLjksMzkyLjdMNzg0LjIsNTM2TDY0MC45LDY3OS4zCgkJCWMtOS41LDkuNS05LjUsMjUsMCwzNC41YzAsMCwwLDAsMCwwbDM0LjUsMzQuNWM5LjUsOS41LDI0LjksOS41LDM0LjUsMGwxNDMuMy0xNDMuM2wxNDMuMywxNDMuM2M5LjUsOS41LDI0LjksOS41LDM0LjUsMAoJCQlsMzQuNS0zNC41YzkuNS05LjUsOS41LTI1LDAtMzQuNWMwLDAsMCwwLDAsMEw5MjIuMSw1MzZsMTQzLjMtMTQzLjNjOS41LTkuNSw5LjUtMjQuOSwwLTM0LjVjMCwwLDAsMCwwLDBsLTM0LjUtMzQuNQoJCQljLTkuNS05LjUtMjQuOS05LjUtMzQuNSwwYzAsMCwwLDAsMCwwTDg1My4xLDQ2Ny4xTDcwOS44LDMyMy44Yy05LjUtOS41LTI0LjktOS41LTM0LjUsMGMwLDAsMCwwLDAsMGwtMzQuNSwzNC41CgkJCUM2MzEuNCwzNjcuOCw2MzEuNCwzODMuMiw2NDAuOSwzOTIuN3oiLz4KCTwvZz4KPC9nPgo8L3N2Zz4K";
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
    let mediaEnded = false;
    let autoplaystats = false;
    let playerVolumeStat;

    if (data.mediaTracking) {
        TrackingFunction0 = data.mediaTracking["0%"];
        TrackingFunction3 = data.mediaTracking["3%"];
        TrackingFunction25 = data.mediaTracking["25%"];
        TrackingFunction50 = data.mediaTracking["50%"];
        TrackingFunction75 = data.mediaTracking["75%"];
        TrackingFunction100 = data.mediaTracking["100%"];
    }

    let clickOutFunction = data.clickOutFunction;
    let duration;
    let MediaUnits;
    let mediaParentContainer = document.getElementById(data.container);
    Scope.mediaParentContainer = mediaParentContainer;

    if (data.type == "video") {
        playerStyle = "video-style";
    }
    else {
        playerStyle = "audio-style";
    }

    mediaParentContainer.classList.add(playerStyle);
    mediaParentContainer.classList.add("beginning-state");
    mediaParentContainer.classList.add("pause-state");
    
    let RealPlayer;

    if (data.type == "audio") { 
        RealPlayer =  document.createElement('audio');
        RealPlayer.setAttribute('webkit-playsinline', '');
        RealPlayer.setAttribute('playsinline', '');
        RealPlayer.setAttribute('type', 'audio/mpeg');
    } 
    else {
        RealPlayer =  document.createElement('video');
        RealPlayer.setAttribute('webkit-playsinline', '');
        RealPlayer.setAttribute('playsinline', '');
        RealPlayer.setAttribute('type', 'video/mp4');
    }
     
       

    let mediaID;
    if (data.id) {mediaID = data.id;} else {mediaID = "basic-player";}
    RealPlayer.setAttribute('id', 'videoPlayer-' + mediaID);
    mediaParentContainer.appendChild(RealPlayer); 
    Scope.media = RealPlayer;
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
            progBar.setAttribute('id', 'progress-bar-' + mediaID);
            mediaParentContainer.appendChild(progBar); 
            progBar.classList.add("progress-bar");
            Scope.progBar = progBar;
        }
    }

    /* :::::::: PLAY BUTTON ::::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.playbutton) {
        if (typeof data.playbutton === 'object') { MediaPlayButton = data.playbutton;}

        else if (typeof data.playbutton === 'string') {
            MediaPlayButton = Scope.MakeElements("div","media-play-button");
            mediaParentContainer.appendChild(MediaPlayButton); 
            Scope.AssignBackgroundImage (MediaPlayButton, data.playbutton);
            MediaPlayButton.classList.add("default-play-buttom");
        }
    }
    else {
        MediaPlayButton = Scope.MakeElements("div","media-play-button");
        mediaParentContainer.appendChild(MediaPlayButton); 
        Scope.AssignBackgroundImage (MediaPlayButton, genericPlayButton);
        MediaPlayButton.classList.add("default-play-buttom");
    }

    Scope.mediaPlayButton = MediaPlayButton;
    MediaPlayButton.addEventListener('click', function() {Scope.PlayVideo();});

    /* :::::::: PAUSE BUTTON :::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.pausebutton) {
        if (typeof data.pausebutton === 'object') { MediaPauseButton = data.pausebutton;}

        else if (typeof data.pausebutton === 'string') {
            MediaPauseButton = Scope.MakeElements("div","media-pause-button");
            mediaParentContainer.appendChild(MediaPauseButton); 
            Scope.AssignBackgroundImage (MediaPauseButton, data.pausebutton);
            MediaPauseButton.classList.add("default-pause-buttom");
        }
    }
    else {
        MediaPauseButton = Scope.MakeElements("div","media-pause-button");
        mediaParentContainer.appendChild(MediaPauseButton); 
        Scope.AssignBackgroundImage (MediaPauseButton, genericPauseButton);
        MediaPauseButton.classList.add("default-pause-buttom");
    }

    Scope.mediaPauseButton = MediaPauseButton;
    MediaPauseButton.addEventListener('click', function() {Scope.PauseVideo();});

    /* :::::::: MUTE BUTTON ::::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.mutebutton) {
        if (typeof data.mutebutton === 'object') { MediaMuteButton = data.mutebutton;}

        else if (typeof data.mutebutton === 'string') {
            MediaMuteButton = Scope.MakeElements("div","media-mute-button");
            mediaParentContainer.appendChild(MediaMuteButton); 
            Scope.AssignBackgroundImage (MediaMuteButton, data.mutebutton);
            MediaMuteButton.classList.add("default-mute-buttom");
        }
       
    }
    else {
        MediaMuteButton = Scope.MakeElements("div","media-mute-button");
        mediaParentContainer.appendChild(MediaMuteButton); 
        Scope.AssignBackgroundImage (MediaMuteButton, genericMuteButton);
        MediaMuteButton.classList.add("default-mute-buttom");
    }

    Scope.mediaMuteButton = MediaMuteButton;
    MediaMuteButton.addEventListener('click', function() {
        Scope.MuteVideo();
        mediaParentContainer.classList.add("mute-state");
        mediaParentContainer.classList.remove("un-mute-state");

        if (data.wrapper) {
            if (data.maxwidth) {
                wrapper.classList.add("mute-state");
                wrapper.classList.remove("un-mute-state");
            }
        }

        track ({"action":"video-" + mediaID,"label":"muted"});
    });

   

    /* :::::::: UNMUTE BUTTON ::::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.unmutebutton) {
        if (typeof data.unmutebutton === 'object') { MediaUnMuteButton = data.unmutebutton;}

        else if (typeof data.unmutebutton === 'string') {
            MediaUnMuteButton = Scope.MakeElements("div","media-unmute-button");
            mediaParentContainer.appendChild(MediaUnMuteButton); 
            Scope.AssignBackgroundImage (MediaUnMuteButton, data.unmutebutton);
            MediaUnMuteButton.classList.add("default-un-mute-buttom");
        }
    }
    else {
        MediaUnMuteButton = Scope.MakeElements("div","media-unmute-button");
        mediaParentContainer.appendChild(MediaUnMuteButton); 
        Scope.AssignBackgroundImage (MediaUnMuteButton, genericUnMuteButton);
        MediaUnMuteButton.classList.add("default-un-mute-buttom");
    }

    Scope.mediaUnMuteButton = MediaUnMuteButton;
    MediaUnMuteButton.addEventListener('click', function() {
        Scope.UnMuteVideo();
        mediaParentContainer.classList.remove("mute-state");
        mediaParentContainer.classList.add("un-mute-state");
    
        if (data.wrapper) {
            if (data.maxwidth) {
                wrapper.classList.remove("mute-state");
                wrapper.classList.add("un-mute-state");
            }
        }

        track ({"action":"media-" + mediaID,"label":"unmuted"});

    });

    
    /* ::::::::: Autoplay settings ::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    Scope.Hide( Scope.mediaUnMuteButton); 
    Scope.Hide( Scope.mediaPauseButton);

    /* ::::::::: Mute settings :::::::::::::: */
    /* :::::::::::::::::::::::::::::::::::::: */

    if (data.muted) {
        Scope.Hide( Scope.mediaMuteButton);
        Scope.Show( Scope.mediaUnMuteButton);
    }
   
    if (data.type == "video") mediaParentContainer.classList.add("video-9x16");
   
       

    RealPlayer.addEventListener("click", function() {
        console.log(":::: video player clicked :::: ");
        RealPlayer.volume = 0;
      //  RealPlayer.pause();
        if (data.clickOutFunction) {clickOutFunction();}
        
    });

    function settingUpEndFrame () {

        var posterPlayBtn;


        if (data.poster) {
            posterElement = Scope.poster = Scope.MakePoster("media-end-frame", data.poster);
            //console.log("poster element: ",posterElement);
            posterBG = Scope.MakePosterBG(mediaID, data.poster);
            if (data.posterPlayButton) {
                posterPlayBtn = Scope.MakePlayButtonOverPoster ("poster-play-button", data.posterPlayButton);
                posterElement.appendChild(posterPlayBtn);
                Scope.posterPlayBtn = posterPlayBtn;
                posterPlayBtn.addEventListener('click', function() {
                    console.log("poster frame clicked :::: ");
                    Scope.PlayVideo();
                });
            }
            else {
                posterPlayBtn = Scope.MakePlayButtonOverPoster ("poster-play-button", genericPlayButton);
                posterElement.appendChild(posterPlayBtn);
                Scope.posterPlayBtn = posterPlayBtn;
                posterPlayBtn.addEventListener('click', function() {Scope.PlayVideo();});
            }
            
            posterElement.classList.add("poster-frame");
            posterElement.appendChild(posterBG);
            mediaParentContainer.appendChild(posterElement);  

            if (data.ratio != "custom") {
                posterElement.style.width = videoContainerWidth;
                posterElement.style.height = videoContainerHeight;
            }
            
            posterBG.addEventListener("click", function() {if (data.clickOutFunction) {clickOutFunction();}});

            if (data.poster) { RealPlayer.setAttribute('poster', data.poster ); }
            RealPlayer.style.display = "none";

          
        }
        else {
            MediaPlayButton.classList.add("show");
        }
    }

    settingUpEndFrame ();  

    var stopMediaInAGroup = function (whichGroup) {
        var tempContainer = document.getElementById(whichGroup);
        var videos = tempContainer.querySelectorAll('video');
        var audios = tempContainer.querySelectorAll('audio');
        for (var i = 0; i < videos.length; i++) {videos[i].pause();}
        for (var j = 0; j < audios.length; j++) {audios[j].pause();}
    };
    
    function startObserving (whichPlayer) {
    
        let boxElement = document.getElementById(whichPlayer);
        function createObserver() {
            let observer;
            let options = {
                root: null,
                rootMargin: "0px",
                threshold: buildThresholdList()	
            };
    
            observer = new IntersectionObserver(handleIntersect, options);
            observer.observe(boxElement);
        }
    
        createObserver();
    
        function buildThresholdList() {
            let thresholds = [];
            let numSteps = 100;
            for (let i=1.0; i<=numSteps; i++) {thresholds.push(i/numSteps);}
            thresholds.push(0);
            return thresholds;
        }
    
        function handleIntersect(entries, observer) {
    
            var windowHeight = window.innerHeight;
    
            var objectYpos = entries[0].boundingClientRect.y;
            var objectBottomPos = entries[0].boundingClientRect.bottom;
            var diff = (windowHeight - objectYpos);
    
            if (diff < 0) { stopMediaInAGroup (whichPlayer); }
            if (objectBottomPos < 0) { stopMediaInAGroup (whichPlayer); }
    
        }
    
    } // <-- end of startObserving

    startObserving (data.container);

    if (data.muted) { 
        RealPlayer.muted = true;
        RealPlayer.volume = 0;
        mediaParentContainer.classList.add("mute-state");
    }
    if (data.controls) { 
        RealPlayer.controls = true;
        RealPlayer.controlsList = "nodownload nofullscreen noremoteplayback noplaybackrate";
    }
    if (data.preload) { RealPlayer.setAttribute('preload', data.preload );}

    if (data.type == "audio") { RealPlayer.src = data.mp3;} else { RealPlayer.src = data.mp4; }
    
    RealPlayer.addEventListener('loadedmetadata', function() {if (data.autoplay) {RealPlayer.play();}});

    RealPlayer.addEventListener('play', (event) => {

        if (Scope.mediastats == "autoplay") { track ({ "action":"media-" + mediaID, "label":"autoplay start"});}
        else { track ({ "action":"media-" + mediaID, "label":"resume" }); }

    });

    RealPlayer.addEventListener('pause', (event) => {
        autoplaystats = false;
    
    
        if (data.poster) {posterElement.style.display = "block";}
        Scope.Show( Scope.mediaPlayButton);
        Scope.Hide( Scope.mediaPauseButton);

        if (data.callbackfunction) if (data.callbackfunction.onPause) { 
            if (!mediaEnded) {data.callbackfunction.onPause();}
        }
     

        Scope.SetState (mediaParentContainer,"pause-state");
        if (data.wrapper) {if (data.maxwidth) Scope.SetState (wrapper,"pause-state");}

        track ({ "action":"video-" + mediaID, "label":"pause" });

    });

    RealPlayer.addEventListener('loadedmetadata', (event) => {
      
        duration = event.target.duration;
        MediaUnits = duration / 100;
        if (data.debug) {}
    });

    RealPlayer.addEventListener('loadeddata', (event) => {
      if (data.debug) {}
    });

    RealPlayer.addEventListener('error', (event) => {
        track ({ "action":"video-" + mediaID, "label":"media-error" });
    });

    RealPlayer.addEventListener('ended', (event) => {
    
        replaystats = true;
        autoplaystats = false;
        Scope.replaystats = replaystats;
        Scope.mediastats = "ended";

        Scope.Q0 = true;
        //seconds3 = true;
        //seconds30 = true;
        Scope.Q1 = true;
        Scope.Q2 = true;
        Scope.Q3 = true;
        Scope.Q4 = true;

        if (data.poster) {posterElement.style.display = "block";}
        Scope.Show( Scope.mediaPlayButton);
        Scope.Hide( Scope.mediaPauseButton);

        if (data.callbackfunction) if (data.callbackfunction.onEnd) { data.callbackfunction.onEnd (); }
        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"end-state");}

        track ({ "action":"media-" + mediaID, "label":"media-complete" });

    });

    RealPlayer.addEventListener('emptied', (event) => {});
    RealPlayer.addEventListener('durationchange', (event) => {});
    RealPlayer.addEventListener('canplaythrough', (event) => {});
    RealPlayer.addEventListener('canplay', (event) => {});
    RealPlayer.addEventListener('abort', (event) => { track ({ "action":"media-" + mediaID, "label":"media-error"}); });
    RealPlayer.addEventListener('progress', (event) => {
       
    
    
    });
    RealPlayer.addEventListener('ratechange', (event) => {});
    RealPlayer.addEventListener('seeking', (event) => {});
    RealPlayer.addEventListener('stalled', (event) => {});
    RealPlayer.addEventListener('suspend', (event) => {});
    RealPlayer.addEventListener('volumechange', (event) => {});
    RealPlayer.addEventListener('waiting', (event) => { track ({ "action":"media-" + mediaID, "label":"buffering" }); });
    RealPlayer.addEventListener('loadstart', (event) => {
        // A new source is loading: re-arm the progress milestones, so a topic
        // switched mid-video still reports its own 0/25/50/75/100% events.
        Scope.clearTracking();
        track ({ "action":"media-" + mediaID, "label":"media-load" });
    });
    RealPlayer.addEventListener('timeupdate', (event) => {


        //console.log(event);
       

        let CurTime = event.target.currentTime;
        let CurTimeRounded = Math.round(CurTime);
        let CurPercent = CurTime / MediaUnits;
        let curPerRounded = Math.round(CurPercent);
        duration = event.target.duration;


        if (data.callbackfunction) if (data.callbackfunction.onProgress) { 
           {data.callbackfunction.onProgress(CurTime,duration,CurPercent);}
        }

        /*

        if ((CurTimeRounded == 3) && (seconds3 == true)) {
            track ({ "action":"media-" + mediaID, "label":"3-seconds" });
            seconds3 = false;
        }

        else if ((CurTimeRounded == 30) && (seconds30 == true)) {
            track ({ "action":"media-" + mediaID, "label":"30-seconds" });
            seconds30 = false;
        }

        */

        if (progressBarStats) {
            progBar.style.width = curPerRounded + "%";
        }

        if ((curPerRounded >= 1) && (curPerRounded < 25) && (Scope.Q0)) {
            if (data.mediaTracking) {TrackingFunction0();}   
            Scope.Q0 = false;

        }
    
        if ((curPerRounded >= 25) && (curPerRounded < 50) && (Scope.Q1)) {
            if (data.mediaTracking) {TrackingFunction25();}   
            Scope.Q1 = false;

            track ({ "action":"media-" + mediaID, "label":"percent-25-consumed" });
        }
    
        if ((curPerRounded >= 50) && (curPerRounded < 75) && (Scope.Q2)) {
            if (data.mediaTracking) {TrackingFunction50();}   
            Scope.Q2 = false;

            track ({ "action":"media-" + mediaID, "label":"percent-50-consumed"});
        }
    
        if ((curPerRounded >= 75) && (curPerRounded < 90) && (Scope.Q3)) {
            if (data.debug) {}
            if (data.mediaTracking) {TrackingFunction75();}   
            Scope.Q3 = false;

            track ({ "action":"media-" + mediaID, "label":"percent-75-consumed" });
        }
    
        if ((curPerRounded >= 90)&& (Scope.Q4)) {
            if (data.debug) {}
            if (data.mediaTracking) {TrackingFunction100();}
            Scope.Q4 = false;
            mediaEnded = true;

            track ({ "action":"media-" + mediaID, "label":"percent-90-consumed" });
        }
                
    });

    RealPlayer.addEventListener('playing', (event) => {
        if (mediaEnded) {mediaEnded = false;}
        if (data.poster) {posterElement.style.display = "none";}
        RealPlayer.style.display = "block";
        Scope.Hide( Scope.mediaPlayButton);
        Scope.Show( Scope.mediaPauseButton);

        if (data.callbackfunction) {
            if (data.callbackfunction.onPlay) { 
                try {
                    data.callbackfunction.onPlay(); 
                }
                catch (Error) {}
            }
        }

       

        var videos = document.querySelectorAll('video');
        var audios = document.querySelectorAll('audio');
        for (var i = 0; i < videos.length; i++) {if (event.target != videos[i]) {videos[i].pause();}}
        for (var i = 0; i < audios.length; i++) {if (event.target != audios[i]) {audios[i].pause();}}
        Scope.SetState (mediaParentContainer,"play-state");

    });

  }

  /* ::::::::::: public functions here ::::::::::::: */
  /* ::::::::::::::::::::::::::::::::::::::::::::::: */

  
    status () {
        var Scope = this;
        var status = {};
        status.volume = Scope.media.volume;
        status.playing =  String(Scope.mediastats);
        status.replaystats = Scope.replaystats;
        status.mute = Scope.media.muted;
        status.currentTime = Scope.media.currentTime;
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

    clearTracking () {
        var Scope = this;
        Scope.Q0 = true;
        Scope.Q1 = true;
        Scope.Q2 = true;
        Scope.Q3 = true;
        Scope.Q4 = true;
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
        let currentVolume = Scope.media.volume;
        let currentMediaVolumeStats = Scope.media.muted;
        if (currentMediaVolumeStats == true) {
            Scope.media.volume = 1;
            Scope.media.muted = false;	
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onUnMute) {Scope.data.callbackfunction.onUnMute();}		
        }
        else {
            Scope.media.volume = 0;
            Scope.media.muted = true;	
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onMute) {Scope.data.callbackfunction.onMute();}
        }

        Scope.ToggleSoundBtnImages();
    }

    MuteVideo () {
        var Scope = this;
        Scope.media.volume = 0;
        Scope.media.muted = true;	
        Scope.Hide( Scope.mediaMuteButton);
        Scope.Show( Scope.mediaUnMuteButton);

        Scope.playerVolumeStat = 0;
        if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onMute) {Scope.data.callbackfunction.onMute();}

        
    }

    UnMuteVideo () {
        var Scope = this;
        Scope.media.volume = 1;
        Scope.media.muted = false;	
        Scope.Show( Scope.mediaMuteButton);
        Scope.Hide( Scope.mediaUnMuteButton);

        Scope.playerVolumeStat = 1;
        if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onUnMute) {Scope.data.callbackfunction.onUnMute();}	

    }

    PlayVideo () {
        var Scope = this;


       // if (Scope.media.src == undefined) { Scope.media.src = currentVDOurl;}

        Scope.media.src = window.currentVDOurl;
        Scope.media.load();
        Scope.media.play();

        

       

        /* :::::: code to play with audio onPlay ::::: */
        Scope.media.volume = 1;
        Scope.media.muted = false;	
        Scope.Show( Scope.mediaMuteButton);
        Scope.Hide( Scope.mediaUnMuteButton);

        Scope.mediastats = "playing";
        Scope.Hide( Scope.mediaPlayButton);

        if (Scope.replaystats) {
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onRePlay) {Scope.data.callbackfunction.onRePlay();}
        }

        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"play-state");}
    }

    JumpVideo (whichTime) {

        var Scope = this;
        Scope.media.currentTime = whichTime;
        Scope.media.play();

        /* :::::: code to play with audio onPlay ::::: */
        Scope.media.volume = 1;
        Scope.media.muted = false;	
        Scope.Show( Scope.mediaMuteButton);
        Scope.Hide( Scope.mediaUnMuteButton);

        Scope.mediastats = "playing";
        Scope.Hide( Scope.mediaPlayButton);

        if (Scope.replaystats) {
            if (Scope.data.callbackfunction) if (Scope.data.callbackfunction.onRePlay) {Scope.data.callbackfunction.onRePlay();}
        }

        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"play-state");}

    }

    PauseVideo () {
        var Scope = this;
        Scope.media.pause();
        Scope.mediastats = "userpaused";
        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"pause-state");}
    }

    PauseVideoOnTime (whatTime) {
        var Scope = this;
        Scope.media.currentTime = whatTime;
        Scope.media.pause();
        Scope.mediastats = "userpaused";
        if (Scope.wrapper) {Scope.SetState (Scope.wrapper,"pause-state");}
    }

    AutoPauseVideo () {
        var Scope = this;
        Scope.media.pause();
        Scope.mediastats = "autopaused";
    }

    LoadPooster (data) {
        var Scope = this;
        Scope.media.poster = data;
        console.log(this);
    }

    LoadVideo (data) {
        var Scope = this;
        if (this.poster != undefined) {
            let posterBGelement = this.poster.querySelector(".poster-background");
            posterBGelement.style.backgroundImage = "url('"+ data["poster"]+"')";
        }
        
        Scope.media.src = data["url"];
        Scope.media.load();
        Scope.mediastats = "paused";

        if (data.callback) {data.callback(Scope.media);}
        Scope.SetState (Scope.mediaParentContainer,"beginning-state");

    }

    LoadAndVideo (data) {
        var Scope = this;
        if (this.poster != undefined) {
            let posterBGelement = this.poster.querySelector(".poster-background");
            posterBGelement.style.backgroundImage = "url('"+ data["poster"]+"')";
        }
        
        Scope.media.src = data["url"];
        Scope.media.load();
        this.PlayVideo();
        //Scope.play
       // Scope.mediastats = "paused";

        if (data.callback) {data.callback(Scope.media);}
    }


    LoadVideoAndPause (data) {
        var Scope = this;
        Scope.media.src = data;
        Scope.media.load();
        Scope.videostats = "playing";
        Scope.media.volume = 0;
        
        var playPromise = Scope.media.play();
        if (playPromise !== undefined) {playPromise.then(_ => {Scope.media.pause();}).catch(error => {});}
    }

    LoadMetaData (player) {
        var Scope = this;
        
        player.addEventListener('loadedmetadata', (event) => {
      
            // duration = event.target.duration;
            // MediaUnits = duration / 100;
            // if (data.debug) {}
            console.log(event.target.duration);
            let mediaDuration = event.target.duration;
            return mediaDuration;
        });
    }

    MakeElements (what,ID) {
        var Element = document.createElement(what); 
        Element.setAttribute('id',ID);
        return Element;
    }
    
    AssignBackgroundImage (object, imgLoc) {
        object.style.backgroundImage = 'url(' + imgLoc + ')';
        //object.style.backgroundSize = "contain";
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