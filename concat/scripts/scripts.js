'use strict';
/**
 * @ngdoc overview
 * @name standUpTurnTimerApp
 * @description
 * # standUpTurnTimerApp
 *
 * Main module of the application.
 */
angular.module('standUpTurnTimerApp', [
  'ngAnimate',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch'
]).config([
  '$routeProvider',
  function ($routeProvider) {
    ich.refresh();
    $routeProvider.when('/', {
      template: ich['main-view'],
      controller: 'MainCtrl'
    }).when('/about', {
      template: ich['about-view'],
      controller: 'AboutCtrl'
    }).otherwise({ redirectTo: '/' });
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name standUpTurnTimerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the standUpTurnTimerApp
 */
angular.module('standUpTurnTimerApp').controller('AboutCtrl', [
  '$scope',
  function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }
]);
'use strict';
/**
 * @ngdoc function
 * @name standUpTurnTimerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the standUpTurnTimerApp
 */
angular.module('standUpTurnTimerApp').controller('MainCtrl', [
  '$scope',
  function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    (function ($) {
      var bodyWidth, placeVideoCanvas, positionElements, positionElementsTimeout, tabs, tabsPanelHeight, tabsPanelWidth, videoCanvas, videoLeft, videoWidth;
      positionElements = function () {
        if (positionElementsTimeout) {
          clearTimeout(positionElementsTimeout);
        }
        positionElementsTimeout = setTimeout(function () {
          bodyWidth = $('body').width();
          tabsPanelWidth = 1 / 3 * bodyWidth;
          videoLeft = tabsPanelWidth + 10;
          videoWidth = bodyWidth - tabsPanelWidth - 20;
          videoCanvas.setPosition(videoLeft, 10);
          videoCanvas.setWidth(videoWidth);
          tabsPanelHeight = videoWidth / videoCanvas.getAspectRatio() + 10;
          tabs.css('width', '' + parseInt(tabsPanelWidth) + 'px').css('height', '' + parseInt(tabsPanelHeight) + 'px');
          positionElementsTimeout = false;
        }, 24);
      };
      function init() {
        gapi.hangout.onApiReady.add(function (eventObj) {
          if (eventObj.isApiReady) {
            videoCanvas = gapi.hangout.layout.getVideoCanvas();
            tabs = $('#tabs');
            // setup tooltips
            $(document).tooltip();
            tabs.tabs();
            videoCanvas.setVisible(true);
            positionElements();
            $(window).resize(positionElements);
            window.standUpTimer.init();
          }
        });
      }
      // Wait for gadget to load.
      gadgets.util.registerOnLoadHandler(init);  // ====================
                                                 // = Global Functions =
                                                 // ====================
    }(jQuery));
  }
]);
/**
 * Duration is a jQuery plugin that makes it easy to support automatically
 * updating durations (e.g. "4 minutes" or "1 hour").
 *
 * @name duration
 * @version 0.10.0
 * @requires jQuery v1.2.3+
 * @author Loïc Guillois
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 *
 * Copyright (c) 2012, Loïc Guillois (contact -[at]- loicguillois [*dot*] fr)
 */
(function ($) {
  var $d = function (milliseconds) {
    return $d.inWords(milliseconds);
  };
  var intSnapCloserToZero = function (num) {
    return num < 0 ? Math.ceil(num) : Math.floor(num);
  };
  var substitute = function (string, number) {
    return number ? string.replace(/%d/i, number) + (number > 1 || number < -1 ? 's' : '') + ' ' : '';
  };
  $.duration = $d;
  $.extend($d, {
    settings: {
      refreshMillis: 60000,
      disableMillisecondsDisplay: false,
      strings: {
        milliseconds: '%d millisecond',
        seconds: '%d second',
        minutes: '%d minute',
        hours: '%d hour',
        days: '%d day',
        months: '%d month',
        years: '%d year'
      }
    },
    inWords: function (milliseconds) {
      var $l = this.settings.strings;
      var ms = intSnapCloserToZero(this.settings.disableMillisecondsDisplay ? 0 : milliseconds % 1000);
      var seconds = intSnapCloserToZero(milliseconds / 1000 % 60);
      var minutes = intSnapCloserToZero(milliseconds / (1000 * 60) % 60);
      var hours = intSnapCloserToZero(milliseconds / (1000 * 60 * 60) % 24);
      var days = intSnapCloserToZero(milliseconds / (1000 * 60 * 60 * 24) % 30);
      var month = intSnapCloserToZero(milliseconds / (1000 * 60 * 60 * 24 * 30) % 12);
      var years = intSnapCloserToZero(milliseconds / (1000 * 60 * 60 * 24 * 30 * 12));
      return $.trim(substitute($l.years, years) + substitute($l.months, month) + substitute($l.days, days) + substitute($l.hours, hours) + substitute($l.minutes, minutes) + substitute($l.seconds, seconds) + substitute($l.milliseconds, ms));
    },
    getDuration: function (elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === 'duration';
      // $(elem).is("duration");
      return isTime ? $(elem).attr('duration') : $(elem).attr('title');
    }
  });
  $.fn.duration = function () {
    var self = this;
    self.each(refresh);
    var $s = $d.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function () {
        self.each(refresh);
      }, $s.refreshMillis);
    }
    return self;
  };
  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.duration)) {
      $(this).text($d.inWords(data.duration));
    }
    return this;
  }
  function prepareData(element) {
    element = $(element);
    if (!element.data('duration')) {
      element.data('duration', { duration: $d.getDuration(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr('title', text);
      }
    }
    return element.data('duration');
  }
}(jQuery));
window.standUpTimer = function () {
  var self = {}, currentSpeakerStartTime, defaultMeetingTimeLimit = 15,
    // minutes
    defaultSpeakerTimeLimit = 90,
    // seconds
    dispatchMessage, displayMessage, getCurrentTime = function () {
      return new Date().getTime();
    }, hangoutData = gapi.hangout.data, hangoutLayout = gapi.hangout.layout, meetingStartTime, meetingTimerInterval, millisecondsToMinutes, millisecondsToSeconds, minutesToMilliseconds, refreshState, secondsToMilliseconds, speakerTimerInterval, startSpeakerTimer, updateMeeting, updateMeetingLimit, updateSpeaker, updateSpeakerLimit, updateTimerWith, constructor = this;
  var speakerTimeInfo = {
      expectedTotal: function () {
        return secondsToMilliseconds(parseFloat(self.speakerLimitInput.val()));
      },
      timediff: function () {
        return getCurrentTime() - currentSpeakerStartTime;
      },
      remaining: function () {
        return this.expectedTotal() - this.timediff();
      },
      percentage: function () {
        return this.remaining() / this.expectedTotal() * 100;
      }
    };
  // disable some display
  $.duration.settings.disableMillisecondsDisplay = true;
  refreshState = function (appEvent) {
    if (appEvent.state.speakerTimerClickedAt) {
      updateTimerWith(parseInt(appEvent.state.speakerTimerClickedAt));
    }
  };
  displayMessage = function (message) {
    if (!hangoutLayout.hasNotice()) {
      switch (message) {
      case 'speakerAlertOvertime':
        hangoutLayout.displayNotice('Time\'s up! Please give the floor to the next speaker.', false);
        break;
      case 'speakerRemindRemainingTime':
        hangoutLayout.displayNotice('Remaining time: ' + $.duration(speakerTimeInfo.remaining()), false);
        break;
      default:
      }
    }
  };
  dispatchMessage = function (messageReceivedEvent) {
    displayMessage(messageReceivedEvent.message);
  };
  updateTimerWith = function (timestamp) {
    var currentState = hangoutData.getState();
    currentSpeakerStartTime = timestamp;
    meetingStartTime = currentState.meetingStartTime ? parseInt(currentState.meetingStartTime) : currentSpeakerStartTime;
    if (self.meetingLimitInput.val() != currentState.meetingLimitInputVal) {
      self.meetingLimitInput.val(currentState.meetingLimitInputVal);
    }
    if (self.speakerLimitInput.val() != currentState.speakerLimitInputVal) {
      self.meetingLimitInput.val(currentState.speakerLimitInputVal);
    }
    if (!meetingTimerInterval) {
      meetingTimerInterval = setInterval(updateMeeting, 1000);
    }
    if (!speakerTimerInterval) {
      speakerTimerInterval = setInterval(updateSpeaker, 1000);
    }
  };
  updateMeeting = function () {
    var expectedTotal = minutesToMilliseconds(parseFloat(self.meetingLimitInput.val())), timediff = getCurrentTime() - meetingStartTime, remaining = expectedTotal - timediff, percentage = remaining / expectedTotal * 100;
    self.meetingTimerDisplay.text($.duration(timediff));
    self.meetingCountdownDisplay.text($.duration(remaining));
    self.meetingProgressbar.progressbar({ value: percentage });
  };
  updateSpeaker = function () {
    if (speakerTimeInfo.remaining() > -5000 && speakerTimeInfo.remaining() < 0) {
      displayMessage('speakerAlertOvertime');
      hangoutData.sendMessage('speakerAlertOvertime');
    }
    self.speakerTimerDisplay.text($.duration(speakerTimeInfo.timediff()));
    self.speakerCountdownDisplay.text($.duration(speakerTimeInfo.remaining()));
    self.speakerProgressbar.progressbar({ value: speakerTimeInfo.percentage() });
  };
  self.init = function () {
    // ============================
    // = Default Meeting Elements =
    // ============================
    if (!self.meetingCountdownDisplay) {
      self.setMeetingCountdownDisplay($('.meeting-countdown-display'));
    }
    if (!self.meetingLimitInput) {
      self.setMeetingLimitInput($('#meeting-limit-input'));
    }
    if (!self.meetingProgressbar) {
      self.setMeetingProgressbar($('.meeting-progressbar'));
    }
    if (!self.meetingTimerDisplay) {
      self.setMeetingTimerDisplay($('.meeting-timer-display'));
    }
    // ============================
    // = Default Speaker Elements =
    // ============================
    if (!self.speakerCountdownDisplay) {
      self.setSpeakerCountdownDisplay($('.speaker-countdown-display'));
    }
    if (!self.speakerLimitInput) {
      self.setSpeakerLimitInput($('#speaker-limit-input'));
    }
    if (!self.speakerProgressbar) {
      self.setSpeakerProgressbar($('.speaker-progressbar'));
    }
    if (!self.speakerTimerDisplay) {
      self.setSpeakerTimerDisplay($('.speaker-timer-display'));
    }
    if (!self.speakerTimerButton) {
      self.setSpeakerTimerButton($('.speaker-timer-button'));
    }
    if (!self.resetTimerButton) {
      self.setResetTimerButton($('.reset-timer-button'));
    }
    if (!self.speakerRemainingTimeReminderButton) {
      self.setSpeakerRemainingTimeReminderButton($('.speaker-remaining-time-reminder-button'));
    }
    updateMeetingLimit();
    updateSpeakerLimit();
    hangoutData.onStateChanged.add(refreshState);
    hangoutData.onMessageReceived.add(dispatchMessage);
    return self;
  };
  self.setSpeakerTimerButton = function (speakerTimerButton) {
    var timeNow;
    self.speakerTimerButton = speakerTimerButton;
    speakerTimerButton.on('click', function () {
      timeNow = getCurrentTime();
      updateTimerWith(timeNow);
      if (!hangoutData.getValue('meetingStartTime')) {
        hangoutData.setValue('meetingStartTime', '' + timeNow);
      }
      hangoutData.setValue('speakerTimerClickedAt', '' + timeNow);
    });
    return self;
  };
  self.setResetTimerButton = function (resetTimerButton) {
    var timeNow;
    self.resetTimerButton = resetTimerButton;
    resetTimerButton.on('click', function () {
      timeNow = getCurrentTime();
      updateTimerWith(timeNow);
      meetingStartTime = timeNow;
      hangoutData.setValue('meetingStartTime', '' + timeNow);
      hangoutData.setValue('speakerTimerClickedAt', '' + timeNow);
    });
    return self;
  };
  self.setSpeakerRemainingTimeReminderButton = function (speakerRemainingTimeReminderButton) {
    self.speakerRemainingTimeReminderButton = speakerRemainingTimeReminderButton;
    speakerRemainingTimeReminderButton.on('click', function () {
      displayMessage('speakerRemindRemainingTime');
      hangoutData.sendMessage('speakerRemindRemainingTime');
    });
  };
  self.setMeetingCountdownDisplay = function (meetingCountdownDisplay) {
    self.meetingCountdownDisplay = meetingCountdownDisplay;
    return self;
  };
  updateMeetingLimit = function () {
    hangoutData.setValue('meetingLimitInputVal', self.meetingLimitInput.val());
  };
  self.setMeetingLimitInput = function (meetingLimitInput) {
    self.meetingLimitInput = meetingLimitInput;
    self.meetingLimitInput.val(defaultMeetingTimeLimit).on('change', updateMeetingLimit).spinner();
    return self;
  };
  self.setMeetingProgressbar = function (meetingProgressbar) {
    self.meetingProgressbar = meetingProgressbar;
    self.meetingProgressbar.progressbar();
    return self;
  };
  self.setMeetingTimerDisplay = function (meetingTimerDisplay) {
    self.meetingTimerDisplay = meetingTimerDisplay;
    return self;
  };
  self.setSpeakerCountdownDisplay = function (speakerCountdownDisplay) {
    self.speakerCountdownDisplay = speakerCountdownDisplay;
    return self;
  };
  updateSpeakerLimit = function () {
    hangoutData.setValue('speakerLimitInputVal', self.speakerLimitInput.val());
  };
  self.setSpeakerLimitInput = function (speakerLimitInput) {
    self.speakerLimitInput = speakerLimitInput;
    self.speakerLimitInput.val(defaultSpeakerTimeLimit).on('change', updateSpeakerLimit).spinner();
    return self;
  };
  self.setSpeakerProgressbar = function (speakerProgressbar) {
    self.speakerProgressbar = speakerProgressbar;
    self.speakerProgressbar.progressbar();
    return self;
  };
  self.setSpeakerTimerDisplay = function (speakerTimerDisplay) {
    self.speakerTimerDisplay = speakerTimerDisplay;
    return self;
  };
  // =============================
  // = time conversion functions =
  // =============================
  millisecondsToSeconds = function (milliseconds) {
    return milliseconds / 1000;
  };
  millisecondsToMinutes = function (milliseconds) {
    return millisecondsToSeconds(milliseconds) / 60;
  };
  secondsToMilliseconds = function (seconds) {
    return seconds * 1000;
  };
  minutesToMilliseconds = function (minutes) {
    return secondsToMilliseconds(minutes * 60);
  };
  return self;
}();