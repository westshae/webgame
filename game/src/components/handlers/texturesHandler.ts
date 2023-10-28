import { Texture } from 'pixi.js';

const grassTexture = Texture.from('../assets/tile/grass.png');
const sandTexture = Texture.from('../assets/tile/sand.png');
const waterTexture = Texture.from('../assets/tile/water.png');
const missingTexture = Texture.from('../assets/util/missing.png');

export {
  grassTexture,
  sandTexture,
  waterTexture,
  missingTexture,
};
