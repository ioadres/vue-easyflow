
<template>
  <div class="flowchart-node" :style="nodeStyle" 
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: node.options.selected === node.id}">
    <div class="node-port node-input"
       @mousedown="inputMouseDown"
       @mouseup="inputMouseUp">
    </div>
    <div class="node-main">
      <div v-text="node.type" class="node-type"></div>
      <div v-text="node.label" class="node-label"></div>
    </div>
    <div class="node-port node-output" 
      @mousedown="outputMouseDown">
    </div>
    <div v-show="node.show.delete" class="node-delete">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch  } from 'vue-property-decorator';
import {INode, Node} from './flownode.type';
@Component
export default class FlowNode extends Vue {
    @Prop() node: INode = new Node()
 
    get nodeStyle() {
          return {
            top: this.node.options.centerY + this.node.position.y * this.node.options.scale + 'px', // remove: this.options.offsetTop + 
            left: this.node.options.centerX + this.node.position.x * this.node.options.scale + 'px', // remove: this.options.offsetLeft + 
            transform: `scale(${this.node.options.scale})`,
          }
        }

 constructor() {
   super();
   this.node.options.centerX = 1024;
   this.node.options.scale = 1;
   this.node.options.centerY = 140;
 }
    handleMousedown(e: any) {
      const target = e.target || e.srcElement;
      // console.log(target);
      if (target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
        this.$emit('nodeSelected', e);
      }
      e.preventDefault();
    }
    handleMouseOver() {
      this.node.show.delete = true;
    }
    handleMouseLeave() {
      this.node.show.delete = false;
    }
    outputMouseDown(e: any) {
      this.$emit('linkingStart')
      e.preventDefault();
    }
    inputMouseDown(e: any) {
      e.preventDefault();
    }
    inputMouseUp(e: any) {
      this.$emit('linkingStop')
      e.preventDefault();
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(255, 136, 85);
$portSize: 12;
.flowchart-node {
  margin: 0;
  width: 80px;
  height: 80px;
  position: absolute;
  box-sizing: border-box;
  border: none;
  background: white;
  z-index: 1;
  opacity: .9;
  cursor: move;
  transform-origin: top left;
  .node-main {
    text-align: center;
    .node-type {
      background: $themeColor;
      color: white;
      font-size: 13px;
      padding: 6px;
    }
    .node-label {
      font-size: 13px;
    }
  }
  .node-port {
    position: absolute;
    width: #{$portSize}px;
    height: #{$portSize}px;
    left: 50%;
    transform: translate(-50%);
    border: 1px solid #ccc;
    border-radius: 100px;
    background: white;
    &:hover {
      background: $themeColor;
      border: 1px solid $themeColor;
    }
  }
  .node-input {
    top: #{-2+$portSize/-2}px;
  }
  .node-output {
    bottom: #{-2+$portSize/-2}px;
  }
  .node-delete {
    position: absolute;
    right: -6px;
    top: -6px;
    font-size: 12px;
    width: 12px;
    height: 12px;
    color: $themeColor;
    cursor: pointer;
    background: white;
    border: 1px solid $themeColor;
    border-radius: 100px;
    text-align: center;
    &:hover{
      background: $themeColor;
      color: white;
    }
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>