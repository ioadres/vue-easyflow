<template>
  <div
    class="diamond flowchart-node-container"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeViewScale.selected === node.id}"
  >
    <div class="node-port node-input" @mousedown="inputMouseDown" @mouseup="inputMouseUp"></div>
    <div class="node-main" :style="nodeWidhtAndHeightStyle">
      <div class="node-custom">
        <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div
      class="node-port node-output node-port-left"
      :style="nodeLeftPortStyle"
      @mousedown="outputMouseDownLeft"
    ></div>
    <div
      class="node-port node-output node-port-right"
      :style="nodeRightPortStyle"
      @mousedown="outputMouseDownRight"
    ></div>
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BaseDiagram from "../shared/base-diagram";

@Component
export default class extends BaseDiagram implements Vue {
  public name = "Diamond";

  constructor() {
    super();
  }

  get nodeWidhtAndHeightStyle() {
    return {
      width: this.node.width + "px !important",
      height: this.node.height + "px!important"
    };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../../../../styles/property.scss";

.diamond {
  color: rgba(0, 0, 0, 1);
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
  cursor: move;
  transform-origin: top left;
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

.flowchart-node-container {
  .node-main {
    .node-custom {
      margin-left: auto;
      margin-right: auto;
      position: relative;
      top: 45%;
      transform: translateY(-50%);
    }
  }
  .node-port-right {
    border: 1px solid rgb(138, 23, 23);
    border-radius: 100px;
    background: rgba(247, 105, 105, 0.445);
    &:hover {
      border: 1px solid white;
    }
  }

  .node-port-left {
    border: 1px solid rgb(33, 138, 23);
    border-radius: 100px;
    background: rgba(69, 207, 115, 0.445);
    &:hover {
      border: 1px solid white;
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