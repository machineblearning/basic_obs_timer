// Default config options
var START_TIME = 60*3 // default 3 minutes
var AUDIO_FILE = "alarm.mp3" // default sound
var VOLUME_LVL = 10 // default volume level
var HIDE_LIGHT = false;

// Overwrite config options if config.js file is present
if (typeof(conf) !== "undefined") {
    START_TIME = conf.minutes*60 + conf.seconds;
    AUDIO_FILE = conf.audio_filename;
    VOLUME_LVL = conf.volume;
    // optional fields
    if (conf.hideLight !== "undefined"){ HIDE_LIGHT = conf.hideLight; }
}

// Get html element references
var clock = document.getElementById("timer");
var button = document.getElementById("button");

// Set state variables
var time = START_TIME;
var running = false;
var paused = false;
var audio = new Audio(AUDIO_FILE);
audio.volume = VOLUME_LVL/10;
var task_id = null;

// Define time formatting functions
const zero_pad = (num, places) => String(num).padStart(places, '0');

const format_time = (t_sec) => {
    var min = Math.floor(t_sec/60);
    var sec = t_sec - min * 60;
    var time_str = `${zero_pad(min, 2)}:${zero_pad(sec, 2)}`;
    return time_str;
}

// Init clock time
clock.innerHTML = format_time(START_TIME);

// Define timer control functions

function start_timer() {
    clock.innerHTML = format_time(START_TIME);
    button.style.background='red';
    time = START_TIME;
    task_id = setInterval(() => {
        if (!paused){
            time -= 1;
            clock.innerHTML = format_time(time);
            if (time == 0) { // if timer is complete
                audio.play();
                clearInterval(task_id);
                if(HIDE_LIGHT){ button.style.opacity = 1; }
            }
        }

    }, 1000);
    running = true;
    if(HIDE_LIGHT){ button.style.opacity = 0; }
}

function reset_timer() {
    running = false;
    clearInterval(task_id);
    time = START_TIME;
    clock.innerHTML = format_time(START_TIME);
    button.style.background='green';
    if(HIDE_LIGHT){ button.style.opacity = 1; }
}

function start_restart_toggle() {
    if (running) {
        reset_timer();
    } else {
        start_timer();
    }
}

function pause_resume_toggle(){
    paused = !paused;
    
    if (paused){ // grey out timer text
        clock.style.color = "grey";
    } else { // undo greying out of text
        clock.style.color = "white";
    }
}