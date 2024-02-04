// Toggle Menu
$(window).load(function() {
  $(".btn-nav").on("click tap", function() {
    $(".nav-content").toggleClass("showNav hideNav").removeClass("hidden");
    $(this).toggleClass("animated");
  });
});


// Filtered Portfolio

var shuffleme = (function( $ ) {
  'use strict';
  var $grid = $('#grid'), //locate what we want to sort 
      $filterOptions = $('.portfolio-sorting li'),  //locate the filter categories
      $sizer = $grid.find('.shuffle_sizer'),    //sizer stores the size of the items

  init = function() {

    // None of these need to be executed synchronously
    setTimeout(function() {
      listen();
      setupFilters();
    }, 100);

    // instantiate the plugin
    $grid.shuffle({
      itemSelector: '[class*="col-"]',
      sizer: $sizer    
    });
  },

      

// Set up button clicks
  setupFilters = function() {
    var $btns = $filterOptions.children();
    $btns.on('click', function(e) {
      e.preventDefault();
      var $this = $(this),
          isActive = $this.hasClass( 'active' ),
          group = isActive ? 'all' : $this.data('group');

      // Hide current label, show current label in title
      if ( !isActive ) {
        $('.portfolio-sorting li a').removeClass('active');
      }

      $this.toggleClass('active');

      // Filter elements
      $grid.shuffle( 'shuffle', group );
    });

    $btns = null;
  },



  listen = function() {
    var debouncedLayout = $.throttle( 300, function() {
      $grid.shuffle('update');
    });

    // Get all images inside shuffle
    $grid.find('img').each(function() {
      var proxyImage;

      // Image already loaded
      if ( this.complete && this.naturalWidth !== undefined ) {
        return;
      }

      // If none of the checks above matched, simulate loading on detached element.
      proxyImage = new Image();
      $( proxyImage ).on('load', function() {
        $(this).off('load');
        debouncedLayout();
      });

      proxyImage.src = this.src;
    });

    setTimeout(function() {
      debouncedLayout();
    }, 500);
  };      

  return {
    init: init
  };
}( jQuery ));

$(document).ready(function()
{
  shuffleme.init(); //filter portfolio
});



// Redirect to another page after clicking on a link (added by me on 2020-04-20)
document.addEventListener('DOMContentLoaded', (event) => {
  const links = document.querySelectorAll('[data-redirect]');
  links.forEach(link => {
      link.addEventListener('click', function(e) {
          e.preventDefault();
          setTimeout(function() {
              window.location.href = link.getAttribute('data-redirect');
          }, 1000); // Delay of 1 second
      });
  });
});



// Change the section indicator based on the current section (added by me on 2020-04-20)
window.addEventListener('scroll', function() {
  var indicator = document.getElementById('section-indicator');
  var sections = document.querySelectorAll('h2');
  var currentSection = '';

  for (var i = 0; i < sections.length; i++) {
    var rect = sections[i].getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      currentSection = '';
    } else if (rect.bottom < 0) {
      currentSection = sections[i].id;
    }
  }

  // Replace dashes with spaces and capitalize the first letter of each word
  currentSection = currentSection.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  indicator.textContent = currentSection;
});