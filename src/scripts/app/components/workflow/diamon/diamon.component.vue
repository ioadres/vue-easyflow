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
    <div class="node-main" :style="nodeWidhtAndHeightStyle" >
      
      <div class="node-custom" >
        <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div class="node-port node-output" :style="nodeLeftPortStyle" @mousedown="outputMouseDownLeft"></div>
    <div
      class="node-port node-output"
      :style="nodeRightPortStyle"
      @mousedown="outputMouseDownRight"
    ></div>
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

  get nodeWidhtAndHeightStyle() {
    return {      
      width: this.node.width + "px !important",
      "height": this.node.height + "px!important"
    };
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
      width: this.node.width + "px !important",
      "min-height": this.node.height + "px!important",
      transform: `scale(${this.nodeViewScale.scale})`,
    };
  }

  get nodeRightPortStyle() {
    return {
      top: this.node.rightPort.y  + "px",
      left: this.node.rightPort.x + "px",
    };
  }

  get nodeLeftPortStyle() {
    return {
      top: this.node.leftPort.y + "px",
      left: this.node.leftPort.x + "px",
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
    this.$emit("linkingStart", this.node, "left");
    e.preventDefault();
  }

  outputMouseDownRight(e: any) {
    this.$emit("linkingStart", this.node, "right");
    e.preventDefault();
  }

  inputMouseDown(e: any) {
    e.preventDefault();
  }

  inputMouseUp(e: any) {
    this.$emit("linkingStop", this.node, "top");
    e.preventDefault();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(0, 153, 255);
$portSize: 17;

.diamond {
  position: absolute;
  text-align: center;
  z-index: 0;
}
.diamond:before {
  position: absolute;
  content: "";
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  transform: rotateX(45deg) rotateZ(45deg);
  background-color: #e4e4e4;
  border: 1px solid #e4e6eb;
  opacity: 0.9;
  z-index: -20;
}
.diamond:after {
  position: absolute;
  top: 10px;
  left: 10px;
  content: "";
  height: calc(100% - 22px);
  width: calc(100% - 22px);
  transform: rotateX(45deg) rotateZ(45deg);
  z-index: -20;
}

.diamond {
  color: rgba(0, 0, 0, 1);
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;

  cursor: move;
  transform-origin: top left;

  .node-main {
    text-align: center;

    
    .node-custom {
      margin-left: auto;
      margin-right: auto;
      position: relative;
      top: 45%;
      transform: translateY(-50%);

      .node-type {
      background: $themeColor;
      color: white;
      padding: 5px 5px;
      border-top-right-radius: 1.3em;
    }
      .node-label {
        font-size: 13px;
      }
    }
  }

  .node-main:after {
    position: absolute;
    top: 10px;
    left: 10px;
    content: "";
    height: calc(100% - 22px);
    width: calc(100% - 22px);
    z-index: 0;
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
    position: absolute;
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
  content: "";
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  transform: rotateX(45deg) rotateZ(45deg);
  box-shadow: 0 0 0 2px $themeColor;
}
</style>