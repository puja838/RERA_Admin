(function($) {

    $.fn.menumaker = function(options) {

        var cssmenu = $(this),
            settings = $.extend({
                title: "",
                format: "dropdown",
                sticky: false
            }, options);

        return this.each(function() {
            cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
            $(this).find("#menu-button").on('click', function() {
                $(this).toggleClass('menu-opened');
                var mainmenu = $(this).next('ul');
                if (mainmenu.hasClass('open')) {
                    mainmenu.hide().removeClass('open');
                } else {
                    mainmenu.show().addClass('open');
                    if (settings.format === "dropdown") {
                        mainmenu.find('ul').show();
                    }
                }
            });



            cssmenu.find('li ul').parent().addClass('has-sub');

            multiTg = function() {
                cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
                cssmenu.find('.submenu-button').on('click', function() {
                    $(this).toggleClass('submenu-opened');
                    if ($(this).siblings('ul').hasClass('open')) {
                        $(this).siblings('ul').removeClass('open').hide();
                    } else {
                        $(this).siblings('ul').addClass('open').show();
                    }
                });
            };


            

            if (settings.format === 'multitoggle') multiTg();
            else cssmenu.addClass('dropdown');

            if (settings.sticky === true) cssmenu.css('position', 'fixed');

            resizeFix = function() {
                if ($(window).width() > 1024) {
                    cssmenu.find('ul').show();
                }

                if ($(window).width() <= 1024) {
                    cssmenu.find('ul').hide().removeClass('open');
                }
            };
            resizeFix();
            return $(window).on('resize', resizeFix);

        });
    };
})(jQuery);

(function($) {
    $(document).ready(function() {

        $(document).ready(function() {
            $("#cssmenu").menumaker({
                title: "",
                format: "multitoggle"
            });

            $("#cssmenu").prepend("<div id='menu-line'></div>");

            var foundActive = false,
                activeElement, linePosition = 0,
                menuLine = $("#cssmenu #menu-line"),
                lineWidth, defaultPosition, defaultWidth;

            $("#cssmenu > ul > li").each(function() {
                if ($(this).hasClass('active')) {
                    activeElement = $(this);
                    foundActive = true;
                }
            });

            if (foundActive === false) {
                activeElement = $("#cssmenu > ul > li").first();
            }

            defaultWidth = lineWidth = activeElement.width();

            defaultPosition = linePosition = activeElement.position().left;

            menuLine.css("width", lineWidth);
            menuLine.css("left", linePosition);

            $("#cssmenu > ul > li").hover(function() {
                    activeElement = $(this);
                    lineWidth = activeElement.width();
                    linePosition = activeElement.position().left;
                    menuLine.css("width", lineWidth);
                    menuLine.css("left", linePosition);
                },
                function() {
                    menuLine.css("left", defaultPosition);
                    menuLine.css("width", defaultWidth);
                });

        });


    });
})(jQuery);

$(document).ready(function() {
    // grab the initial top offset of the navigation 
    var stickyNavTop = $('.head-menu-part').offset().top;

    // our function that decides weather the navigation bar should have "fixed" css position or not.
    var stickyNav = function() {
        var scrollTop = $(window).scrollTop(); // our current vertical position from the top

        // if we've scrolled more than the navigation, change its position to fixed to stick to top,
        // otherwise change it back to relative
        if (scrollTop > stickyNavTop) {
            $('.head-menu-part').addClass('sticky');
        } else {
            $('.head-menu-part').removeClass('sticky');
        }
    };

    stickyNav();
    // and run it again every time you scroll
    $(window).scroll(function() {
        stickyNav();
    });
});

// You can also use "$(window).load(function() {"
$(function() {
    $("#slider1").responsiveSlides({
        auto: true,
        pager: false,
        nav: true,
        speed: 1000,
        namespace: "centered-btns",
        before: function() {
            $('.events').append("<li>before event fired.</li>");
        },
        after: function() {
            $('.events').append("<li>after event fired.</li>");
        }
    });

});

$(".carousel_latest_news").owlCarousel({
    autoplay: true,
    dots: false,
    nav: true,
    margin: 30,
    loop: true,
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        900: {
            items: 3
        }
    }
});

$(".carousel_imp_notic").owlCarousel({
    autoplay: true,
    dots: false,
    nav: true,
    margin: 30,
    loop: true,
    items: 4,
    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 2
        },
        900: {
            items: 3
        }
    }
});

