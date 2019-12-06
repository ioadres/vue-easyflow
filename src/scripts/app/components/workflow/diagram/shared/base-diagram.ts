
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { INodeViewScale, INode } from '@/scripts/app/shared/workflow/node.type';
import { LocationPort } from "../../../../shared/workflow/enum";

@Component
export default class BaseDiagram extends Vue {
    @Prop() node!: INode;
    @Prop() nodeViewScale!: INodeViewScale;

    public show: any = {
        delete: false
    };

    get nodeStyle() {
        return {
            top:
                this.nodeViewScale.centerY +
                this.node.position.y * this.nodeViewScale.scale +
                "px",
            left:
                this.nodeViewScale.centerX +
                this.node.position.x * this.nodeViewScale.scale +
                "px",
            transform: `scale(${this.nodeViewScale.scale})`,
            "width": this.node.width + "px",
            "min-height": this.node.height + "px"
        };
    }

    get nodeWithoutWidthAndHeightStyle() {
        return {
            top:
                this.nodeViewScale.centerY +
                this.node.position.y * this.nodeViewScale.scale +
                "px",
            left:
                this.nodeViewScale.centerX +
                this.node.position.x * this.nodeViewScale.scale +
                "px",
            transform: `scale(${this.nodeViewScale.scale})`
        };
    }

    get nodeRightPortStyle() {
        return {
            top: this.node.rightPort.y + "px",
            left: this.node.rightPort.x + "px"
        };
    }

    get nodeLeftPortStyle() {
        return {
            top: this.node.leftPort.y + "px",
            left: this.node.leftPort.x + "px"
        };
    }

    get nodeCenterPortStyle() {
        return {
            top: this.node.centerPort.y + "px",
            left: this.node.centerPort.x + "px"
        };
    }    

    handleMouseOver() {
        this.show.delete = true;
    }

    handleMouseLeave() {
        this.show.delete = false;
    }

    inputMouseDown(e: any) {
        e.preventDefault();
    }

    @Emit("nodedelete")
    deleteHandleUp(e: any) {
        return this.node,e;
    }
    
    @Emit("nodeSelected")
    handleMousedown(e: any) {
        const target = e.target || e.srcElement;
        if (
            target.className.indexOf("node-input") < 0 &&
            target.className.indexOf("node-output") < 0
        ) {
            return e;
        }
        e.preventDefault();
    }

    inputMouseUp(e: any) {
        this.$emit("linkingStop", this.node, LocationPort.Top);
        e.preventDefault();
    }

    outputMouseDown(e: any) {
        this.$emit("linkingStart", this.node, LocationPort.Bottom);
        e.preventDefault();
    }

    outputMouseDownLeft(e: any) {
        this.$emit("linkingStart", this.node, LocationPort.Left);
        e.preventDefault();
    }

    outputMouseDownRight(e: any) {
        this.$emit("linkingStart", this.node, LocationPort.Right);
        e.preventDefault();
    }

    outputMouseDownCenter(e: any) {
        this.$emit("linkingStart", this.node, LocationPort.Center);
        e.preventDefault();
    }
}