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
  margin: 0;
  position: absolute;
  box-sizing: border-box;
  border: 1px solid #e4e6eb;
  border-radius: 4px;
  border-top-left-radius: 1.3em;
  border-bottom-right-radius: 1.3em;
  border-top-right-radius: 1.3em;
  background-color: #e4e4e4;
  color: rgba(0, 0, 0, 1);
  margin: 1px 0;
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
  z-index: 1;
  opacity: 0.9;
  cursor: move;
  transform-origin: top left;

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
    font-size: 10px;
    width: 16px;
    height: 16px;
    color: $themeColor;
    cursor: pointer;
    background: white;
    border: 1px solid $themeColor;
    border-radius: 100px;
    text-align: center;
    &:hover {
      background: red;
      border: 1px solid rgb(138, 23, 23);
      color: white;
    }
  }
}
.selected {
  box-shadow: 0 0 0 2px $themeColor;
}
</style>