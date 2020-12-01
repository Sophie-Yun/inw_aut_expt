//Yiling (Sophie) Yun, credit to Isabella Forman and Yi-Chia Chen

const FORMAL = false;
const EXPERIMENT_NAME = "Inw_Aut";
const SUBJ_NUM_FILE = "subjNum_" + EXPERIMENT_NAME + ".txt";
const TRIAL_FILE = "trial_" + EXPERIMENT_NAME + ".txt";
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = "visit_" + EXPERIMENT_NAME + ".txt";
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR = FORMAL ? "data/formal":"data/testing";
const BLOCK_N = 1;
const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;
const INSTR_READING_TIME_MIN = 0.5;
const FRAME_WIDTH = 670;
const FRAME_HEIGHT = 300;
const STIM_WIDTH = 150; 
const STIM_PIC = ["AvertedGaze/CC_L2_small.png", "AvertedGaze/CC_R2_small.png", "Chair/Chair_L_small.png", "Chair/Chair_R_small.png", "Handshake/YC_L2_small.png", "Handshake/YC_R2_small.png"];
const BKG_PIC = ["Background/grassfield_adjusted.png", "Background/sea_adjusted.png"];
const STIM_DICT = {
    0: ["AvertedGaze", "left"],
    1: ["AvertedGaze", "right"],
    2: ["Chair", "left"],
    3: ["Chair", "right"],
    4: ["Handshake", "left"],
    5: ["Handshake", "right"]
}
const BKG_DICT = {
    0: "grassfield",
    1: "sea"
}
const EXPT_TRIAL = {};
var trialSize = 0;
for (var i in STIM_PIC){
    for (var j in BKG_PIC) {
        EXPT_TRIAL["trial" + trialSize] = [STIM_PIC[i], BKG_PIC[j], STIM_DICT[i], BKG_DICT[j]];
        trialSize++;
    }
}


// trial variables
var trialIndex;
var mouseTrackingClick = 0;
var newPos;
var mouseX;
var margin;
var offsetImg;
var leftBound;
var leftToEdge;
const STIM_N = 12;
const STIM_PATH = "Stimuli/";
const TRIAL_LIST = CREATE_RANDOM_REPEAT_BEGINNING_LIST(Object.keys(EXPT_TRIAL), trialSize).slice(0, trialSize).concat(CREATE_RANDOM_REPEAT_BEGINNING_LIST(Object.keys(EXPT_TRIAL), trialSize).slice(0, trialSize));
const TRIAL_N = TRIAL_LIST.length;
const STIM_LEFT = (FRAME_WIDTH - STIM_WIDTH) / 2;
var startTime;

// DATA SAVING VARIABLES
var inwBias = 0;
var inwBiasAdj = 0;

// duration variables (in seconds)
const INTERTRIAL_INTERVAL = 0.5;

// object variables
var instr, subj, trial;
/*
                                   
 #####  ######   ##   #####  #   # 
 #    # #       #  #  #    #  # #  
 #    # #####  #    # #    #   #   
 #####  #      ###### #    #   #   
 #   #  #      #    # #    #   #   
 #    # ###### #    # #####    #   
                                   
*/
$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    //subj.id = subj.getID("sonacode");
    subj.saveVisit();
    if (subj.phone) { // asking for subj.phone will detect phone
        $("#instrText").html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at experimenter@domain.edu<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        $("#instrBut").hide();
        $("#instrPage").show();
    } else if (subj.id !== null){
        instr = new instrObject(instr_options);
        instr.start();
        trial_options["subj"] = subj;
        trial = new trialObject(trial_options);
        //$('#captchaBox').show();
    }
});


/*                                            
  ####  #    # #####       # ######  ####  ##### 
 #      #    # #    #      # #      #    #   #   
  ####  #    # #####       # #####  #        #   
      # #    # #    #      # #      #        #   
 #    # #    # #    # #    # #      #    #   #   
  ####   ####  #####   ####  ######  ####    #                                                   
*/

