<template>
  <g @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <path :d="lineTransform" :style="lineStyle"></path>
    <a v-if="show.delete" @click="deleteLink">
      <text text-anchor="middle" :transform="arrowTransform" font-size="22">&times;</text>
    </a>
    <path v-else d="M -1 -1 L 0 1 L 1 -1 z" :style="arrowStyle" :transform="arrowTransform"></path>
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ILine } from "./type";

@Component({ name: "LineLink" })
export default class LineLink extends Vue {
  @Prop() line!: ILine;
  show: any = {
    delete: false
  };

  get lineStyle() {
    return {
      stroke: "rgb(10, 136, 85)",
      strokeWidth: 2.73205,
      fill: "none"
    };
  }

  get arrowStyle() {
    return {
      stroke: "rgb(255, 136, 85)",
      strokeWidth: 5.73205,
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
    // caculate arrow position: the center point between start and end
    const dx = (this.line.link.end.x - this.line.link.start.x) / 2;
    const dy = (this.line.link.end.y - this.line.link.start.y) / 2;
    return [this.line.link.start.x + dx, this.line.link.start.y + dy];
  }
  caculateRotation() {
    // caculate arrow rotation
    const angle = -Math.atan2(
      this.line.link.end.x - this.line.link.start.x,
      this.line.link.end.y - this.line.link.start.y
    );
    const degree = (angle * 180) / Math.PI;
    return degree < 0 ? degree + 360 : degree;
  }

  deleteLink() {
    this.$emit("deleteLink");
  }
}
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>