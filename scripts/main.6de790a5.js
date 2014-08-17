(function($) {

  var bodyWidth,
      placeVideoCanvas,
      positionElements,
      positionElementsTimeout,
      tabs,
      tabsPanelHeight,
      tabsPanelWidth,
      videoCanvas,
      videoLeft,
      videoWidth;

  positionElements = function() {
    if (positionElementsTimeout) { clearTimeout(positionElementsTimeout); }

    positionElementsTimeout = setTimeout(function() {

      bodyWidth      = $("body").width();
      tabsPanelWidth = (1/3) * bodyWidth;
      videoLeft      = tabsPanelWidth + 10;
      videoWidth     = (bodyWidth - tabsPanelWidth) - 20;

      videoCanvas.setPosition(videoLeft, 10);
      videoCanvas.setWidth(videoWidth);

      tabsPanelHeight = ( videoWidth / videoCanvas.getAspectRatio() ) + 10;

      tabs
        .css("width",  "" + parseInt(tabsPanelWidth) + "px")
        .css("height", "" + parseInt(tabsPanelHeight) + "px");

      positionElementsTimeout = false;

    }, 24);
  };

  function init() {
    gapi.hangout.onApiReady.add( function(eventObj) {
      if (eventObj.isApiReady) {
        videoCanvas = gapi.hangout.layout.getVideoCanvas();
        tabs = $("#tabs");

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
  gadgets.util.registerOnLoadHandler(init);

  // ====================
  // = Global Functions =
  // ====================

})(jQuery);
