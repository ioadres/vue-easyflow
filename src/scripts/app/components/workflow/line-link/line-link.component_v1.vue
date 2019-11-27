<template>
  <g
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    @mousemove="inputMouseUpStartMove"
  >
    <path :d="lineTransform" :style="lineStyle"></path>
    <circle id="c1" :cx="linePointCircleStartX" :cy="linePointCircleStartY" r="8" 
      @mousedown="outputMouseDownStart" 
    @mouseup="inputMouseUpStart"/>
    <circle id="c1" :cx="linePointCircleEndX" :cy="linePointCircleEndY" r="8" />
    <path
      :d="linePointStartTransform"
      :style="lineCurvePointStyle"
    />
    <path :d="linePointEndTransform" :style="lineCurvePointStyle" />

    <a v-if="show.delete" @click="linkDelete">
      <text text-anchor="middle" :transform="arrowTransform" font-size="32">&times;</text>
    </a>
    <path v-else d="M -1 -1 L 0 1 L 1 -1 z" :style="arrowStyle" :transform="arrowTransform"></path>
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ILine } from "./../../../shared/workflow/line.type";
import { getMousePosition } from "../../core/position";
import { Mouse } from "../../../shared/workflow/workflow.type";

@Component
export default class extends Vue {
  public Name = "LineLink";

  @Prop() line!: ILine;
  show: any = {
    delete: false
  };
  public pointStartLinkEditableIsDrag: boolean = false;
  public pointEndLinkEditableIsDrag: boolean = false;
  public mouse: Mouse = new Mouse();

  constructor() {
    super();
  }

  get lineStyle() {
    return {
      stroke: "rgb(112, 119, 122)",
      strokeWidth: 3.73205,
      fill: "none"
    };
  }

  get arrowStyle() {
    return {
      stroke: "rgb(0, 153, 255)",
      strokeWidth: 8.73205,
      fill: "none"
    };
  }
  get arrowTransform() {
    const [arrowX, arrowY] = this.caculateCenterPoint();
    const degree = this.caculateRotation();
    return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
  }
  get lineTransform() {
    let cx = this.line.link.start.x,
      cy = this.line.link.start.y,
      ex = this.line.link.end.x,
      ey = this.line.link.end.y;
    let x1 = cx + this.line.link.circlePointEditable.x,
      y1 = cy + this.line.link.circlePointEditable.y,
      x2 = ex,
      y2 = ey;
    return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
  }
  get linePointStartTransform() {
    let cx = this.line.link.start.x,
      cy = this.line.link.start.y,
      ex = this.line.link.start.x,
      ey = this.line.link.start.y;
    let x1 = cx,
      y1 = cy,
      x2 = cx + 10,
      y2 = ey + 150;
    return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
  }

  get linePointEndTransform() {
    let cx = this.line.link.end.x,
      cy = this.line.link.end.y,
      ex = this.line.link.end.x,
      ey = this.line.link.end.y;
    let x1 = cx + 10,
      y1 = cy - 150,
      x2 = cx,
      y2 = ey;
    return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
  }

  get linePointCircleEndX() {
    return this.line.link.end.x + 5;
  }
  get linePointCircleEndY() {
    return this.line.link.end.y - 75;
  }

  get linePointCircleStartX() {
    return this.line.link.start.x + 5 + this.line.link.circlePointEditable.x;
  }
  get linePointCircleStartY() {
    return this.line.link.start.y + 75 + this.line.link.circlePointEditable.y;
  }

  get lineCurvePointStyle() {
    return {
      stroke: "rgb(112, 119, 122)",
      strokeWidth: 1.73205,
      fill: "none",
      "stroke-dasharray": 4
    };
  }

  handleMouseOver() {
    if (this.line.id) {
      this.show.delete = true;
    }
  }

  handleMouseLeave() {
    this.show.delete = false;
  }

  caculateCenterPoint() {
    const dx = (this.line.link.end.x - this.line.link.start.x) / 2;
    const dy = (this.line.link.end.y - this.line.link.start.y) / 2;
    return [this.line.link.start.x + dx, this.line.link.start.y + dy];
  }
  caculateRotation() {
    const angle = -Math.atan2(
      this.line.link.end.x - this.line.link.start.x,
      this.line.link.end.y - this.line.link.start.y
    );
    const degree = (angle * 180) / Math.PI;
    return degree < 0 ? degree + 360 : degree;
  }

  outputMouseDownStart(e: any) {
    this.$emit("stopDrag");
    this.pointStartLinkEditableIsDrag = true;
    [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
    e.preventDefault();
  }

  inputMouseUpStartMove(e: any) {
    if(this.pointStartLinkEditableIsDrag) {
    [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
    this.line.link.circlePointEditable.x = this.mouse.x - this.mouse.lastX;
    this.line.link.circlePointEditable.y = this.mouse.y - this.mouse.lastY;
    }
    e.preventDefault();
  }

  inputMouseUpStart(e: any) {
    this.$emit("startDrag");
    this.pointStartLinkEditableIsDrag  =false;
    e.preventDefault();
  }

  outputMouseDownEnd(e: any) {
    e.preventDefault();
  }

  linkDelete() {
    this.$emit("linkDelete");
  }
}
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>