$(".carousel_whatsnewsin").owlCarousel({
    autoplay: 2500,
    slideSpeed: 300,
    paginationSpeed: 500,
    dots: false,
    nav: false,
    margin: 30,
    loop: true,
    items: 1,

    responsive: {
        0: {
            items: 1
        },
        768: {
            items: 1
        },
        900: {
            items: 1
        }
    }
});

$(window).scroll(function() {
    if ($(this).scrollTop()) {
        $('#toTop').fadeIn();
    } else {
        $('#toTop').fadeOut();
    }
});

$("#toTop").click(function() {
    //1 second of animation time
    //html works for FFX but not Chrome
    //body works for Chrome but not FFX
    //This strange selector seems to work universally
    $("html, body").animate({
        scrollTop: 0
    }, 1000);
});


function show1() {
    document.getElementById('div1').style.display = 'block';
    document.getElementById('div2').style.display = 'none';
    document.getElementById('div01').style.display = 'block';
    document.getElementById('div02').style.display = 'none';
}

function show2() {
    document.getElementById('div2').style.display = 'block';
    document.getElementById('div1').style.display = 'none';
    document.getElementById('div14').style.display = 'block';
    document.getElementById('div02').style.display = 'block';
    document.getElementById('div01').style.display = 'none';
}

function show3() {
    document.getElementById('div3').style.display = 'block';
    document.getElementById('div4').style.display = 'none';
    document.getElementById('div15').style.display = 'none';
}


function show4() {
    document.getElementById('div4').style.display = 'block';
    document.getElementById('div3').style.display = 'none';
    document.getElementById('div15').style.display = 'block';
}

function show5() {
    document.getElementById('div5').style.display = 'block';
}

function show6() {
    document.getElementById('div5').style.display = 'none';
}

function show10() {
    document.getElementById('div10').style.display = 'block';
    document.getElementById('div11').style.display = 'none';
    document.getElementById('div12').style.display = 'none';
    document.getElementById('div13').style.display = 'none';
}

function show11() {
    document.getElementById('div11').style.display = 'block';
    document.getElementById('div10').style.display = 'none';
    document.getElementById('div12').style.display = 'none';
    document.getElementById('div13').style.display = 'none';
}

function show12() {
    document.getElementById('div12').style.display = 'block';
    document.getElementById('div10').style.display = 'none';
    document.getElementById('div11').style.display = 'none';
    document.getElementById('div13').style.display = 'none';
}

function show13() {
    document.getElementById('div13').style.display = 'block';
    document.getElementById('div11').style.display = 'none';
    document.getElementById('div12').style.display = 'none';
    document.getElementById('div10').style.display = 'none';
}

function show14() {
    document.getElementById('div14').style.display = 'block';
}

function show15() {
    document.getElementById('div14').style.display = 'none';
}

function show16() {
    document.getElementById('div15').style.display = 'none';
}

function show17() {
    document.getElementById('div15').style.display = 'block';
}

function showd1() {
    document.getElementById('dve1').style.display = 'block';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';
}

function showd2() {
    document.getElementById('dve2').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';

}

function showd3() {
    document.getElementById('dve3').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';
}

function showd4() {
    document.getElementById('dve4').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';

}

function showd5() {
    document.getElementById('dve5').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';
}

function showd6() {
    document.getElementById('dve6').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';

}

function showd7() {
    document.getElementById('dve7').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';
}

function showd8() {
    document.getElementById('dve8').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve9').style.display = 'none';

}

function show30() {
    document.getElementById('div30').style.display = 'block';
    document.getElementById('div31').style.display = 'none';

}

function show31() {
    document.getElementById('div31').style.display = 'block';
    document.getElementById('div30').style.display = 'none';

}

function show32() {
    document.getElementById('div32').style.display = 'block';

}

function show33() {
    document.getElementById('div32').style.display = 'none';

}

function show34() {
    document.getElementById('div34').style.display = 'block';

}

function show35() {
    document.getElementById('div34').style.display = 'none';
}

function show36() {
    document.getElementById('div36').style.display = 'block';
}

function show37() {
    document.getElementById('div36').style.display = 'none';
}

function show38() {
    document.getElementById('div38').style.display = 'block';
    document.getElementById('div39').style.display = 'none';
}

function show39() {
    document.getElementById('div38').style.display = 'none';
    document.getElementById('div39').style.display = 'block';
}

function show50() {
    document.getElementById('div50').style.display = 'block';
}

function show51() {
    document.getElementById('div50').style.display = 'none';
}