const SUBJ_TITLES = ['num',
                     'date',
                     'startTime',
                     'id',
                     'userAgent',
                     'endTime',
                     'duration',
                     'instrQAttemptN',
                     'instrReadingTimes',
                     'quickReadingPageN',
                     'hiddenCount',
                     'hiddenDurations',
                     'daily',
                     'aqResponses',
                     'aqRt',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function INVALID_ID_FUNC() {
    $("#instrText").html("We can't identify a valid code from subject pool website. Please reopen the study from the subject pool website again. Thank you!");
    $("#instrBut").hide();
    $("#instrPage").show();
}
function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}
var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    invalidIDFunc: INVALID_ID_FUNC,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};

/*
 ### #     #  #####  ####### ######  
  #  ##    # #     #    #    #     # 
  #  # #   # #          #    #     # 
  #  #  #  #  #####     #    ######  
  #  #   # #       #    #    #   #   
  #  #    ## #     #    #    #    #  
 ### #     #  #####     #    #     # 
                                     
*/
var instr_text = new Array;
instr_text[0] = "<b>Thank you for participating in this experiment!</b><br><br>Do you like taking pictures of people or objects around you? This study is about where people prefer to place figures inside pictures!"
instr_text[1] = "Your contribution would greatly help scientists better understand people's preference in framing pictures.<br><br>More importantly, we hope this experiment is fun for you, too!"
instr_text[2] = "Please carefully read the instructions on the next few pages. You will be asked about the contents later.<br><br>Please avoid using the refresh or back buttons, as you will exit the experiment."
instr_text[3] = "To get started, please maximize your browser window."
instr_text[4] = "This study takes about 20 minutes. It has two parts.<br><br>In the first part, on each page, you will be shown a figure within a picture. Your job is to adjust the horizontal position of the figure until you think the whole picture looks <b>the most visually pleasing</b>.<br><br>In the second part, there will be a questionnaire about your preference in social interaction. <br><br>There is an example of the adjustment task on the next page."
instr_text[5] = "Follow these steps to adjust the position of the strawberry:<br>1. Click on the strawberry once. Move your cursor horizontally. The strawberry will follow your cursor.<br>2. When you find the most visually pleasing position, click again to drop the strawberry.<br></p>To further adjust the position of the strawberry, simply repeat the two steps above."
instr_text[6] = "";
instr_text[7] = "<b>Correct answer! Good job!</b><br><br>In order for us to conduct this experiment, we need to attach the consent form below.<br><br>Press SPACE to when you are ready to start the experiment."
instr_text[8] = "Great! You can press SPACE to start. Please focus after you start (Don't switch to other windows or tabs!)";

const INSTR_FUNC_DICT = {
    3: SHOW_MAXIMIZE_WINDOW,
    4: HIDE_INSTR_IMG,
    5: SHOW_PRAC_TRIAL,
    6: SHOW_INSTR_QUESTION,
    7: SHOW_CONSENT
};

function SHOW_MAXIMIZE_WINDOW() {
    $("#instrImg").attr("src", "maximize_window_black.png");
    $("#instrImg").css("display", "block");
}

function HIDE_INSTR_IMG() {
    $("#instrImg").css("display", "none");
}

function SHOW_PRAC_TRIAL() {
    $("#pracTrialBox").show();
    $("#instrText").css("margin-bottom", "40px");
    $("#instrText").show();
    $("#instrBut").hide();
}

function SHOW_INSTR_QUESTION() {
    $("#strawbPic").css("left","0px");
    $("#pracTrialBox").hide();
    $("#instrText").css("margin-bottom", "100px");
    $("#instrBut").hide();
    $("#instrQBox").show();
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $("input[name='instrQ']:checked").val();
    if (typeof instrChoice === "undefined") {
        $("#instrQWarning").text("Please answer the question. Thank you!");
    } else if (instrChoice == "most") {
        instr.next();
        $("#instrQBox").hide();
        $("#instrPage").show();
    } else if (instrChoice == "forget") {
        instr.qAttemptN['onlyQ'] += 1;
        $("#instrText").html("Don't worry. Please read the instructions again carefully.");
        $("#instrQWarning").text("");
        $("#instrBut").show();
        $("#instrQBox").hide();
        $("input[name='instrQ']:checked").prop("checked", false);
        instr.index = 1;
    } else {
        instr.qAttemptN['onlyQ'] += 1;
        $("#instrText").html("You have given an incorrect answer. Please read the instructions again carefully.");
        $("#instrQWarning").text("");
        $("#instrBut").show();
        $("#instrQBox").hide();
        $("input[name='instrQ']:checked").prop("checked", false);
        instr.index = 1;
    }
}

