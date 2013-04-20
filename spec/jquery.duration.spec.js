describe("$.duration", function() {
  var milliseconds = 1,
      seconds      = (1000 * milliseconds),
      minutes      = (60 * seconds),
      hours        = (60 * minutes),
      days         = (24 * hours),
      months       = (30 * days),          // ~ approximate only: # days varies per month
      years        = (12 * months);        // ~ approximate only: months is no longer accurate

  describe("when settings.disableMillisecondsDisplay is set to false", function() {
    var oldDisableMillisecondsDisplay = $.duration.settings.disableMillisecondsDisplay;

    beforeEach(function() {
      $.duration.settings.disableMillisecondsDisplay = false;
    });

    afterEach(function() {
      $.duration.settings.disableMillisecondsDisplay = oldDisableMillisecondsDisplay;
    });

    it("expresses 7 milliseconds as string", function() {
      expect($.duration(7 * milliseconds)).toBe("7 milliseconds");
    });
  });

  describe("when settings.disableMillisecondsDisplay is set to false", function() {
    var oldDisableMillisecondsDisplay = $.duration.settings.disableMillisecondsDisplay;

    beforeEach(function() {
      $.duration.settings.disableMillisecondsDisplay = true;
    });

    afterEach(function() {
      $.duration.settings.disableMillisecondsDisplay = oldDisableMillisecondsDisplay;
    });

    it("does not display milliseconds", function() {
      expect($.duration(7 * milliseconds)).toBe("");
    });
  });

  describe("when day units is replaced", function() {
    var stringDays = $.duration.settings.strings.days;

    beforeEach(function() {
      $.duration.settings.strings.days = "%d dog day";
    });

    afterEach(function() {
      $.duration.settings.strings.days = stringDays;
    });

    it("expresses 7 dog days as string", function() {
      expect($.duration(7 * days)).toBe("7 dog days");
    });
  });

  describe("when given duration in milliseconds", function() {
    
    it("expresses 7 seconds as string", function() {
      expect($.duration(7 * seconds)).toBe("7 seconds");
    });

    it("expresses 7 minutes as string", function() {
      expect($.duration(7 * minutes)).toBe("7 minutes");
    });

    it("expresses 7 hours as string", function() {
      expect($.duration(7 * hours)).toBe("7 hours");
    });

    it("expresses 7 days as string", function() {
      expect($.duration(7 * days)).toBe("7 days");
    });

    it("expresses 7 months as string", function() {
      expect($.duration(7 * months)).toBe("7 months");
    });

    it("expresses 7 years as string", function() {
      expect($.duration(7 * years)).toBe("7 years");
    });

    it("expresses 7 years 7 months 7 days 7 hours 7 minutes 7 seconds years as string", function() {
      var all_7 = 7 * milliseconds;
      all_7 = all_7 + (7 * seconds);
      all_7 = all_7 + (7 * minutes);
      all_7 = all_7 + (7 * hours);
      all_7 = all_7 + (7 * days);
      all_7 = all_7 + (7 * months);
      all_7 = all_7 + (7 * years);

      expect($.duration(all_7)).toBe("7 years 7 months 7 days 7 hours 7 minutes 7 seconds");
    });

    it("expresses negative duration as string", function() {
      expect($.duration(-7 * hours)).toBe("-7 hours");
    });

    it("expresses singular duration as string", function() {
      expect($.duration(1 * hours)).toBe("1 hour");
    });

  });

});