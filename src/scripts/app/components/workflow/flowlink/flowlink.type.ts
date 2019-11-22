export class Link implements ILink {
    start : IPosition = {
        x:0,
        y:0
    }
    end: IPosition = {
        x:0,
        y:0
    }
    id: number = 0
    show: IShow  = {
        delete:false
    }
    from:number = 0
    to:number = 0
}
export interface ILink {
    start : IPosition,
    end: IPosition,
    id: number,
    show: IShow
    from:number | null,
    to:number| null
}

export interface IPosition {
    x : number,
    y: number
}

export interface IShow {
    delete: boolean
}

