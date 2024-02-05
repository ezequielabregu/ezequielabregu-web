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



//-----------------------------------------------------------------------------------


//This is the script for the modal in portfolio.html (added by me 5/02/2024)
//This will scroll the modal content to the top every time an image is clicked and the modal opens. 
// Get the modal
var modal = document.getElementById("myModal");

// Fetch the content of the works.md file and convert it to HTML
var html;
fetch('content/works.md')
  .then(response => response.text())
  .then(text => {
    html = marked(text, { sanitize: false });
  });

// Get all images and add onclick event to each
var imgs = document.querySelectorAll('.myImg');
imgs.forEach(img => {
  img.onclick = function(){
    modal.style.display = "block";
    
    // Get the href attribute value (the id of the section)
    var sectionId = this.getAttribute('href').substring(1);
    
    // Parse the HTML
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    
    // Get the content of the section
    var sectionContent = getSectionContent(doc.body, 'h2[id="' + sectionId + '"]');
    
    // Insert the content into the modal
    document.getElementById('modal-content').innerHTML = sectionContent;

    // Delay the scroll to the top until after the new content is rendered
    setTimeout(function() {
      modal.scrollTop = 0;
    }, 0);

    // Get the <div> element that closes the modal
    var closeButton = document.getElementsByClassName("close-button")[0];

    // When the user clicks or touches on <div> (x), close the modal
    closeButton.addEventListener('click', closeModal);
    closeButton.addEventListener('touchend', closeModal);

    function closeModal(event) {
      event.stopPropagation();
      modal.style.display = "none";
      // Remove the event listeners to avoid multiple event handlers being attached
      closeButton.removeEventListener('click', closeModal);
      closeButton.removeEventListener('touchend', closeModal);
    }
  }
});

// Close the modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Function to get the content of a section
function getSectionContent(parent, selector) {
  var startElement = parent.querySelector(selector);
  var endElement = startElement.nextElementSibling;
  while (endElement && endElement.tagName !== 'H2') {
    endElement = endElement.nextElementSibling;
  }
  var sectionContent = '';
  var element = startElement;
  while (element && element !== endElement) {
    sectionContent += element.outerHTML;
    element = element.nextElementSibling;
  }
  return sectionContent;
}


//--------------------------------------------------------------

