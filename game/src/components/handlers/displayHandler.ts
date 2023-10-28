import { Viewport } from 'pixi-viewport';
import { game } from '../..';

class DisplayHandler{
  init(){
    document.body.style.margin = '0';
    game.app.renderer.view.style.position = 'absolute';
    game.app.renderer.view.style.display = 'block';
  
    document.body.appendChild(game.app.view);
    game.app.renderer.backgroundColor = 0x572529;

    game.app.renderer.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', (e: UIEvent) => {
      game.app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  
  
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    }) as any;
    
    game.app.stage.addChild(viewport);
    viewport.addChild(game.worldHandler.container);
  
    viewport
      .drag()
      .wheel();
  }
}

export { DisplayHandler };