function SHOW_CONSENT() {
    $("#instrQBox").hide();
    $("#instrBut").hide();
    $("#consentBox").show();
    $("#instrPageScroll").show();
    $("#firstBufferSti").attr("src", STIM_PATH + EXPT_TRIAL[TRIAL_LIST[TRIAL_N - 1]][0]);
    $("#firstBufferBkg").attr("src", STIM_PATH + EXPT_TRIAL[TRIAL_LIST[TRIAL_N - 1]][1]);
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off("keyup");
            $("#instrPage").hide();
            $("#consentBox").hide();
            subj.saveAttrition();
            SHOW_BLOCK();
        }
    });
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ']
};

/*
 ####### ######  ###    #    #       
    #    #     #  #    # #   #       
    #    #     #  #   #   #  #       
    #    ######   #  #     # #       
    #    #   #    #  ####### #       
    #    #    #   #  #     # #       
    #    #     # ### #     # ####### 
                                     
*/
const TRIAL_TITLES = [
    "num",
    "date",
    "subjStartTime",
    "trialNum",
    "facingDir",
    "stimName",
    "background",
    "inView",
    "inwBias", 
    "inwBiasAdj",
    "rt"];

function SHOW_BLOCK() {
    $("#instrPage").hide();
    $("#expBut").hide();
    $("#trialPage").show();
    subj.detectVisibilityStart();
    trial.run();
}

function TRIAL_UPDATE(last, this_trial, next_trial, path) {
    trial.stimName = EXPT_TRIAL[this_trial][2][0];
    trial.facingDir = EXPT_TRIAL[this_trial][2][1];
    trial.background = EXPT_TRIAL[this_trial][3];
    
    $("#testFrame").css("background-image", "url(" + path + EXPT_TRIAL[this_trial][1]+")");
    $("#testImg").attr("src", path + EXPT_TRIAL[this_trial][0]);
    $("#testImg").css("left", STIM_LEFT + "px");
    if (!last) {
        $("#bufferImg").attr("src", path + EXPT_TRIAL[next_trial][0]);
        $("#bufferFrame").css("background-image", "url("+path + EXPT_TRIAL[next_trial][1]+")");
    }
}

function TRIAL() {
    $("#testFrame").show();
    trial.inView = CHECK_FULLY_IN_VIEW($("#testImg"));
}

function END_TRIAL() {
    $("#testFrame").hide();
    $("#expBut").hide();
    trial.end();
}

function END_EXPT() {
    $("#trialPage").hide();
    trial.save();
    $("#aqBox").css("display", "block");
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off("keyup");
            START_AQ();
        }
    });
}

var trial_options = {
    subj: 'pre-define', // assign after subj is created
    trialN: TRIAL_N,
    titles: TRIAL_TITLES,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: TRIAL_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_EXPT
}

/*
    #    ######        # #     #  #####  ####### 
   # #   #     #       # #     # #     #    #    
  #   #  #     #       # #     # #          #    
 #     # #     #       # #     #  #####     #    
 ####### #     # #     # #     #       #    #    
 #     # #     # #     # #     # #     #    #    
 #     # ######   #####   #####   #####     #    
                                                 
*/
//drag and drop example trial
function ADJUST_FIGURE(event){
    mouseTrackingClick = mouseTrackingClick + 1;
    if ((mouseTrackingClick % 2) != 0) {
        $("#instrBut").hide();
        var currPosString = $("#strawbPic").css("left");
        newPos = parseInt(currPosString, 10);
        margin = $("#strawbFrame").offset().left;
        mouseX = event.pageX - margin;
        offsetImg = mouseX - newPos;
        $("#strawbPic").bind("mousemove", stimTrackingStrawb);
    } else {
        $("#strawbPic").unbind("mousemove");
        $("#instrBut").show();
        mouseTrackingClick = 0;
    }
}

