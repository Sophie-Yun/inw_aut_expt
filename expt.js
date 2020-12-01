// Yi-Chia Chen
/*
                                                 
  ####  #    # #####       # ######  ####  ##### 
 #      #    # #    #      # #      #    #   #   
  ####  #    # #####       # #####  #        #   
      # #    # #    #      # #      #        #   
 #    # #    # #    # #    # #      #    #   #   
  ####   ####  #####   ####  ######  ####    #   
                                                 
*/
class subjObject {
    constructor(options = {}) {
        Object.assign(this, {
            num: "pre-post",
            subjNumScript: "subjNum.php",
            subjNumFile: "",
            titles: [""],
            invalidIDFunc: false,
            validIDFunc: false, //not sure the use of it, no input function
            viewportMinW: 0,
            viewportMinH: 0,
            savingScript: "save.php",
            attritionFile: "attrition.txt",
            visitFile: "visit.txt",
            subjFile: "subj.txt",
            savingDir: "data/testing",
            handleVisibilityChange: function(){},
        }, options);
        if (this.num == "pre-post") {
            this.obtainSubjNum(this.subjNumScript, this.subjNumFile);
        }
        this.data = LIST_TO_FORMATTED_STRING(this.titles);
        this.dateObj = new Date();
        this.date = FORMAT_DATE(this.dateObj, "UTC", "-", true);
        this.startTime = FORMAT_TIME(this.dateObj, "UTC", ":", true);
        this.userAgent = window.navigator.userAgent;
        this.hiddenCount = 0;
        this.hiddenDurations = [];
    }

    obtainSubjNum(subjNumScript, subjNumFile) {
        var that = this;
        function SUBJ_NUM_UPDATE_SUCCEEDED(number) {
            that.num = number;
        }
        function SUBJ_NUM_UPDATE_FAILED() {
            that.num = -999;
        }
        POST_DATA(subjNumScript, { 'directory_path': this.savingDir, 'file_name': this.subjNumFile }, SUBJ_NUM_UPDATE_SUCCEEDED, SUBJ_NUM_UPDATE_FAILED);
    }

    saveVisit() {
        var data = "subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n";
        this.viewport = this.viewportSize;
        this.inView = this.viewport["inView"];
        this.viewportW = this.viewport["w"];
        this.viewportH = this.viewport["h"];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            "directory_path": this.savingDir,
            "file_name": this.visitFile,
            "data": data
        };
        $.ajax({
            type: "POST",
            url: this.savingScript,
            data: postData,
        });
    }

    getID(get_variable) {
        var id = GET_PARAMETERS(get_variable, null);
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            if (this.invalidIDFunc !== false) {
                this.invalidIDFunc();
            }
            return null;
        } else {
            
            if (this.validIDFunc !== false) {
                this.validIDFunc();
            }
            return id;
        }
    }

    checkID(id) {
        var invalid_id = (id == null);
        if (!invalid_id) {
            id = id.replace(/\s+/g, '');
            invalid_id = (id == '');
        }
        if (invalid_id) {
            return null;
        } else {
            return id;
        }
    }

    get phone() { // getter runs when you ask for the property
        var md = new MobileDetect(this.userAgent);
        return md.mobile() ? true : false;
    }

    get viewportSize() {
        var w = $(window).width();
        var h = $(window).height();
        var inView = (w >= this.viewportMinW) && (h >= this.viewportMinH);
        return { "h": h, "w": w, "inView": inView };
    }

    saveAttrition() {
        var data = 'subjNum\tstartDate\tstartTime\tid\tuserAgent\tinView\tviewportW\tviewportH\n';
        this.viewport = this.viewportSize;
        this.inView = this.viewport['inView'];
        this.viewportW = this.viewport['w'];
        this.viewportH = this.viewport['h'];
        var dataList = [this.num, this.date, this.startTime, this.id, this.userAgent, this.inView, this.viewportW, this.viewportH];
        data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.attritionFile,
            'data': data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    submitQ() {
        var endTimeObj = new Date();
        this.endTime = FORMAT_TIME(endTimeObj, 'UTC', ':', true);
        this.duration = (endTimeObj - this.dateObj) / 60000; // in minutes
        var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
        this.data += LIST_TO_FORMATTED_STRING(dataList);
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.subjFile,
            'data': this.data
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }

    detectVisibilityStart() {
        var that = this;
        document.addEventListener('visibilitychange', that.handleVisibilityChange);
    }

    detectVisibilityEnd() {
        var that = this;
        document.removeEventListener('visibilitychange', that.handleVisibilityChange);
    }
}

