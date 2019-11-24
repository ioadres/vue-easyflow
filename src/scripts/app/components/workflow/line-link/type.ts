import {IPosition, Position} from '../../core/type';

export interface ILine {
    id: number
    from: number | null,
    to: number | null,
    link: ILink
}

export interface ILink {
    start: IPosition,
    end: IPosition    
}

export class Line implements ILine{
    id!: number;
    from!: number;
    to!: number;
    link!: ILink;

    constructor() {
        this.id = 0;
        this.link = new Link()
    }

    static fromData(data: Link) {
        return data;
    }
}


export class Link implements ILink {

    start!: IPosition ;
    end!: IPosition;

    constructor() {
        this.start = new Position();
        this.end = new Position();
    }

    static fromData(data: Link) {
        return data;
    }
    
}