function stimTrackingStrawb(event) {
    mouseX = event.pageX - margin;
    leftBound = 285; //left side of strawberry to the left side of the frame
    leftToEdge = 385; //left side of strawberry to the right side of the frame

    if (((mouseX - offsetImg + leftToEdge ) < FRAME_WIDTH) &&
        ((mouseX - offsetImg + leftBound) > 0)) {
        newPos = mouseX - offsetImg;
    } else if (((mouseX - offsetImg + leftToEdge) >= FRAME_WIDTH)) {
        newPos = leftBound;
    } else if ((mouseX - offsetImg + leftBound) <= 0) {
        newPos = -1 * leftBound;
    }

    var newPosString = newPos + "px";
    $("#strawbPic").css("left", newPosString);
}

//drag and drop test trial
function ADJUST_TEST_FIGURE(event){
    mouseTrackingClick = mouseTrackingClick + 1;
    if ((mouseTrackingClick % 2) != 0) {
        $("#expBut").hide();
        var currPosString = $("#testImg").css("left");
        newPos = parseInt(currPosString, 10);
        margin = $("#testFrame").offset().left;
        mouseX = event.pageX - margin;
        offsetImg = mouseX - (newPos - STIM_LEFT);
        $("#testImg").bind("mousemove", stimTracking);
    } else {
        $("#testImg").unbind("mousemove");
        mouseTrackingClick = 0;
        $("#expBut").css("display","block");
        $("#expBut").show();
    }
}

function stimTracking(event) {
    mouseX = event.pageX - margin;
    leftBound = (FRAME_WIDTH - STIM_WIDTH) / 2;
    leftToEdge = FRAME_WIDTH - leftBound;

    if (((mouseX - offsetImg + leftToEdge) < FRAME_WIDTH) &&
        ((mouseX - offsetImg + leftBound) > 0)) {
        newPos = mouseX - offsetImg + STIM_LEFT;
    } else if ((mouseX - offsetImg + leftToEdge) >= FRAME_WIDTH) {
        newPos = leftBound + STIM_LEFT;
    } else if ((mouseX - offsetImg + leftBound) > 0) {
        newPos = 0;
    }
    
    var newPosString = newPos + "px";
    $("#testImg").css("left", newPosString);
    trial.inwBias = newPos - FRAME_WIDTH / 2 + STIM_WIDTH / 2;
    if(trial.facingDir == "right")
        trial.inwBiasAdj = -trial.inwBias;
    else
        trial.inwBiasAdj = trial.inwBias;
}

/*
    #     #####  
   # #   #     # 
  #   #  #     # 
 #     # #     # 
 ####### #   # # 
 #     # #    #  
 #     #  #### # 
                 
*/

function START_AQ() {
    $("#aqInstrText").hide();
    subj.aqResponses  = {};
    subj.aqRt  = {};
    subj.aqNowQ = 1;
    startTime = Date.now();
    $("#aqQ").text(AQ_QUESTION_DICT[1]);
    $("#aqContainer").css("display", "block");
    AQ_RESPONSE();
}

function AQ_RESPONSE() {
    $(".aqButton").mouseup(function(event) {
        $(".aqButton").unbind("mouseup");
        subj.aqResponses[subj.aqNowQ] = event.target.id;
        var currentTime = Date.now();
        subj.aqRt[subj.aqNowQ] = (currentTime - startTime) / 1000;
        if (subj.aqNowQ == AQ_LENGTH){
            $("#aqBox").hide();
            $("#questionsBox").show();
            subj.detectVisibilityEnd();
        } else {
            subj.aqNowQ += 1;
            $("#aqQ").text(AQ_QUESTION_DICT[subj.aqNowQ]);
            $("#aqProgress").text( Math.round(100 * subj.aqNowQ / (AQ_LENGTH+2)) );
            AQ_RESPONSE();
        }
    });
}

