import { Viewport } from 'pixi-viewport';
import { game } from '../..';

class DisplayHandler{
  init(){
    document.body.style.margin = '0';
    game.app.renderer.view.style.position = 'absolute';
    game.app.renderer.view.style.display = 'block';
  
    document.body.appendChild(game.app.view); //Adds view of app to website
    game.app.renderer.backgroundColor = 0x572529; //Changes background colour

    game.app.renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', (e: UIEvent) => {
      game.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  
  
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    }) as any;
    
    //Adds viewport to stage, then world to viewport
    game.app.stage.addChild(viewport);
    viewport.addChild(game.worldHandler.container);
  
    //Settings for camera
    viewport
      .drag() //Drag mouse to move camera
      .wheel(); //Changes scroll wheel to zoom
  
  }
}

export { DisplayHandler };
