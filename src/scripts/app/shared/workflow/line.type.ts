import {IPosition} from './position.type'

export interface ILine {
    id: number
    from: number | null,
    fromPort: string | null,
    to: number | null,
    toPort: string | null,
    link: ILink,    
    type: string;
}

export interface ILink {
    start: IPosition,
    end: IPosition    
}

export class Line implements ILine{
    id!: number;
    from!: number;
    fromPort!: string;
    to!: number;
    toPort!: string;
    link!: ILink;    
    type!: string;

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
        this.start = {
            x : 0,
            y:0
        };
        this.end = {
            x : 0,
            y:0
        };
    }

    static fromData(data: Link) {
        return data;
    }
    
}