function showd9() {
    document.getElementById('dve9').style.display = 'block';
    document.getElementById('dve1').style.display = 'none';
    document.getElementById('dve2').style.display = 'none';
    document.getElementById('dve3').style.display = 'none';
    document.getElementById('dve4').style.display = 'none';
    document.getElementById('dve5').style.display = 'none';
    document.getElementById('dve6').style.display = 'none';
    document.getElementById('dve7').style.display = 'none';
    document.getElementById('dve8').style.display = 'none';
}


$(document).ready(function() {
    $("select").change(function() {
        $(this).find("option:selected").each(function() {
            var optionValue = $(this).attr("value");
            if (optionValue) {
                $(".box").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else {
                $(".box").hide();
            }
        });
    }).change();
});
$(document).ready(function() {
    //Horizontal Tab
    $('#parentHorizontalTab,#parentHorizontalTab2').easyResponsiveTabs({
        type: 'default', //Types: default, vertical, accordion
        width: 'auto', //auto or any width like 600px
        fit: true, // 100% fit in a container
        tabidentify: 'hor_1', // The tab groups identifier
        activate: function(event) { // Callback function if tab is switched
            var $tab = $(this);
            var $info = $('#nested-tabInfo');
            var $name = $('span', $info);
            $name.text($tab.text());
            $info.show();
        }
    });
});

$('.lang').click(function() {
    if (!$(this).hasClass('eng')) {
        $(this).removeClass('hind').addClass('eng');
    } else {
        $(this).removeClass('eng').addClass('hind');;
    }

});






$(function() {
    // Multiple images preview in browser
    var imagesPreview = function(input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function(event) {
                    $($.parseHTML('<img>')).attr('src', event.target.result).appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $('#gallery-photo-add').on('change', function() {
        imagesPreview(this, 'div.gallery');
    });
    $('#gallery-photo-add1').on('change', function() {
        imagesPreview(this, 'div.gallery1');
    });
    $('#gallery-photo-add2').on('change', function() {
        imagesPreview(this, 'div.gallery2');
    });
});

$(document).ready(function() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files2").on("change", function(e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<div><img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/></div>" +
                        "<span class=\"remove\">Remove image</span>" +
                        "</span>").insertAfter("#files2");
                    $(".remove").click(function() {
                        $(this).parent(".pip").remove();
                    });

                });
                fileReader.readAsDataURL(f);
            }
            console.log(files);
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});
$(document).ready(function() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files1").on("change", function(e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<div><img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/></div>" +
                        "<span class=\"remove\">Remove image</span>" +
                        "</span>").insertAfter("#files1");
                    $(".remove").click(function() {
                        $(this).parent(".pip").remove();
                    });

                });
                fileReader.readAsDataURL(f);
            }
            console.log(files);
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});
$(document).ready(function() {
    if (window.File && window.FileList && window.FileReader) {
        $("#files3").on("change", function(e) {
            var files = e.target.files,
                filesLength = files.length;
            for (var i = 0; i < filesLength; i++) {
                var f = files[i]
                var fileReader = new FileReader();
                fileReader.onload = (function(e) {
                    var file = e.target;
                    $("<span class=\"pip\">" +
                        "<div><img class=\"imageThumb\" src=\"" + e.target.result + "\" title=\"" + file.name + "\"/></div>" +
                        "<span class=\"remove\">Remove image</span>" +
                        "</span>").insertAfter("#files3");
                    $(".remove").click(function() {
                        $(this).parent(".pip").remove();
                    });

                });
                fileReader.readAsDataURL(f);
            }
            console.log(files);
        });
    } else {
        alert("Your browser doesn't support to File API")
    }
});
$(document).ready(function() {
    $("input[name$='bn']").click(function() {
        var radio_value = $(this).val();
        if (radio_value == '0') {
            $("#contact").fadeIn("slow");
            $("#dlcert").fadeOut("slow");
        } else if (radio_value == '1') {
            $("#dlcert").fadeIn("slow");
            $("#contact").fadeOut("slow");
        }
    });
});

var progressBar = {
    Bar : $('#progress-bar'),
    Reset : function(){
      if (this.Bar){
        this.Bar.find('li').removeClass('active'); 
      }
    },
    Next: function(){
      $('#progress-bar li:not(.active):first').addClass('active');
    },
    Back: function(){
      $('#progress-bar li.active:last').removeClass('active');
    }
  }
  
  progressBar.Reset();
  
  ////
  $("#Next").on('click', function(){
    progressBar.Next();
  })
  $("#Back").on('click', function(){
    progressBar.Back();
  })
  $("#Reset").on('click', function(){
    progressBar.Reset();
  })

  $('.scrollTo').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});
