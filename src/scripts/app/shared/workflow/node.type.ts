import {IPosition} from './position.type'

export interface INode {
    id: number,
    position: IPosition,
    type: string,
    label: string
}

export interface INodeViewScale {
    centerX: number,
    scale: number,
    centerY: number,
    selected: number | null,
}


export class Node implements INode {
    id: number;
    position: IPosition ;
    type: string;
    label: string;

    constructor(id : number | null) {
        this.id = id!;
        this.position = {
            x : 0,
            y:0
        };
        this.type = '';
        this.label ='';
    }

    static fromData(data: INode) {
        return data;
    }
}
