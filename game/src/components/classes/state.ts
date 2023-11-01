class State {
  id: number;
  capitalId: number;
  controllerId:number | null;
  tileIds: number[];
  colourId: number;


  constructor(id: number, capitalId: number, controllerId: number | null, tileIds:number[], colourId:number) {
    this.id = id;
    this.capitalId = capitalId;
    this.controllerId = controllerId;
    this.tileIds = tileIds;
    this.colourId = colourId;
  }

}

export { State };
