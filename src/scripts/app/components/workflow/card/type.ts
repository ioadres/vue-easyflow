import {IPosition, Position} from './../../core/type';

export class Node implements INode {
    id: number;
    position: IPosition ;
    type: string;
    label: string;

    constructor() {
        this.id = 0;
        this.position = new Position();
        this.type = '';
        this.label ='';
    }

    static fromData(data: INode) {
        return data;
    }
}

export interface INode {
    id: number,
    position: IPosition,
    type: string,
    label: string
}


