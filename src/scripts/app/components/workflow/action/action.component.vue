<template>
  <div
    class="flowchart-node flowchart-node-container"
    :style="nodeStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeViewScale.selected === node.id}"
  >
    <div class="node-port node-input" @mousedown="inputMouseDown" @mouseup="inputMouseUp"></div>
    <div class="node-main">
      <div v-text="node.type" class="node-type"></div>
      <div class="node-custom">
        <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div class="node-port node-output" @mousedown="outputMouseDown"></div>
    <div class="node-port node-output node-port-right" :style="nodeRightPortStyle" @mousedown="outputMouseDownRight"></div>
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import  BaseDiagram from "../shared/base-diagram";

@Component
export default class extends BaseDiagram implements Vue {
  public name = "Action";  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(0, 153, 255);
$portSize: 12;

.flowchart-node {
  border-radius: 0px;
  background-color: #fff;  
  border: 1px solid $themeColor;

  .node-main {
    .node-type {
      color: $themeColor;
      padding: 6px 12px;
    }
    .node-custom {
      padding: 8px 12px;
      .node-label {
        font-size: 14px;
      }
    }
  }
  
  .node-port-right {
    border: 1px solid rgb(138, 23, 23);
    border-radius: 100px;
    background: rgb(216, 206, 206);
    &:hover {
      border: 1px solid white;
    }
  }  
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>