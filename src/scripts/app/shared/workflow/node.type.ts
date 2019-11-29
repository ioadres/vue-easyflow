import { IPosition, Position } from './position.type'
import { LocationPort } from './enum';

export interface INode {
    id: number,
    position: IPosition,
    type: string,
    label: string,
    width:number,
    height:number,
    leftPort:IPosition;
    rightPort:IPosition;
    centerPort:IPosition;
    custom:any;

    getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number];
}

export interface INodeViewScale {
    centerX: number,
    scale: number,
    centerY: number,
    selected: number | null,
}


export class Node implements INode {
    id: number;
    position: IPosition;
    type: string;
    label: string;    
    width:number;
    height:number;
    leftPort:IPosition;
    rightPort:IPosition;
    centerPort:IPosition;
    custom:any;

    constructor(id: number | null) {
        this.id = id!;
        this.position = {
            x: 0,
            y: 0
        };
        this.type = '';
        this.label = '';
        this.width = 0;
        this.height = 0;
        this.leftPort = new Position();
        this.rightPort =  new Position();
        this.centerPort =  new Position();
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        return [0, 0];
    }

    static fromData(data: INode) {
        return data;
    }
}


export class Diamon extends Node implements INode {

    constructor(id: number | null) {
        super(id);        
        this.width = 150;
        this.height = 150;

        var leftProportional = this.width * 40 / 200;
        var rightProportional = this.width * 40 / 200;

        this.leftPort.x = -leftProportional;        
        this.leftPort.y = this.height/2 -5;
        this.rightPort.x = this.width + rightProportional;        
        this.rightPort.y = this.height/2 - 5;  
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        let x = centerX + this.position.x * scale;
        let y = centerY + this.position.y * scale;
        var leftProportional = (this.width * 40  * scale)/ 200;
        var rightProportional = (this.width * 40 * scale) / 200;

        if (typePort === LocationPort.Top) {
            return [x + (this.width*scale)/2, y];
        }        
        if (typePort === LocationPort.Left) {
            return [x - leftProportional, y + (this.height * scale) / 2];
        }
        if (typePort === LocationPort.Right) {
            return [x + (this.width*scale) + rightProportional, y + this.height*scale/2];
        }
        return [0, 0];
    }
}

export class General extends Node implements INode {

    constructor(id: number | null) {
        super(id);        
        this.width = 200;
        this.height = 100;
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        let x = centerX + this.position.x * scale;
        let y = centerY + this.position.y * scale;

        if (typePort === LocationPort.Top) {
            return [x + (this.width*scale)/2, y];
        }
        if (typePort === LocationPort.Bottom) {
            return [x + (this.width*scale)/2, y + (this.height * scale)];
        }
        return [0, 0];
    }
}

export class PointStart extends Node implements INode {

    constructor(id: number | null) {
        super(id);        
        this.width = 100;
        this.height = 100;
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        let x = centerX + this.position.x * scale;
        let y = centerY + this.position.y * scale;

        if (typePort === LocationPort.Center) {
            return [x + (this.width*scale)/2, y + (this.height * scale)];
        }
        return [0, 0];
    }
}

export class PointEnd extends Node implements INode {

    constructor(id: number | null) {
        super(id);        
        this.width = 100;
        this.height = 100;
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        let x = centerX + this.position.x * scale;
        let y = centerY + this.position.y * scale;

        if (typePort === LocationPort.Top) {
            return [x + (this.width*scale)/2, y];
        }
        return [0, 0];
    }
}


export class Action extends Node implements INode {
    constructor(id: number | null) {
        super(id);        
        this.width = 300;
        this.height = 100;

        this.rightPort.x = this.width;     
        this.rightPort.y = this.height/2 - 10;
    }

    public getPositionNodePort(centerX: number, centerY: number, typePort: string, scale : number): [number, number] {
        let x = centerX + this.position.x * scale;
        let y = centerY + this.position.y * scale;

        if (typePort === LocationPort.Top) {
            return [x + (this.width*scale)/2, y];
        }
        if (typePort === LocationPort.Bottom) {
            return [x + (this.width*scale)/2, y + (this.height * scale)];
        }
        if (typePort === LocationPort.Right) {
            return [x + (this.width*scale), y + this.height*scale/2];
        }
        return [0, 0];
    }
}

export class LabelText extends Node implements INode {
    constructor(id: number | null) {
        super(id);        
        this.width = 100;
        this.height = 20;
    }
}
