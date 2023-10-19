import { nodeInterface } from '../world/node';

const tree: nodeInterface = {
  processingTime: 2,
  defense: 0,
  type: 0,
};

const ore: nodeInterface = {
  processingTime: 2,
  defense: 0,
  type: 1,
};

const fruit: nodeInterface = {
  processingTime: 3,
  defense: 0,
  type: 2,
};

const chest: nodeInterface = {
  processingTime: 1,
  defense: 0,
  type: 6,
};

export { tree, ore, fruit, chest };
