<template>
  <g @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <path :d="lineTransform" :style="lineStyle"></path>       
    <a v-if="show.delete" @click="linkDelete">
      <text text-anchor="middle" :transform="arrowTransform" font-size="32">&times;</text>
    </a>
    <path v-else d="M -1 -1 L 0 1 L 1 -1 z" :style="arrowStyle" :transform="arrowTransform"></path>
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ILine } from "./../../../shared/workflow/line.type";

@Component
export default class extends Vue {
  public Name = 'LineLink'

  @Prop() line!: ILine;
  show: any = {
    delete: false
  };

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
    let x1 = cx,
      y1 = cy + 50,
      x2 = ex,
      y2 = ey - 50;
    return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
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