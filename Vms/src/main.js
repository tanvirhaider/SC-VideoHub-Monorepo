/*
 * Video-Hub · Vasomotor Symptoms (VMS)
 *
 * Content data only. The app itself is the shared Jessica engine
 * (shared/js/video-hub/jessicaHub.js); tracking is shared/js/tracking.
 * Add ?debug to the URL to see every tracked event.
 */

import "iframe-resizer/js/iframeResizer.contentWindow.js";
import { startJessicaHub } from "@shared/js/video-hub/jessicaHub";

const allData = {
    "timers": {
        // Desktop: how long (ms) to wait on the intro/topic menu before
        // auto-playing the first topic.
        "desktop-idle": 51000, // was desktop-intro-vid + desktop-menu
        //"no-user-interaction":40000,
        "mobile-intro-vid": 21000,
        "mobile-menu": 26000,
        "desktop-intro-vid": 21000,
        "desktop-menu": 30000,
    },
    "trackingmap":{
        "intro":"Sharecare Interactive",
        "hot-flashes": "hot-flashes",
        "night-sweats": "night-sweats",
        "vms-impact": "vms-impact",
        "coping-with-symptoms":"coping-with-symptoms",
    },
	"intro": {
        "title":"Sharecare Interactive",
        "subtitle": `Learn more about Vasomotor Symptoms (VMS) from Jessica, your virtual Vasomotor Symptoms&nbsp;assistant`,
        "avatormobile":"./assets/vms-videos/jessica-VMS-intro-mobile.mp4",
        "avatordesktop":"./assets/vms-videos/jessica-VMS-intro-desktop.mp4",
		"audio":"introduction",
        "appstate": "intro",
        "copy": `Hi, I’m Jessica, your virtual assistant for vasomotor symptoms (VMS), including hot flashes and night sweats. If you are experiencing VMS, one of the best things you can do is keep learning about why it occurs, how it can impact your life, and how you can cope.`,
        "textduration": 18,
        "trackingmap": "intro",
	},
	"hot-flashes": {
        "teaser": "<div class='copy'>What is a hot flash, and the link between hot flashes and menopause</div><div class='icon'></div>",
        "avatormobile":"./assets/vms-videos/Jessica-VMS-hotFlashes-mobile.mp4",
        "avatordesktop":"./assets/vms-videos/jessica-VMS-hotFlashes-desktop.mp4",
        "video":"./assets/vms-videos/vms-hotflash.mp4",
        "poster":"./assets/poster/poster-1.jpg",
        "thumb":"./assets/thumbnails/thumb-1.jpg",
        "audioduration": 23,
        "appstate": "hot-flashes",
        "thumbCopy": "What exactly is a hot flash",
        "copy": `If you’ve experienced hot flashes, you know what one feels like. But what exactly is happening during a hot flash? In this video, three healthcare providers take a close look at what we do and don’t know, including what causes hot flashes and the relationship between hot flashes and menopause.`,
        "textduration": 18,
        "trackingmap": "hot-flashes"
	},
	"night-sweats": {
        "teaser": "<div class='copy'>What causes night sweats, and steps to help reduce night sweats</div><div class='icon'></div>",
        "avatormobile":"./assets/vms-videos/Jessica-VMS-night-sweat-mobile.mp4",
        "avatordesktop":"./assets/vms-videos/jessica-VMS-night-sweat-desktop.mp4",
        "video":"./assets/vms-videos/vms-nightsweat.mp4",
        "poster":"./assets/poster/poster-2.jpg",
        "thumb":"./assets/thumbnails/thumb-2.jpg",
        "audioduration": 23,
        "appstate": "night-sweats",
        "thumbCopy": "Steps to help reduce night sweats",
        "copy": `Night sweats are one of the most common symptoms people experience during menopausal transition—and also one of the most frustrating. Here, three healthcare providers explain what’s happening in the body during a night sweat, and what to do when night sweats interfere with your sleep.`,
        "textduration": 17,
        "trackingmap": "night-sweats"
	},
	"vms-impact": {
        "teaser": "<div class='copy'>VMS symptoms and their impact</div><div class='icon'></div>",
        "avatormobile":"./assets/vms-videos/Jessica-VMS-impact-mobile.mp4",
        "avatordesktop":"./assets/vms-videos/jessica-VMS-Impact-desktop.mp4",
        "video":"./assets/vms-videos/vms-impact.mp4",
        "poster":"./assets/poster/poster-3.jpg",
        "thumb":"./assets/thumbnails/thumb-3.jpg",
        "audioduration": 23,
        "appstate": "vms-impact",
        "thumbCopy": "VMS symptoms and their impact",
        "copy": `If you find that VMS symptoms interfere with your life, know that you are not alone. In this conversation led by LaKeischa McMillan, MD, people experiencing VMS speak honestly about the uncomfortable symptoms, the frequent disruptions to sleep, and how VMS can change the way you feel about yourself.`,
        "textduration": 19,
        "trackingmap": "vms-impact"
	},
	"coping-with-symptoms": {
        "teaser": "<div class='copy'>How VMS can be a different experience for different people</div><div class='icon'></div>",
        "avatormobile":"./assets/vms-videos/Jessica-VMS-coping-mobile.mp4",  
        "avatordesktop":"./assets/vms-videos/jessica-VMS-coping-desktop.mp4",
        "video":"./assets/vms-videos/vms-coping.mp4",
        "poster":"./assets/poster/poster-4.jpg",
        "thumb":"./assets/thumbnails/thumb-4.jpg",
        "audioduration": 23,
        "appstate": "coping-with-symptoms",
        "thumbCopy": "How VMS can be a different experience for different people",
        "copy": `Sometimes, making changes to the foods you eat or the things you do may improve VMS symptoms—but not always. In this conversation led by LaKeischa McMillan, MD, patients describe their different approaches for coping with VMS, and show that VMS can be a different experience for different people.`,
        "textduration": 18,
         "trackingmap": "coping-with-symptoms"
	},
    "order": ["hot-flashes","night-sweats","vms-impact","coping-with-symptoms"],
    "outro": {
        "title":"Thank you for stopping by!</br>We hope you found something helpful.",
        "subtitle": "If you would like to watch any of</br>the videos again, simply select</br>what you would like to see."
    },
    "player":"Digital Citizen",
    "owner": "Sharecare Video Team - Atlanta",
    "campaign": "VMS"
};

startJessicaHub(allData, { project: "VMS" });
