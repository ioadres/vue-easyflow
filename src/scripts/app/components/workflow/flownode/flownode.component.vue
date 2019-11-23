
<template>
  <div
    class="flowchart-node"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeOptions.selected === node.id}"
  >
    <div class="node-port node-input" @mousedown="inputMouseDown" @mouseup="inputMouseUp"></div>
    <div class="node-main">
      <div v-text="node.type" class="node-type"></div>
      <div v-text="node.label" class="node-label"></div>
    </div>
    <div class="node-port node-output" @mousedown="outputMouseDown"></div>
    <div v-show="show.delete" class="node-delete">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { INode, Node, IOption } from "./flownode.type";
@Component({ name: "FlowNode" })
export default class FlowNode extends Vue {
  @Prop() node!: INode;
  @Prop() nodeOptions!: IOption;

  show: any = {
    delete: false
  };

  constructor() {
    super();
    this.nodeOptions.centerX = 1024;
    this.nodeOptions.scale = 1;
    this.nodeOptions.centerY = 140;
    this.node.label = "Input name";
    this.node.type = "Defailt";
  }

  get nodeStyle() {
    return {
      top:
        this.nodeOptions.centerY +
        this.node.position.y * this.nodeOptions.scale +
        "px", // remove: this.options.offsetTop +
      left:
        this.nodeOptions.centerX +
        this.node.position.x * this.nodeOptions.scale +
        "px", // remove: this.options.offsetLeft +
      transform: `scale(${this.nodeOptions.scale})`
    };
  }

  

  handleMousedown(e: any) {
    const target = e.target || e.srcElement;
    // console.log(target);
    if (
      target.className.indexOf("node-input") < 0 &&
      target.className.indexOf("node-output") < 0
    ) {
      this.$emit("nodeSelected", e);
    }
    e.preventDefault();
  }

  handleMouseOver() {
    this.show.delete = true;
  }

  handleMouseLeave() {
    this.show.delete = false;
  }

  outputMouseDown(e: any) {
    this.$emit("linkingStart");
    e.preventDefault();
  }

  inputMouseDown(e: any) {
    e.preventDefault();
  }

  inputMouseUp(e: any) {
    this.$emit("linkingStop");
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
  opacity: 0.9;
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
    top: #{-2 + $portSize/-2}px;
  }
  .node-output {
    bottom: #{-2 + $portSize/-2}px;
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
    &:hover {
      background: $themeColor;
      color: white;
    }
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>