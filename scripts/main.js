(function() {
  "use strict";
  (function($) {
    var bodyWidth, init, placeVideoCanvas, positionElements, positionElementsTimeout, tabs, tabsPanelHeight, tabsPanelWidth, videoCanvas, videoLeft, videoWidth;
    init = function() {
      gapi.hangout.onApiReady.add(function(eventObj) {
        var tabs, videoCanvas;
        if (eventObj.isApiReady) {
          videoCanvas = gapi.hangout.layout.getVideoCanvas();
          tabs = $("#tabs");
          $(document).tooltip();
          tabs.tabs();
          videoCanvas.setVisible(true);
          positionElements();
          $(window).resize(positionElements);
          window.standUpTimer.init();
        }
      });
    };
    bodyWidth = void 0;
    placeVideoCanvas = void 0;
    positionElements = void 0;
    positionElementsTimeout = void 0;
    tabs = void 0;
    tabsPanelHeight = void 0;
    tabsPanelWidth = void 0;
    videoCanvas = void 0;
    videoLeft = void 0;
    videoWidth = void 0;
    positionElements = function() {
      if (positionElementsTimeout) {
        clearTimeout(positionElementsTimeout);
      }
      positionElementsTimeout = setTimeout(function() {
        bodyWidth = $("body").width();
        tabsPanelWidth = (1 / 3) * bodyWidth;
        videoLeft = tabsPanelWidth + 10;
        videoWidth = (bodyWidth - tabsPanelWidth) - 20;
        videoCanvas.setPosition(videoLeft, 10);
        videoCanvas.setWidth(videoWidth);
        tabsPanelHeight = (videoWidth / videoCanvas.getAspectRatio()) + 10;
        tabs.css("width", "" + parseInt(tabsPanelWidth) + "px").css("height", "" + parseInt(tabsPanelHeight) + "px");
        positionElementsTimeout = false;
      }, 24);
    };
    if (typeof gadgets !== "undefined" && gadgets !== null) {
      gadgets.util.registerOnLoadHandler(init);
    }
  })(jQuery);

}).call(this);
