<template>
  <div
    class="flowchart-node"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeViewScale.selected === node.id}"
  >
    <div class="node-main" :style="nodeWidhtAndHeightStyle">
      <div class="node-custom">
        <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div class="node-port node-output" @mousedown="outputMouseDownCenter"></div>
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { INode, INodeViewScale } from "./../../../shared/workflow/node.type";
import { LocationPort } from "../../../shared/workflow/enum";
import BaseDiagram from "../shared/base-diagram";

@Component
export default class extends BaseDiagram implements Vue {
  public name = "PointStart";

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
$themeColor: rgb(0, 153, 255);
$portSize: 12;
.flowchart-node {  
  border-radius: 100px;
  .node-main {
      text-align: center;
    .node-label {
      padding: 40%;
      font-size: 14px;
    }
  }  
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>