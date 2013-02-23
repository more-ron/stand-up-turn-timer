window.standUpTimer = (function(){
  var self = {},
      defaultMeetingTimeLimit = 15, // minutes
      defaultSpeakerTimeLimit = 45, // seconds
      currentSpeakerStartTime,
      currentTime,
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

  currentTime = function(){ return (new Date).getTime(); };

  refreshState = function( appEvent ) {
    if(appEvent.state.speakerTimerClickedAt) {
      updateTimerWith(parseInt(appEvent.state.speakerTimerClickedAt));
    }
  };

  updateTimerWith = function(timestamp) {
    currentSpeakerStartTime = timestamp;

    if(self.meetingLimitInput.val() != gapi.hangout.data.getState().meetingLimitInputVal ){ self.meetingLimitInput.val(gapi.hangout.data.getState().meetingLimitInputVal); }
    if(self.speakerLimitInput.val() != gapi.hangout.data.getState().speakerLimitInputVal ){ self.meetingLimitInput.val(gapi.hangout.data.getState().speakerLimitInputVal); }

    if(!meetingStartTime){ meetingStartTime = currentSpeakerStartTime; }
    if(!meetingTimerInterval){ meetingTimerInterval = setInterval(updateMeeting, 1000); }
    if(!speakerTimerInterval){ speakerTimerInterval = setInterval(updateSpeaker, 1000); }
  };

  updateMeeting = function(){
    var expectedTotal = minutesToMilliseconds(parseFloat(self.meetingLimitInput.val())),
        timediff      = (currentTime() - meetingStartTime),
        remaining     = (expectedTotal - timediff),
        percentage    = (remaining / expectedTotal) * 100.0;

    self.meetingTimerDisplay.text(parseInt(millisecondsToMinutes(timediff)));
    self.meetingCountdownDisplay.text(parseInt(millisecondsToMinutes(remaining)));
    self.meetingProgressbar.progressbar({value: percentage});
  };

  updateSpeaker = function(){
    var expectedTotal = secondsToMilliseconds(parseFloat(self.speakerLimitInput.val())),
        timediff      = (currentTime() - currentSpeakerStartTime),
        remaining     = (expectedTotal - timediff),
        percentage    = (remaining / expectedTotal) * 100.0;

    self.speakerTimerDisplay.text(parseInt(millisecondsToSeconds(timediff)));
    self.speakerCountdownDisplay.text(parseInt(millisecondsToSeconds(remaining)));
    self.speakerProgressbar.progressbar({value: percentage});
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

    gapi.hangout.data.onStateChanged.add( refreshState  )

    return self;
  };

  self.setSpeakerTimerButton = function(speakerTimerButton){
    var timeNow;

    self.speakerTimerButton = speakerTimerButton;

    speakerTimerButton.on("click", function(){
      timeNow = currentTime();
      updateTimerWith(timeNow);
      gapi.hangout.data.setValue("speakerTimerClickedAt", "" + timeNow);
    });

    return self;
  };

  self.setMeetingCountdownDisplay = function(meetingCountdownDisplay){
    self.meetingCountdownDisplay = meetingCountdownDisplay;

    return self;
  };
  updateMeetingLimit = function(){
    gapi.hangout.data.setValue("meetingLimitInputVal", self.meetingLimitInput.val());
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
    gapi.hangout.data.setValue("speakerLimitInputVal", self.speakerLimitInput.val());
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