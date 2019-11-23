export class Node implements INode {
    id: number = 0;
    position: IPosition = {
        x: 0,
        y: 0
    };
    type: string = '';
    label: string = '';
    static fromData(data: Node) {
        return data;
    }
}

export interface INode {
    id: number,
    position: IPosition,
    type: string,
    label: string
}

export interface IPosition {
    x: number,
    y: number
}

export class Option implements IOption {
    centerX = 0
    scale = 0
    centerY = 0
    selected = 0
}


export interface IOption {
    centerX: number,
    scale: number,
    centerY: number,
    selected: number | null,
}

