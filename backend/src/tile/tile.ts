export class Tile {
  id: number;
  x: number;
  y: number;
  population: number;
  biome: number;

  constructor(id: number, x: number, y: number, population: number, biome: number) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.population = population;
      this.biome = biome;
  }
}