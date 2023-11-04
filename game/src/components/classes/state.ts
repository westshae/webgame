class State {
  id: number;
  capitalId: number;
  controllerId:number | null;
  tileIds: number[];
  hexcode: number;
  decisions: string[]

  constructor(id: number, capitalId: number, controllerId: number | null, tileIds:number[], hexcode:number, decisions: string[]) {
    this.id = id;
    this.capitalId = capitalId;
    this.controllerId = controllerId;
    this.tileIds = tileIds;
    this.hexcode = hexcode;
    this.decisions = decisions;
  }

}

export { State };
