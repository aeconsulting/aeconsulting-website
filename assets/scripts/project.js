function handleHeaderStickyness() {
    if ($(window).scrollTop() > 0) {
        $('body').addClass('sticky')
    } else {
        $('body').removeClass('sticky')
    }
}

function isMobile() {
    return $(document.body).width() < 980;
}

$.fn.getIndex = function(){
    var $p = $(this).parent().children();
    return $p.index(this);
}




$(function() {
    $(window).scroll(handleHeaderStickyness)
    handleHeaderStickyness()

    // -- Menu handling
    $('.menu-toggle').click(function() {
        $('body').toggleClass('menu-open')
        $('body').toggleClass('noscroll')

        var $columns = $('body>.menu .column')
        if ($('body').hasClass('menu-open')) {
            for (var i=0; i<$columns.length; ++i) {
                (function($column, delay) {
                    setTimeout(function() {
                        $column.addClass('appeared')
                    }, delay)
                })($columns.eq(i), i*50)
            }
        } else {
            $columns.removeClass('appeared')
        }

        // When menu got closed: reset
        if (!$('body>.menu').hasClass('menu-open')) {
            $('body>.menu').removeClass('mobile-level2')
            $('body>.menu .column').removeClass('mobile-not-selected mobile-selected')
        }
    })

    // -- Mobile menu
    $('body>.menu a').click(function(e) {
        if (!isMobile()) {
            return true
        }
        // Level 1: Select focus-column
        if (!$('body>.menu').hasClass('mobile-level2')) {
            var column = e.target
            while (column && !$(column).hasClass('column')) {
                column = column.parentElement
            }
            $('body>.menu').addClass('mobile-level2')
            $('body>.menu .column').addClass('mobile-not-selected')
            $(column).removeClass('mobile-not-selected').addClass('mobile-selected')
            return false
        }
        // Level 2: Display only focus-column entries
        if ($('body>.menu').hasClass('mobile-level2')) {
            if ($(e.target).getIndex() === 0) {
                $('body>.menu').removeClass('mobile-level2')
                $('body>.menu .column').removeClass('mobile-not-selected mobile-selected')
                return false
            }
        }
        return true
    })


    // -- Reset select boxes in case the back button was pressed and the browser remembered the choice
    $('select').each(function () {
        var initial = $(this).find('option[selected]').val()
        if (!initial) {
            initial = $(this).find('option')[0].value
        }
        $(this).val(initial)
    })


    // -- Custom style select boxes
    $('select').each(function(i, elem) {
        $(elem).heapbox({
            effect: {
                type: 'slide',
                speed: 'fast'
            },
            onChange: function(e) {
                $(elem).trigger('change')
            }
        })
    })


    // -- New project tiles hover
    $('.list2 a').hover(function() {
        var list = $(this).closest('.row')
        var index = $(this).index()
        list.find('a').removeClass('hovered')
        list.find('a:nth-child('+(parseInt(index)+1)+')').addClass('hovered')
    })
})

// Header search
$(function() {
    $('header .search').submit(function(e) {

    });
});



// Scroll to n-th section
$(function() {
    var urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return results!==null? results[1] : null;
    }

    if (urlParam('section')) {
        var sectionNr = parseInt(urlParam('section'))
        $('html, body').animate({
            scrollTop: $('section').eq(sectionNr-1).offset().top - 50
        }, 500)
    }
})



var Lang = {
    crnt: function() {
        if (/^\/china\//.test(document.location.pathname)) {
            return 'cn'
        } else {
            return 'en'
        }
    },

    prefix: function() {
        switch (Lang.crnt()) {
            case 'en': return ''
            case 'cn': return '/china'
        }
    }
}



// Data protection Google Analytics opt-out
$(function() {
    var optOut = $('a[href="/?analytics-opt-out"]')
    if (optOut.length) {
        optOut[0].onclick = function(e) {
            e.preventDefault()
            gaOptout()
            return false
        }
    }
})
