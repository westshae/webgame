class State {
  id: number;
  capitalId: number;
  controllerId:number | null;
  tileIds: number[];
  colourId: number;
  decisions: string[]

  constructor(id: number, capitalId: number, controllerId: number | null, tileIds:number[], colourId:number, decisions: string[]) {
    this.id = id;
    this.capitalId = capitalId;
    this.controllerId = controllerId;
    this.tileIds = tileIds;
    this.colourId = colourId;
    this.decisions = decisions;
  }

}

export { State };
