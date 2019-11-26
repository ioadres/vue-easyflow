<template>
  <div
    class="diamond"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeViewScale.selected === node.id}"
  >
    <div class="node-port node-input" @mousedown="inputMouseDown" @mouseup="inputMouseUp"></div>
    <div class="node-main">
      <div v-text="node.type" class="node-type"></div>
      <div clas="node-custom">
      <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div class="node-port node-output node-output-left" @mousedown="outputMouseDownLeft"></div>
    <div class="node-port node-output node-output-right" @mousedown="outputMouseDownRight"></div>
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { INode, INodeViewScale } from "./../../../shared/workflow/node.type";

@Component
export default class extends Vue {
  public name = "Diamond";

  @Prop() node!: INode;
  @Prop() nodeViewScale!: INodeViewScale;

  public show: any = {
    delete: false
  };

  constructor() {
    super();
  }

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
      transform: `scale(${this.nodeViewScale.scale})`
    };
  }

  deleteHandleUp(e: any) {
    this.$emit("handleNodeEntrydelete", this.node, e);
  }

  handleMousedown(e: any) {
    const target = e.target || e.srcElement;
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

  outputMouseDownLeft(e: any) {
    this.$emit("linkingStart",this.node, "left");
    e.preventDefault();
  }

  outputMouseDownRight(e: any) {
    this.$emit("linkingStart",this.node, "right");
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
$themeColor: rgb(0, 153, 255);
$portSize: 12;

.diamond {
  position: absolute;
  height: 200px;
  width: 200px;
  text-align: center;
  margin: 10px 40px;
}
.diamond:before {
  position: absolute;
  content: '';
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  transform: rotateX(45deg) rotateZ(45deg);
  box-shadow: 0px 0px 12px gray;
}
.diamond:after {
  position: absolute;
  top: 10px;
  left: 10px;
  content: '';
  height: calc(100% - 22px);  /* -22px is 2 * 10px gap on either side - 2px border on either side */
  width: calc(100% - 22px);  /* -22px is 2 * 10px gap on either side - 2px border on either side */
  transform: rotateX(45deg) rotateZ(45deg);
}

.diamond {
  
  color: rgba(0, 0, 0, 1);
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
  z-index: 1;
  opacity: 0.9;
  cursor: move;
  transform-origin: top left;
  
  .node-main {
    text-align: center;
    
    .node-type {       
      padding: 6px 12px;      
    }
    .node-custom {
      padding: 6px 12px;
      .node-label {
        font-size: 13px;
      }
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
  .node-output-left {
    position: absolute;
    left: -40px;
    top: 91px;
  }

  .node-output-right {    
    position: absolute;
    top: 91px;
    left: 241px;
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
.selected:before {
   position: absolute;
  content: '';
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  transform: rotateX(45deg) rotateZ(45deg);
  box-shadow: 0 0 0 2px $themeColor;
}
</style>