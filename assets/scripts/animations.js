// Detect IE version, from https://github.com/gagle/js-ie-version
function detectIEVersion() {
    var win = window;
    var doc = win.document;
    var input = doc.createElement('input');

    var ie = (function () {
        //"!win.ActiveXObject" is evaluated to true in IE11
        if (win.ActiveXObject === undefined) return null;
        if (!win.XMLHttpRequest) return 6;
        if (!doc.querySelector) return 7;
        if (!doc.addEventListener) return 8;
        if (!win.atob) return 9;
        //"!doc.body.dataset" is faster but the body is null when the DOM is not
        //ready. Anyway, an input tag needs to be created to check if IE is being
        //emulated
        if (!input.dataset) return 10;
        return 11;
    })();

    //http://www.pinlady.net/PluginDetect/IE
    var emulated = false;
    if (ie && doc.documentMode) {
        try {
            input.style.behavior = 'url(#default#clientcaps)';
            emulated = doc.documentMode !== win.parseInt(
                input.getComponentVersion(
                    '{45EA75A0-A269-11D1-B5BF-0000F8051515}', 'componentid'));
        } catch (e) {
            //getComponentVersion() is not available in IE11+ and if a lower version
            //is emulated, it also doesn't exist
            //"if(input.getComponentVersion)" cannot be used
        }
    }

    return {
        version: ie,
        emulated: !!ie && emulated
    }
}

var ie = detectIEVersion()
console.log('Internet Explorer', JSON.stringify(ie))

$(document).ready(function () {
    var options = {
        //auto: true,
        mode: 'fade',
        touchEnabled: true,
        speed: 1000,
        pause: 5000,
        stopAutoOnClick: true,

        onSlideBefore: function ($newSlide, oldIndex, newIndex) {
            $newSlide.addClass('appearing')
            initiateAutoSliding()  // If the user changes a slide, abort the animation
        },
    }
    var isAnimating = true

    var slider = null

    function initiateAutoSliding() {
        if (isAnimating) {
            isAnimating = false
            slider.startAuto()
            console.log('starting slider')
        }
    }

    // slider off manually?
    if (location.search.indexOf('slider-off') !== -1) {
    }
    // mobile?
    else if (window.innerWidth < 980) {
        isAnimating = false
        options.auto = true
    }
    // desktop
    else {
        setTimeout(initiateAutoSliding, 3000)
    }

    if (location.search.indexOf('no-slider') === -1) {
        slider = $('main .slider').bxSlider(options)
    }

    //document.getElementById('slider-video').addEventListener('ended', initiateAutoSliding, false)

    // IE 11 doesn't support CSS property `object-fit` so we have to fit the video manually
    var $video = $('#slider-video')
    if (ie.version !== null) {
        var origVideoRatio = 3840 / 2160
        var crntWidth = window.innerWidth
        var videoHeight = crntWidth / origVideoRatio
        var sliderHeight = 600
        $video.css({
            height: parseInt(videoHeight) + 'px',
            top: '-' + (parseInt(videoHeight - sliderHeight) / 2) + 'px',
        })
    }
});
