import { NodeAction, LinkAction, Mouse, Scene } from '../workflow.type';
import { getMousePosition } from '@/scripts/app/components/core/position';
import { INode } from '../node.type';

export class Path {
    private mouse: Mouse = new Mouse();

    /**
     * scrollingMove
     */
    public scrollingMove(el: any, e: any): [number, number] {
        return this.updateMouseMove(el, e);
    }

    /**
     * lineLinkMove
     */
    public lineLinkMove(el: any, e: any): [number, number] {
        this.saveMouseCurrentPositionWithOffset(el, e);
        return this.getMouseCurrentPosition();
    }

    /**
     * nodeMove
     */
    public nodeMove(node: INode, scale: number, el: any, e: any): [number, number] {
        let self = this;
        let diffx, diffy;
        [diffx, diffy] = this.updateMouseMove(el, e);

        let left = node.position.x + diffx / scale;
        let top = node.position.y + diffy / scale;

        return [left, top];
    }
    /**
     * updateMouseMove
     */
    public updateMouseMove(el: any, e: any): [number, number] {

        this.saveMouseCurrentPositionWithOffset(el, e);
        let diff = [this.mouse.x - this.mouse.lastX, this.mouse.y - this.mouse.lastY];
        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        return [diff[0], diff[1]];
    }


    /**
     * getMouseCurrentPosition
     */
    public getMouseCurrentPosition(): [number, number] {
        return [this.mouse.x, this.mouse.y]
    }
    /**
     * getMouseLastPosition
     */
    public getMouseLastPosition(): [number, number] {
        return [this.mouse.lastX, this.mouse.lastY]
    }

    /**
     * saveMouseCurrentPosition
     */
    public saveMouseCurrentPositionWithOffset(el: any, e: any) {
        [this.mouse.x, this.mouse.y] = getMousePosition(el, e);
    }
    /**
     * saveLastPosition
     */
    public saveMouseLastPositionWithOffset(el: any, e: any) {
        [this.mouse.lastX, this.mouse.lastY] = getMousePosition(el, e);
    }

    /**
     * saveLastPosition
     */
    public saveMouseLastPosition(e: any) {
        this.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop;
    }

}