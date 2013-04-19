window.standUpTimer = (function(){
  var self = {},
      currentSpeakerStartTime,
      defaultMeetingTimeLimit = 15, // minutes
      defaultSpeakerTimeLimit = 90, // seconds
      dispatchMessage,
      displayMessage,
      getCurrentTime = function(){ return (new Date).getTime(); },
      hangoutData = gapi.hangout.data,
      hangoutLayout = gapi.hangout.layout,
      meetingStartTime,
      meetingTimerInterval,
      millisecondsToMinutes,
      millisecondsToSeconds,
      minutesToMilliseconds,
      secondsToMilliseconds,
      speakerTimerInterval,
      startSpeakerTimer,
      updateMeeting,
      updateMeetingLimit,
      updateSpeakerLimit,
      updateTimerWith,
      constructor = this;

  var speakerTimeInfo = {
    expectedTotal : function(){ return secondsToMilliseconds(parseFloat(self.speakerLimitInput.val())); },
    timediff      : function(){ return (getCurrentTime() - currentSpeakerStartTime); },
    remaining     : function(){ return (this.expectedTotal() - this.timediff()); },
    percentage    : function(){ return (this.remaining() / this.expectedTotal()) * 100.0; }
  }

  // disable some display
  $.duration.settings.disableMillisecondsDisplay = true;

  refreshState = function( appEvent ) {
    if(appEvent.state.speakerTimerClickedAt) {
      updateTimerWith(parseInt(appEvent.state.speakerTimerClickedAt));
    }
  };

  displayMessage = function(message){
    if(!hangoutLayout.hasNotice()){
      switch(message){
        case "speakerAlertOvertime":
          hangoutLayout.displayNotice("Time's up! Please give the floor to the next speaker.", false);
          break;
        case "speakerRemindRemainingTime":
          hangoutLayout.displayNotice("TBI", false);
          break;
        default:
      }
    }
  };

  dispatchMessage = function( messageReceivedEvent ){
    displayMessage(messageReceivedEvent.message);
  };

  updateTimerWith = function(timestamp) {
    var currentSpeakerStartTimeWillChange = (currentSpeakerStartTime != timestamp),
        currentState                      = hangoutData.getState();

    if(currentSpeakerStartTimeWillChange){
      currentSpeakerStartTime = timestamp;
      hangoutData.setValue("speakerAlertedOvertime", "false");
    }

    if(self.meetingLimitInput.val() != currentState.meetingLimitInputVal ){ self.meetingLimitInput.val(currentState.meetingLimitInputVal); }
    if(self.speakerLimitInput.val() != currentState.speakerLimitInputVal ){ self.meetingLimitInput.val(currentState.speakerLimitInputVal); }

    if(!meetingStartTime){ meetingStartTime = parseInt(currentState.meetingStartTime); }
    if(!meetingTimerInterval){ meetingTimerInterval = setInterval(updateMeeting, 1000); }
    if(!speakerTimerInterval){ speakerTimerInterval = setInterval(updateSpeaker, 1000); }
  };

  updateMeeting = function(){
    var expectedTotal = minutesToMilliseconds(parseFloat(self.meetingLimitInput.val())),
        timediff      = (getCurrentTime() - meetingStartTime),
        remaining     = (expectedTotal - timediff),
        percentage    = (remaining / expectedTotal) * 100.0;

    self.meetingTimerDisplay.text($.duration(timediff));
    self.meetingCountdownDisplay.text($.duration(remaining));
    self.meetingProgressbar.progressbar({value: percentage});
  };

  updateSpeaker = function(){
    if(speakerTimeInfo.remaining() < 0 && (hangoutData.getValue("speakerAlertedOvertime") != "true")){
      displayMessage("speakerAlertOvertime");
      hangoutData.sendMessage("speakerAlertOvertime");
      hangoutData.setValue("speakerAlertedOvertime", "true");
    }

    self.speakerTimerDisplay.text($.duration(speakerTimeInfo.timediff()));
    self.speakerCountdownDisplay.text($.duration(speakerTimeInfo.remaining()));
    self.speakerProgressbar.progressbar({value: speakerTimeInfo.percentage()});
  };

  self.init = function(){

    // ============================
    // = Default Meeting Elements =
    // ============================
    if(!self.meetingCountdownDisplay){ self.setMeetingCountdownDisplay($(".meeting-countdown-display")); }
    if(!self.meetingLimitInput){ self.setMeetingLimitInput($("#meeting-limit-input")); }
    if(!self.meetingProgressbar){ self.setMeetingProgressbar($(".meeting-progressbar")); }
    if(!self.meetingTimerDisplay){ self.setMeetingTimerDisplay($(".meeting-timer-display")); }

    // ============================
    // = Default Speaker Elements =
    // ============================
    if(!self.speakerCountdownDisplay){ self.setSpeakerCountdownDisplay($(".speaker-countdown-display")); }
    if(!self.speakerLimitInput){ self.setSpeakerLimitInput($("#speaker-limit-input")); }
    if(!self.speakerProgressbar){ self.setSpeakerProgressbar($(".speaker-progressbar")); }
    if(!self.speakerTimerDisplay){ self.setSpeakerTimerDisplay($(".speaker-timer-display")); }
    if(!self.speakerTimerButton){ self.setSpeakerTimerButton($(".speaker-timer-button")); }

    updateMeetingLimit();
    updateSpeakerLimit();

    hangoutData.onStateChanged.add( refreshState );
    hangoutData.onMessageReceived.add( dispatchMessage );

    return self;
  };

  self.setSpeakerTimerButton = function(speakerTimerButton){
    var timeNow;

    self.speakerTimerButton = speakerTimerButton;

    speakerTimerButton.on("click", function(){
      timeNow = getCurrentTime();
      updateTimerWith(timeNow);
      if(!hangoutData.getValue("meetingStartTime")){
        hangoutData.setValue("meetingStartTime", "" + timeNow);
      }
      hangoutData.setValue("speakerTimerClickedAt", "" + timeNow);
    });

    return self;
  };

  self.setMeetingCountdownDisplay = function(meetingCountdownDisplay){
    self.meetingCountdownDisplay = meetingCountdownDisplay;

    return self;
  };
  updateMeetingLimit = function(){
    hangoutData.setValue("meetingLimitInputVal", self.meetingLimitInput.val());
  };
  self.setMeetingLimitInput = function(meetingLimitInput){
    self.meetingLimitInput = meetingLimitInput;

    self.meetingLimitInput
      .val(defaultMeetingTimeLimit)
      .on("change", updateMeetingLimit)
      .spinner();

    return self;
  };
  self.setMeetingProgressbar = function(meetingProgressbar){
    self.meetingProgressbar = meetingProgressbar;
    self.meetingProgressbar.progressbar();

    return self;
  };
  self.setMeetingTimerDisplay = function(meetingTimerDisplay){
    self.meetingTimerDisplay = meetingTimerDisplay;

    return self;
  };

  self.setSpeakerCountdownDisplay = function(speakerCountdownDisplay){
    self.speakerCountdownDisplay = speakerCountdownDisplay;

    return self;
  };
  updateSpeakerLimit = function(){
    hangoutData.setValue("speakerLimitInputVal", self.speakerLimitInput.val());
  };
  self.setSpeakerLimitInput = function(speakerLimitInput){
    self.speakerLimitInput = speakerLimitInput;

    self.speakerLimitInput
      .val(defaultSpeakerTimeLimit)
      .on("change", updateSpeakerLimit)
      .spinner();

    return self;
  };
  self.setSpeakerProgressbar = function(speakerProgressbar){
    self.speakerProgressbar = speakerProgressbar;
    self.speakerProgressbar.progressbar();

    return self;
  };
  self.setSpeakerTimerDisplay = function(speakerTimerDisplay){
    self.speakerTimerDisplay = speakerTimerDisplay;

    return self;
  };

  // =============================
  // = time conversion functions =
  // =============================
  millisecondsToSeconds = function(milliseconds) { return (milliseconds / 1000.0); };
  millisecondsToMinutes = function(milliseconds) { return(millisecondsToSeconds(milliseconds) / 60.0); };
  secondsToMilliseconds = function(seconds) { return(seconds * 1000.0) };
  minutesToMilliseconds = function(minutes) { return(secondsToMilliseconds(minutes * 60.0)) };

  return self
})();