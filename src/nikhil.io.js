import Particles from 'particlesjs';
import ua from 'universal-ga';
import './nikhil.io.sass';

const googleAnalyticsToken = 'UA-88882746-1';

window.onload = () => {
  Particles.init({
    color: '#ffff4e',
    connectParticles: true,
    maxParticles: 90,
    selector: '.background',
    responsive: [
      {
        breakpoint: 640,
        options: {
          maxParticles: 25,
        },
      },
      {
        breakpoint: 900,
        options: {
          maxParticles: 50,
        },
      },
    ],
  });

  ua.initialize(googleAnalyticsToken);
  ua.pageview('/');
};
