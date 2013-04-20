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
(function($) {
  var $d                  = function(milliseconds){ return $d.inWords(milliseconds); };
  var intSnapCloserToZero = function(num){ return (num < 0) ? Math.ceil(num) : Math.floor(num); };
  var substitute          = function(string, number){ return number ? (string.replace(/%d/i, number) + ((number > 1) || (number < -1) ? "s" : "") + " ") : ""; };

  $.duration = $d;

  $.extend($d, {
    settings: {
      refreshMillis: 60000,
      disableMillisecondsDisplay: false,
      strings: {
        milliseconds: "%d millisecond",
        seconds:      "%d second",
        minutes:      "%d minute",
        hours:        "%d hour",
        days:         "%d day",
        months:       "%d month",
        years:        "%d year"
      }
    },
    inWords: function(milliseconds) {
      var $l      = this.settings.strings;
      var ms      = intSnapCloserToZero(this.settings.disableMillisecondsDisplay ? 0 : (milliseconds % 1000));
      var seconds = intSnapCloserToZero((milliseconds / (1000)) % (60));
      var minutes = intSnapCloserToZero((milliseconds / (1000 * 60)) % (60));
      var hours   = intSnapCloserToZero((milliseconds / (1000 * 60 * 60)) % (24));
      var days    = intSnapCloserToZero((milliseconds / (1000 * 60 * 60 * 24)) % (30));
      var month   = intSnapCloserToZero((milliseconds / (1000 * 60 * 60 * 24 * 30)) % (12));
      var years   = intSnapCloserToZero((milliseconds / (1000 * 60 * 60 * 24 * 30 * 12)));

      return $.trim(substitute($l.years, years) + (substitute($l.months, month)) + (substitute($l.days, days)) + (substitute($l.hours, hours)) + (substitute($l.minutes, minutes)) + (substitute($l.seconds, seconds))  + (substitute($l.milliseconds, ms)));
    },
    getDuration: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      var isTime = $(elem).get(0).tagName.toLowerCase() === "duration"; // $(elem).is("duration");
      return isTime ? $(elem).attr("duration") : $(elem).attr("title");
    }
  });

  $.fn.duration = function() {
    var self = this;
    self.each(refresh);

    var $s = $d.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
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
    if (!element.data("duration")) {
      element.data("duration", { duration: $d.getDuration(element) });
      var text = $.trim(element.text());
      if (text.length > 0) {
        element.attr("title", text);
      }
    }
    return element.data("duration");
  }
}(jQuery));
