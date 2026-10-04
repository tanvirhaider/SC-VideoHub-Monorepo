/*
 * Video-Hub · Chronic Spontaneous Urticaria (CSU)
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
        "desktop-idle": 42000, // was mobile-intro-vid + mobile-menu
        //"no-user-interaction":40000,
        "mobile-intro-vid": 17000,
        "mobile-menu": 25000
    },
    "trackingmap":{
        "intro":"Sharecare Interactive",
        "coping": "Coping with the mental burdens",
        "organize": "How to avoid feeling overwhelmed",
        "meal": "building a diabetes-friendly meal",
        "self-management": "self-management program can help",
        "hives-dont-go-away": "hives-dont-go-away",
        "itch-avoid-scratching":"itch-avoid-scratching",
        "new-treatment":"new-treatment",
        "most-out-of-treatment":"most-out-of-treatment"




    },
	"intro": {
        "title":"Sharecare Interactive",
        "subtitle": "Learn more about Chronic Spontaneous Urticaria (CSU) from Jessica, your virtual Chronic Spontaneous Urticaria assistant",
        "avatormobile":"./assets/csu-videos/jessica-CSU-mobile.mp4",
        "avatordesktop":"./assets/csu-videos/jessica-CSU-desktop.mp4",
		"audio":"introduction",
        "appstate": "intro",
        "copy": `Hi, I’m Jessica, your virtual assistant for chronic spontaneous urticaria (CSU), a form of chronic hives. If you are living with CSU, one of the best things you can do is keep learning about the condition.`,
        "textduration": 14,
        "trackingmap": "intro",
	},
	"hives-dont-go-away": {
        "teaser": "<div class='copy'>What you should do if symptoms persist after treatment</div><div class='icon'></div>",
        "avatormobile":"./assets/csu-videos/jessica-CSU-hives-dont-go-mobile.mp4",
        "avatordesktop":"./assets/csu-videos/jessica-CSU-hives-dont-go-desktop.mp4",
        "video":"./assets/csu-videos/3step_1.mp4",
        "poster":"./assets/poster/poster-1.jpg",
        "thumb":"./assets/thumbnails/thumb-1.jpg",
        "audioduration": 23,
        "appstate": "hives-dont-go-away",
        "thumbCopy": "What happens when hives don't go away?",
        "copy": `Treatment for CSU usually begins with anti-itch medications called antihistamines. Sometimes, these medications are enough to clear up symptoms. Other times, symptoms continue. Here, we look at three steps to take if hives don’t go away, with a look at the different therapy options your healthcare provider might recommend.`,
        "textduration": 20,
        "trackingmap": "hives-dont-go-away"
	},
	"itch-avoid-scratching": {
        "teaser": "<div class='copy'>Coping with itching, the most frustrating symptom</div><div class='icon'></div>",
        "avatormobile":"./assets/csu-videos/jessica-CSU-how-to-cope-mobile.mp4",
        "avatordesktop":"./assets/csu-videos/jessica-CSU-how-to-cope-desktop.mp4",
        "video":"./assets/csu-videos/chronic-hives-3_1.mp4",
        "poster":"./assets/poster/poster-2.jpg",
        "thumb":"./assets/thumbnails/thumb-2.jpg",
        "audioduration": 23,
        "appstate": "itch-avoid-scratching",
        "thumbCopy": "How to cope with itch & avoid scratching",
        "copy": `Hives are frequently itchy—and sometimes intensely itchy. And although scratching can feel good, it can make symptoms worse and cause damage to your skin. In our next video, we look at strategies that can help you relieve itch—and avoid scratching—and what your healthcare providers can do to help you find relief.`,
        "textduration": 20,
        "trackingmap": "itch-avoid-scratching"
	},
	"new-treatment": {
        "teaser": "<div class='copy'>Questions to ask when starting a new treatment</div><div class='icon'></div>",
        "avatormobile":"./assets/csu-videos/jessica-CSU-new-treatment-mobile.mp4",
        "avatordesktop":"./assets/csu-videos/jessica-CSU-new-treatment-desktop.mp4",
        "video":"./assets/csu-videos/chronic-hives_1.mp4",
        "poster":"./assets/poster/poster-3.jpg",
        "thumb":"./assets/thumbnails/thumb-3.jpg",
        "audioduration": 23,
        "appstate": "new-treatment",
        "thumbCopy": "What to ask when starting a new treatment",
        "copy": `There is no cure for CSU, but there are treatments that can relieve symptoms, prevent flare ups, and improve your quality of life. Finding the right treatment can take time, and it’s common to change doses or change medications. In our next video, we look at the answers and information you need any time you are starting a new medication.`,
        "textduration": 20,
        "trackingmap": "new-treatment"
	},
	"most-out-of-treatment": {
        "teaser": "<div class='copy'>Getting the most out of your treatment plan</div><div class='icon'></div>",
        "avatormobile":"./assets/csu-videos/jessica-CSU-most-out-of-treatment-mobile.mp4",  
        "avatordesktop":"./assets/csu-videos/jessica-CSU-most-out-of-treatment-desktop.mp4",
        "video":"./assets/csu-videos/4ways_1.mp4",
        "poster":"./assets/poster/poster-4.jpg",
        "thumb":"./assets/thumbnails/thumb-4.jpg",
        "audioduration": 23,
        "appstate": "most-out-of-treatment",
        "thumbCopy": "How to get the most out of treatment",
        "copy": `Different CSU treatments work better for different people. But no matter what treatment you are using, you want to do everything you can to get the best result possible. In this video, we discuss the importance of taking medications as directed, being honest with your healthcare team, and recognizing what you need from your treatment plan.`,
        "textduration": 20,
         "trackingmap": "most-out-of-treatment"
	},
    "order": ["hives-dont-go-away","itch-avoid-scratching","new-treatment","most-out-of-treatment"],
    "outro": {
        "title":"Thank you for stopping by!</br>We hope you found something helpful.",
        "subtitle": "If you would like to watch any of</br>the videos again, simply select</br>what you would like to see."
    },
    "player":"Digital Citizen",
    "owner": "Sharecare Video Team - Atlanta",
    "campaign": "Chronic-Spontaneous-Uticaria"
};

startJessicaHub(allData, { project: "CSU" });