// AQ variables
const AQ_QUESTION_DICT = {
    1: "I prefer to do things with others rather than on my own.",
    2: "I prefer to do things the same way over and over again.",
    3: "If I try to imagine something, I find it very easy to create a picture in my mind.",
    4: "I frequently get so strongly absorbed in one thing that I lose sight of other things.",
    5: "I often notice small sounds when others do not.",
    6: "I usually notice car number plates or similar strings of information.",
    7: "Other people frequently tell me that what I've said is impolite, even though I think it is polite.",
    8: "When I'm reading a story, I can easily imagine what the characters might look like.",
    9: "I am fascinated by dates.",
    10: "In a social group, I can easily keep track of several different people's conversations.",
    11: "I find social situations easy.",
    12: "I tend to notice details that others do not.",
    13: "I would rather go to a library than to a party.",
    14: "I find making up stories easy.",
    15: "I find myself drawn more strongly to people than to things.",
    16: "I tend to have very strong interests, which I get upset about if I can't pursue.",
    17: "I enjoy social chitchat.",
    18: "When I talk, it isn't always easy for others to get a word in edgewise.",
    19: "I am fascinated by numbers.",
    20: "When I'm reading a story, I find it difficult to work out the characters' intentions.",
    21: "I don't particularly enjoy reading fiction.",
    22: "I find it hard to make new friends.",
    23: "I notice patterns in things all the time.",
    24: "I would rather go to the theater than to a museum.",
    25: "It does not upset me if my daily routine is disturbed.",
    26: "I frequently find that I don't know how to keep a conversation going.",
    27: 'I find it easy to "read between the lines" when someone is talking to me.',
    28: "I usually concentrate more on the whole picture, rather than on the small details.",
    29: "I am not very good at remembering phone numbers.",
    30: "I don't usually notice small changes in a situation or a person's appearance.",
    31: "I know how to tell if someone listening to me is getting bored.",
    32: "I find it easy to do more than one thing at once.",
    33: "When I talk on the phone, I'm not sure when it's my turn to speak.",
    34: "I enjoy doing things spontaneously.",
    35: "I am often the last to understand the point of a joke.",
    36: "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
    37: "If there is an interruption, I can switch back to what I was doing very quickly.",
    38: "I am good at social chitchat.",
    39: "People often tell me that I keep going on and on about the same thing.",
    40: "When I was young, I used to enjoy playing games involving pretending with other children.",
    41: "I like to collect information about categories of things (e.g., types of cars, birds, trains, plants, etc.).",
    42: "I find it difficult to imagine what it would be like to be someone else.",
    43: "I like to plan any activities I participate in carefully.",
    44: "I enjoy social occasions.",
    45: "I find it difficult to work out people's intentions.",
    46: "New situations make me anxious.",
    47: "I enjoy meeting new people.",
    48: "I am a good diplomat.",
    49: "I am not very good at remembering people's dates of birth.",
    50: "I find it very easy to play games with children that involve pretending."
}
const AQ_LENGTH = Object.keys(AQ_QUESTION_DICT).length;

/*
 ######  ####### ######  ######  ### ####### ####### ### #     #  #####  
 #     # #       #     # #     #  #  #       #        #  ##    # #     # 
 #     # #       #     # #     #  #  #       #        #  # #   # #       
 #     # #####   ######  ######   #  #####   #####    #  #  #  # #  #### 
 #     # #       #     # #   #    #  #       #        #  #   # # #     # 
 #     # #       #     # #    #   #  #       #        #  #    ## #     # 
 ######  ####### ######  #     # ### ####### #       ### #     #  #####  
                                                                         
*/
function SUBMIT_DEBRIEFING_Q() {
    var serAns = $("input[name='serious']:checked").val();
    var genAns = $("input[name='gender']:checked").val();
    var ageAns = $('#age').val();
    if (typeof serAns === "undefined" || typeof genAns === "undefined" || ageAns == "" || !$("#problems").val()) {
        $("#debQWarning").text("Please answer all the questions. Thank you!");
    } else if (ageAns < 18 || ageAns > 100) {
        $("#debQWarning").text("Please enter a valid response for age.");
    } else {
        subj.serious = serAns;
        subj.problems = $('#problems').val();
        subj.gender = genAns;
        subj.age = ageAns;
        var open_ended_list = [subj.problems, subj.age];        
        for (var i = 0; i < open_ended_list.length; i++) {
            open_ended_list[i] = open_ended_list[i].replace(/(?:\r\n|\r|\n)/g, '<br />');
            }
        subj.instrQAttemptN = instr.qAttemptN['onlyQ'];
        subj.instrReadingTimes = instr.readingTimes;
        subj.quickReadingPageN = subj.instrReadingTimes.filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.aqResponses = JSON.stringify(subj.aqResponses);
        subj.aqRt = JSON.stringify(subj.aqRt);
        subj.submitQ();
        $('#questionsBox').hide();
        $("#thankPage").show();
        $('html')[0].scrollIntoView(); 
    }       
}