/*
 ### #     #  #####  ####### ######  
  #  ##    # #     #    #    #     # 
  #  # #   # #          #    #     # 
  #  #  #  #  #####     #    ######  
  #  #   # #       #    #    #   #  
  #  #    ## #     #    #    #    #  
 ### #     #  #####     #    #     #  
                                             
*/
class instrObject {
    constructor(options = {}) {
        Object.assign(this, {
            text: [],
            funcDict: {},
            qConditions: [],
            //startExptFunc: false //XXX: where is this function?
        }, options);
        this.index = 0;
        this.instrKeys = Object.keys(this.funcDict).map(Number);
        this.qAttemptN = {};
        for (var i=0;i<this.qConditions.length;i++){
            this.qAttemptN[this.qConditions[i]] = 1;
        }
        this.readingTimes = [];
    }

    start(textBox = $("#instrPage"), textElement = $("#instrText")) {
        textElement.html(this.text[0]);
        if (this.instrKeys.includes(this.index)) {
            this.funcDict[this.index]();
        }
        textBox.show();
        this.startTime = Date.now();
    }

    next(textElement = $("#instrText")) {
        this.readingTimes.push((Date.now() - this.startTime)/1000);
        this.index += 1;
        if (this.index < this.text.length) {
            textElement.html(this.text[this.index]);
            if (this.instrKeys.includes(this.index)) {
                this.funcDict[this.index]();
            }
            this.startTime = Date.now();
        } else {
            //this.startExptFunc();
        }
    }
}

/*
                              
 ##### #####  #   ##   #      
   #   #    # #  #  #  #      
   #   #    # # #    # #      
   #   #####  # ###### #      
   #   #   #  # #    # #      
   #   #    # # #    # ###### 
                              
*/
class trialObject {
    constructor(options = {}) {
        Object.assign(this, {
            subj: false,
            trialN: 0,
            titles: '',
            stimPath: 'Stimuli/',
            dataFile: '',
            savingScript: 'save.php',
            savingDir: 'data/testing',
            trialList: [],
            intertrialInterval: 0.5,
            updateFunc: false,
            trialFunc: false,
            endExptFunc: false
        }, options);
        this.num = this.subj.num;
        console.log(this.num);
        console.log(this.subj.num);
        console.log(this.subj);
        this.date = this.subj.date;
        this.subjStartTime = this.subj.startTime;
        this.trialNum = 0;
        this.allData = LIST_TO_FORMATTED_STRING(this.titles);
        this.complete = false;
    }

    run() {
        var that = this;
        this.trialNum++;
        const LAST = (this.trialNum == this.trialN);
        this.thisTrial = this.trialList.pop();
        
        function findNextTrial(last) {
            if (last){
                return false
            } else {
                return that.trialList[(that.trialList.length) - 1];
            }
        }
        const NEXT_TRIAL = findNextTrial(LAST);

        this.updateFunc(LAST, this.thisTrial, NEXT_TRIAL, this.stimPath);

        const START_STIM = function() {
            that.trialFunc();
            that.startTime = Date.now();
        };

        setTimeout(START_STIM, this.intertrialInterval * 1000);
    }

    end() {
        var currentTime = Date.now();
        this.rt = (currentTime - this.startTime) / 1000; // in second
        if (this.trialNum > 0) {
            var dataList = LIST_FROM_ATTRIBUTE_NAMES(this, this.titles);
            this.allData += LIST_TO_FORMATTED_STRING(dataList);
        }
        if (this.trialNum < this.trialN) {
            this.run();
        } else {
            this.complete = true;
            this.endExptFunc();
        }
    }

    save() {
        var postData = {
            'directory_path': this.savingDir,
            'file_name': this.dataFile,
            'data': this.allData // data to save
        };
        $.ajax({
            type: 'POST',
            url: this.savingScript,
            data: postData,
        });
    }
}
