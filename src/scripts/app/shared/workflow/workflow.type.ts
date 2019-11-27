import {INode} from './node.type'
import {ILine} from './line.type'

export class WorkFlow implements IWorkFlow {
    scene!: Scene;
    height: number = 0;
    constructor() {
        this.scene = new Scene();
    }

}
export interface IWorkFlow {
    scene: IScene,
    height: number
}

export interface IScene {
    centerX: number,
    scale: number,
    centerY: number,
    nodes: INode[],
    linesLinks: ILine[]
}

export class Scene implements IScene {
    centerX: number
    scale: number
    centerY: number
    nodes: INode[]
    linesLinks: ILine[]

    constructor() {
        this.centerX = 0;
        this.centerY = 0;
        this.nodes = [];
        this.linesLinks = [];
        this.scale = 0;
    }
}

export class LinkAction {
    isDragging: boolean = false;
    from: number = 0;
    locationPortInput:string = '';
    x: number = 0;
    y: number=0;
}

export class NodeAction {
    isDragging: boolean = false;
    isScrolling: boolean = false;
    selected: number | null = null;
}

export class Mouse {
    x: number = 0;
    y: number = 0;
    lastX: number = 0;
    lastY: number = 0;
}

export class RootDivOffset {
    top: number = 0;
    left: number = 0;
}