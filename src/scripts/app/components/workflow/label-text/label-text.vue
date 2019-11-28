<template>
 <div
    class="flowchart-node flowchart-node-container"
    :style="nodeWithoutWidthAndHeightStyle"
    @mousedown="handleMousedown"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    v-bind:class="{selected: nodeViewScale.selected === node.id}"
  >
    <div class="node-main">
      <div class="node-custom">
        <div v-text="node.label" class="node-label"></div>
      </div>
    </div>
    <div v-show="show.delete" class="node-delete" @mouseup="deleteHandleUp">&times;</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import  BaseDiagram from "../shared/base-diagram";

@Component
export default class extends BaseDiagram implements Vue {
  public name = "LabelText";
}
</script>

<style scoped lang="scss">
$themeColor: rgb(0, 153, 255);
$portSize: 12;

.flowchart-node {
  border-radius: 0px;
  background-color: #fff;  
  border: 1px dotted $themeColor;

  .node-main {
    
    .node-custom {
      padding: 5px;
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