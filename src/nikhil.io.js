require('./nikhil.io.sass');

// I REQUIRE ALL THESE THINGS.
require('jquery.backstretch');
const Instafeed = require('instafeed.js');
const ProgressBar = require('progressbar.js');
const tinycolor = require('tinycolor2');
const ColorThief = require('color-thief/js/color-thief');
const Analytics = require('universal-ga');

// Set up Google Analytics
Analytics.initialize('UA-88882746-1');
Analytics.pageview('/');

// Rotate background and colors after these many milliseconds
const timeoutDuration = 4000;

const rgbaFromColor = (tinyColorObject, opacity) => `rgba(
  ${Math.round(tinyColorObject._r)},
  ${Math.round(tinyColorObject._g)},
  ${Math.round(tinyColorObject._b)},
  ${opacity}
)`;

window.onload = () => {
  let reverseSpin = false;

  const backgroundImage = new Image(); backgroundImage.crossOrigin = 'anonymous';
  const colorThief = new ColorThief();

  const bar = new ProgressBar.Circle('#countdown', {
    strokeWidth: 25,
    trailWidth: 10,
    trailColor: '#FF3300',
    easing: 'easeInOut',
    duration: timeoutDuration,
  });

  const userFeed = new Instafeed({
    get: 'user',
    userId: '964162',
    accessToken: '964162.cf1e7d8.777feff80324427c8dcda940423b2c44',
    mock: true,

    error: (message) => {
      console.error(message);
      $('#countdown').hide();
      $('#real-o').show();
      $('#instagram a').hide();
      return $('#instagram span').show();
    },

    success: (response) => {
      let i = 0;

      const cycleImages = () => {
        const instagramImage = response.data[i];
        backgroundImage.src = instagramImage.images.standard_resolution.url;

        backgroundImage.onload = () => {
          const dominantColor = colorThief.getColor(backgroundImage);
          const colors = {
            r: dominantColor[0],
            g: dominantColor[1],
            b: dominantColor[2],
          };
          const headingColor = tinycolor(colors).complement().saturate(100).brighten(50);
          const paragraphColor = tinycolor(colors).complement().lighten(100);
          const linkColor = tinycolor(colors).saturate(100).brighten(50);
          const borderColor = rgbaFromColor(linkColor, 0.25);

          // Instagram link at bottom right
          $('#instagram a').show().attr('href', instagramImage.link);
          if (instagramImage.location) {
            $('#instagram a').text(instagramImage.location.name);
          }

          // Heading
          $('h1').css({ color: headingColor });
          $('#countdown svg path:nth-child(1)').attr('stroke', linkColor);
          $('#countdown svg path:nth-child(2)').attr('stroke', headingColor);

          // Body text
          $('p').css({ color: paragraphColor });
          $('#heart svg path').css({ fill: headingColor });
          $('#iowa svg polyline').css({ fill: linkColor });

          // Navigation
          $('#container a').css({
            color: linkColor,
            'border-bottom': `3px solid ${borderColor}`,
          });
          $('#container a').mouseenter = () => $(this).css({ 'border-bottom-color': linkColor });
          $('#container a').mouseleave = () => $(this).css({ 'border-bottom-color': borderColor });

          if (reverseSpin) {
            bar.set(0);
            return bar.animate(1.0);
          }
          bar.set(-1);
          return bar.animate(0.0);
        };

        $('#background').backstretch(
          instagramImage.images.standard_resolution.url,
          { fade: 'slow' },
        );

        i += 1;
        if (i >= response.data.length - 1) {
          i = 0;
        }

        reverseSpin = !reverseSpin;
        return setTimeout(cycleImages, timeoutDuration);
      };

      return cycleImages();
    },
  });

  return userFeed.run();
};
