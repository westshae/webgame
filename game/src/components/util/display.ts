import { Viewport } from 'pixi-viewport';
import { game } from '../..';

const displayInit = () => {
  windowSize(); //Adds events to resize application on resize
  windowHTML(); //Makes display stick to top-left corner
  document.body.appendChild(game.app.view); //Adds view of app to website
  game.app.renderer.backgroundColor = 0x572529; //Changes background colour

  //Adds viewport to stage, then world to viewport
  game.app.stage.addChild(viewport);
  viewport.addChild(game.world.container);

  //Settings for camera
  viewport
    .drag() //Drag mouse to move camera
    .wheel(); //Changes scroll wheel to zoom
};

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
}) as any;

const windowSize = () => {
  game.app.renderer.resize(window.innerWidth, window.innerHeight);
  window.addEventListener('resize', (e: UIEvent) => {
    game.app.renderer.resize(window.innerWidth, window.innerHeight);
  });
};

const windowHTML = () => {
  document.body.style.margin = '0';
  game.app.renderer.view.style.position = 'absolute';
  game.app.renderer.view.style.display = 'block';
};

export { displayInit };
