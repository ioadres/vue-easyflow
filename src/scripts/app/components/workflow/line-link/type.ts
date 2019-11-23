import {IPosition, Position} from '../../core/type';

export class Link implements ILink {

    start!: IPosition ;
    end!: IPosition;
    id!: number;
    from!: number;
    to!: number;

    constructor() {
        this.start = new Position();
        this.end = new Position();
        this.id = 0;
    }

    static fromData(data: Link) {
        return data;
    }
    
}
export interface ILink {
    start: IPosition,
    end: IPosition,
    id: number
    from: number | null,
    to: number | null
}
