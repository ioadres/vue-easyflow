export class Node implements INode {
    id: number = 0;
    position : IPosition = {
            x : 0,
            y:0
    };
    type: string = '';
    label:string = '';
    options : IOption = {
       centerX : 0,
       centerY : 0,
       scale: 0, 
       selected:0,
    };
    show: IShow = {
        delete:false
    };
  
}

export interface INode {
    id: number,
    position : IPosition,
    type: string,
    label:string,
    options : IOption,
    show: IShow
}

export interface IPosition {
    x : number,
    y: number
}

export interface IOption {
    centerX : number,
    scale:number,
    centerY:number,
    selected:number,
}

export interface IShow {
    delete: boolean
}


