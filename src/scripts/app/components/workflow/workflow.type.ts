import {INode} from './flownode/flownode.type'
import {ILink} from './flowlink/flowlink.type'

export interface IWorkFlow {
    scene : IScene,
    height: number,
    draggingLink : any,
    action :IAction,
    mouse : IMouse,
    rootDivOffset : IRootDivOffset
}

export interface IScene {
    centerX : number,
    scale:number,
    centerY:number,
    nodes : INode[],    
    links : ILink[]
}

export interface IAction {
    linking : boolean,
    dragging: number | null,
    scrolling: boolean,
    selected: number| null,
}

export interface IMouse {
    x: number,
    y: number,
    lastX: number,
    lastY:number
}

export interface IRootDivOffset {
    top: number,
    left:number
}

