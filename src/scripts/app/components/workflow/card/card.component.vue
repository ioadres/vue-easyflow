<template>
  <div
    class="flowchart-node"
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
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { INode, INodeViewScale } from "./../../../shared/workflow/node.type";
import { LocationPort } from "../../../shared/workflow/enum";
import  BaseDiagram from "../shared/base-diagram";

@Component
export default class extends BaseDiagram implements Vue {
  public name = "Card";
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
$themeColor: rgb(0, 153, 255);
$portSize: 12;
.flowchart-node {
  border-radius: 4px;
  border-top-left-radius: 1.3em;
  border-bottom-right-radius: 1.3em;
  border-top-right-radius: 1.3em;
  background-color: #e4e4e4;
  .node-main {
    text-align: center;
    .node-type {
      background: $themeColor;
      color: white;
      padding: 6px 12px;
      border-top-left-radius: 1.3em;
      border-top-right-radius: 1.3em;
    }
    .node-custom {
      padding: 8px 12px;
      .node-label {
        font-size: 14px;
      }
    }
  }  
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>