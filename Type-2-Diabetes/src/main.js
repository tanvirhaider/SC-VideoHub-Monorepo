/*
 * Video-Hub · Type 2 Diabetes
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
        "desktop-idle": 40000, // was no-user-interaction
        "no-user-interaction":40000,
        "mobile-intro-vid": 17000,
        "mobile-menu": 20000
    },
    "trackingmap":{
        "intro":"Sharecare Interactive",
        "coping": "Coping with the mental burdens",
        "organize": "How to avoid feeling overwhelmed",
        "meal": "building a diabetes-friendly meal",
        "self-management": "self-management program can help"
    },
	"intro": {
        "title":"Sharecare Interactive",
        "subtitle": "Learn more about type 2 diabetes from Jessica, your virtual type 2 diabetes assistant",
        "avatormobile":"./assets/type2diabetes-videos/Diabetes-mobile-intro.mp4",
        "avatordesktop":"./assets/type2diabetes-videos/Diabetes-desktop-intro.mp4",
		"audio":"introduction",
        "appstate": "intro",
        "copy": "Hi, I’m Jessica, your virtual type 2 diabetes assistant. If you are one of the many millions of people living with type 2 diabetes, one of the best things you can do is keep learning about ways to manage the condition.",
        "textduration": 13
	},
	"coping": {
        "teaser": "<div class='copy'>Thriving with Type 2 Diabetes</div><div class='icon'></div>",
        "avatormobile":"./assets/type2diabetes-videos/Diabetes-mobile-coping-with-mental.mp4",
        "avatordesktop":"./assets/type2diabetes-videos/Diabetes-desktop-coping-with-mental.mp4",
        "video":"./assets/type2diabetes-videos/tips_1.mp4",
        "poster":"./assets/poster/thumb-tips.png",
        "thumb":"./assets/thumbnails/thumb-tips.jpg",
        "audioduration": 23,
        "appstate": "coping",
        //"thumbCopy": "Coping with the mental burdens",
        "thumbCopy": "Thriving with Type 2 Diabetes",
        "copy": "Some of the biggest challenges of living with type 2 diabetes are the mental and emotional challenges—the ways that blood sugar can affect your moods, guilt about the diagnosis, uncertainty about the future. Coping with these feelings is an important part of managing diabetes. Here are five strategies that may help.",
        "textduration": 18
	},
	"organize": {
        "teaser": "<div class='copy'>Getting Organized with Type 2 Diabetes</div><div class='icon'></div>",
        "avatormobile":"./assets/type2diabetes-videos/Diabetes-mobile-hacks.mp4",
        "avatordesktop":"./assets/type2diabetes-videos/Diabetes-desktop-hacks.mp4",
        "video":"./assets/type2diabetes-videos/hacks_1.mp4",
        "poster":"./assets/poster/thumb-hacks.png",
        "thumb":"./assets/thumbnails/thumb-hacks.jpg",
        "audioduration": 23,
        "appstate": "organize",
        //"thumbCopy": "How to avoid feeling overwhelmed",
        "thumbCopy": "Getting Organized with Type 2 Diabetes",
        "copy": "Managing type 2 diabetes requires time and energy. There are medications to take, appointments to attend, testing supplies to order, insurance paperwork and bills, and a dozen other things that need your attention. This video offers five lifestyle hacks to help you stay organized and avoid feeling overwhelmed.",
        "textduration": 17
	},
	"meal": {
        "teaser": "<div class='copy'>Simplest Methods for Diabetes-Friendly Meals</div><div class='icon'></div>",
        "avatormobile":"./assets/type2diabetes-videos/Diabetes-mobile-meal-planning.mp4",
        "avatordesktop":"./assets/type2diabetes-videos/Diabetes-desktop-meal-planning.mp4",
        "video":"./assets/type2diabetes-videos/meal_1.mp4",
        "poster":"./assets/poster/thumb-meal.png",
        "thumb":"./assets/thumbnails/thumb-meal.jpg",
        "audioduration": 23,
        "appstate": "meal",
        //"thumbCopy": "Building a diabetes-friendly meal",
        "thumbCopy": "Simplest Methods for Diabetes-Friendly Meals",
        "copy": 'While nutritional needs can vary from person to person, eating well will always be an essential part of managing diabetes. Eating well means choosing the right foods and the right portion sizes. In this video, we look at "The Plate Method," a simple strategy anyone can use to prepare a diabetes-friendly meal.',
        "textduration": 16
	},
	"self-management": {
        "teaser": "<div class='copy'>T2D Self-Management Program</div><div class='icon'></div>",
        "avatormobile":"./assets/type2diabetes-videos/Diabetes-mobile-self-management.mp4",  
        "avatordesktop":"./assets/type2diabetes-videos/Diabetes-desktop-self-management.mp4",
        "video":"./assets/type2diabetes-videos/reason_1.mp4",
        "poster":"./assets/poster/thumb-reason.png",
        "thumb":"./assets/thumbnails/thumb-reason.jpg",
        "audioduration": 23,
        "appstate": "self-management",
        //"thumbCopy": "Self-management program can help",
        "thumbCopy": "T2D Self-Management Program",
        "copy": "One of the hardest parts of managing diabetes is knowing what to do next. Fortunately, there are people who can teach you the skills you need. If you haven’t already, talk to your healthcare provider about participating in a diabetes self-management and support program. This next video offers a closer look at what these programs offer.",
        "textduration": 16
	},
    "order": ["coping","organize","meal","self-management"],
    "outro": {
        "title":"Thank you for stopping by!</br>We hope you found something helpful.",
        "subtitle": "If you would like to watch any of</br>the videos again, simply select</br>what you would like to see."
    },
    "player":"Digital Citizen",
    "owner": "Sharecare Video Team - Atlanta",
    "campaign": "T2-Diabetes"
};

startJessicaHub(allData, { project: "T2-Diabetes" });
