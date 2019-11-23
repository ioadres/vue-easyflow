import { INode } from './flownode/flownode.type'
import { ILink } from './line-link/type'

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

export class Scene implements IScene {
    centerX: number
    scale: number
    centerY: number
    nodes: INode[]
    links: ILink[]

    constructor() {
        this.centerX = 0;
        this.centerY = 0;
        this.nodes = [];
        this.links = [];
        this.scale = 0;
    }
}

export interface IScene {
    centerX: number,
    scale: number,
    centerY: number,
    nodes: INode[],
    links: ILink[]
}

export class Action {
    linking: boolean = false;
    dragging: number | null = null;
    scrolling: boolean = false;
    selected: number | null = null;
}

export class Mouse {
    x: number = 0;
    y: number =0;
    lastX: number = 0;
    lastY: number = 0;
}

export class RootDivOffset {
    top: number = 0;
    left: number = 0;
}

