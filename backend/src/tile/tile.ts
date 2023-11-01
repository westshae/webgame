export class Tile {
  id: number;
  x: number;
  y: number;
  q: number;
  biome: string;
  connectedTiles: number[];
  housingMax: number;
  farmlandMax: number;
  stateId: number | null;

  constructor(id: number, x: number, y: number, q: number, connectedTiles:number[], biome: string, housingMax: number, farmlandMax: number, stateId: number | null) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.q = q;
      this.connectedTiles = connectedTiles;
      this.housingMax = housingMax;
      this.biome = biome;
      this.farmlandMax = farmlandMax;
      this.stateId = stateId;
  }
}