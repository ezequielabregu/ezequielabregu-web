
// Toggle collapsed Menu Vanilla JS
window.addEventListener('load', function() {
  var btnNav = document.querySelector('.btn-nav');
  btnNav.addEventListener('click', function() {
    var navContent = document.querySelector('.nav-content');
    navContent.classList.toggle('showNav');
    navContent.classList.toggle('hideNav');
    navContent.classList.remove('hidden');
    this.classList.toggle('animated');
  });
});

//----------------------------------------------------------------------------------




//----------------------------------------------------------------------------------

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

// Create a new event
var contentLoadedEvent = new Event('contentLoaded');

// Fetch the content of the works.html file
var html;
fetch('../content/works.html')
  .then(response => response.text())
  .then(text => {
    html = text;

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
        var modalContent = document.getElementById('modal-content');
        modalContent.innerHTML = sectionContent;
      
        // Translate the modal content
        var selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        loadTranslations(selectedLanguage, modalContent);
      
        // Initialize WaveSurfer if the waveform div exists in the modal content
        initializeWaveSurfer();
      
        // Delay the scroll to the top until after the new content is rendered
        setTimeout(function() {
          modal.scrollTop = 0;
        }, 0);
      
        // Get the <div> element that closes the modal
        var closeButton = document.getElementsByClassName("close-button")[0];
      
        // When the user clicks or touches on <div> (x), close the modal
        closeButton.addEventListener('click', closeModal);
        closeButton.addEventListener('touchstart', closeModal);
      
        function closeModal(event) {
          event.preventDefault();
          event.stopPropagation();
          modal.style.display = "none";
          // Remove the event listeners to avoid multiple event handlers being attached
          closeButton.removeEventListener('click', closeModal);
          closeButton.removeEventListener('touchstart', closeModal);
        }
      }
    });

    // Dispatch the event
    window.dispatchEvent(contentLoadedEvent);
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

// open a modal directly from the URL, to use JavaScript to parse the URL, 
//extract the anchor link, and then programmatically open the corresponding modal.
window.onload = function() {
  window.addEventListener('contentLoaded', function() {
      var hash = window.location.hash;
      if (hash) {
          var img = document.querySelector('.myImg[href="' + hash + '"]');
          if (img) {
              img.click();
          }
      }
  });
};

//--------------------------------------------------------------------------------

//Wavesurfer script
//This function is called inside the script for modals. Delete if not needed into the modal script
// Use pre generated audio peaks. More info: https://wavesurfer.xyz/faq/
function initializeWaveSurfer() {
  // Check if the #waveform element exists
  var waveformDiv = document.getElementById('waveform');
  if (waveformDiv) {
    // Initialize WaveSurfer
    var wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgba(0, 0, 0, 1)',
      progressColor: 'rgba(0, 0, 0, 0.3)',
      backend: 'MediaElement',
    
      barWidth: 1, // Set a bar width
      barGap: 1,  // Optionally, specify the spacing between bars
      barRadius: 2,// And the bar radius
    });

    // Get the JSON file path from the data-json attribute
    var jsonFilePath = waveformDiv.getAttribute('data-json');
    // Get the AUDIO file path from the audiofile attribute
    var audiofilePath = waveformDiv.getAttribute('audiofile');

    fetch(jsonFilePath)
    .then(response => response.json())
    .then(data => {
      wavesurfer.load(audiofilePath, data.data);
    });

    // Current time & duration
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
      const secondsRemainder = Math.round(seconds) % 60
      const paddedSeconds = `0${secondsRemainder}`.slice(-2)
      return `${minutes}:${paddedSeconds}`
    }

    const timeEl = document.querySelector('#time')
    const durationEl = document.querySelector('#duration')
    wavesurfer.on('audioprocess', (currentTime) => (timeEl.textContent = formatTime(currentTime)))
    wavesurfer.on('ready', (duration) => (durationEl.textContent = formatTime(wavesurfer.getDuration())))

    // Interaction with the play/pause button
    // Add event listener to the play/pause button
    var playPauseButton = document.getElementById('playPauseButton');
    var playPauseIcon = document.getElementById('playPauseIcon');
    playPauseButton.addEventListener('click', function() {
      if (wavesurfer.isPlaying()) {
        wavesurfer.pause();
        playPauseIcon.className = 'bi bi-play-fill'; // Change to play icon
      } else {
        wavesurfer.play();
        playPauseIcon.className = 'bi bi-pause-fill'; // Change to pause icon
      }
    });
  }
}
//--------------------------------------------------------------------------------

// Language switcher

function loadTranslations(lang, parent = document) {
  fetch(`../lang/${lang}.json`)
    .then(response => response.json())
    .then(translations => {
      parent.querySelectorAll('[data-translate]').forEach(element => {
        const keys = element.dataset.translate.split(':');
        let text = translations;
        keys.forEach(key => {
          text = text[key];
        });
        element.textContent = text;
      });
      // Show the content after the translations have been loaded
      if (parent === document) {
        document.body.style.visibility = 'visible';
      }
    });
}

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', event => {
    event.preventDefault();
    const lang = event.target.dataset.lang;
    loadTranslations(lang);
    document.getElementById('dropdownMenuButtonDesktop').textContent = event.target.textContent;
    document.getElementById('dropdownMenuButtonMobile').textContent = event.target.textContent;
    localStorage.setItem('selectedLanguage', lang);
  });
});

// Hide the content until the translations have been loaded
document.body.style.visibility = 'hidden';

const selectedLanguage = localStorage.getItem('selectedLanguage') || 'en';
loadTranslations(selectedLanguage);
document.getElementById('dropdownMenuButtonDesktop').textContent = selectedLanguage.toUpperCase();
document.getElementById('dropdownMenuButtonMobile').textContent = selectedLanguage.toUpperCase();