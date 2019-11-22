<template>
  <g @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave">
    <path :d="dAttr" :style="pathStyle"></path>
    <a v-if="link.show.delete" @click="deleteLink">
      <text 
        text-anchor="middle" 
        :transform="arrowTransform"
        font-size="22">&times;</text>
    </a>
    <path v-else d="M -1 -1 L 0 1 L 1 -1 z"
      :style="arrowStyle"
      :transform="arrowTransform"></path>
  </g>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch  } from 'vue-property-decorator';
import {ILink} from './flowlink.type';
@Component
export default class FlowLink extends Vue {
    @Prop() link! : ILink

    get pathStyle() {
      return {
        stroke: 'rgb(255, 136, 85)',
        strokeWidth: 2.73205,
        fill: 'none',
      }
    }

    get arrowStyle() {
      return {
        stroke: 'rgb(255, 136, 85)',
        strokeWidth: 5.73205,
        fill: 'none',
      }
    }
    get arrowTransform() {
      const [arrowX, arrowY] = this.caculateCenterPoint();
      const degree = this.caculateRotation()
      return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
    }
    get dAttr() {
      let cx = this.link.start.x, cy = this.link.start.y, ex = this.link.end.x, ey = this.link.end.y;
      let x1 = cx, y1 = cy + 50, x2 = ex, y2 = ey - 50;
      return `M ${cx}, ${cy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
    }

    handleMouseOver() {
      if (this.link.id) {
        this.link.show.delete = true;
      }
    }

    handleMouseLeave() {
      this.link.show.delete = false;
    }

    caculateCenterPoint() {
      // caculate arrow position: the center point between start and end
      const dx = (this.link.end.x - this.link.start.x) / 2;
      const dy = (this.link.end.y - this.link.start.y) / 2;
      return [this.link.start.x + dx, this.link.start.y + dy];
    }
    caculateRotation() {
      // caculate arrow rotation
      const angle = -Math.atan2(this.link.end.x - this.link.start.x, this.link.end.y - this.link.start.y);
      const degree = angle * 180 / Math.PI;
      return degree < 0 ? degree + 360 : degree;
    }

    deleteLink() {
      this.$emit('deleteLink')
    }

}
</script>

<style scoped lang="scss">
g {
  cursor: pointer;
}
</style>