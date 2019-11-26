<template>
  <div class="app">
    <h1>simple flowchart</h1>
    <div class="tool-wrapper">
      <button @click="addNode">Add</button>
      <button @click="exportData">Exportar</button>
    </div>

    <work-flow-path
      :workflow.sync="workflow"
      @nodeClick="nodeClick"
      @nodeDelete="nodeDelete"
      @linkDelete="linkDelete"
      @linkAdded="linkAdded"
      @canvasClick="canvasClick"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import WorkFlowPath from "./components/workflow/workflow-path.component.vue";
import { IWorkFlow } from "./shared/workflow/workflow.type";
import { ILink } from "./shared/workflow/line.type";
import { Node, INode, Card, Diamon } from "./shared/workflow/node.type";
import { Position } from './shared/workflow/position.type';
@Component({
  components: { WorkFlowPath }
})
export default class extends Vue {
  public name = "App";

  public workflow: IWorkFlow = {
    scene: {
      linesLinks: [],
      nodes: [],
      centerX: 1024,
      centerY: 140,
      scale: 2
    },
    height: 800
  };

  canvasClick(e: any) {
    console.log("canvas Click, event:", e);
  }

  exportData() {
    console.log(this.workflow.scene.nodes);

    let exportData = {
      nodes: this.workflow.scene.nodes,
      links: this.workflow.scene.linesLinks
    };

    this.$emit("exportData", exportData);
  }

  addNode() {
    let maxID = Math.max(
      0,
      ...this.workflow.scene.nodes.map(node => {
        return node.id;
      })
    );

    let node:INode;
    var ramdom = Math.floor(Math.random() * 2);
    if(ramdom == 0)  {
    node= new Card(maxID+1);
    node.type = "card"
    } else {
      node= new Diamon(maxID+1);
      node.type = "desicion"
    }
    node.label = "Pregunta a usuario si el nombre es correcto." + node.id
    this.workflow.scene.nodes.push(node)
  }

  nodeClick(id: number) {
    console.log("node click", id);
  }
  nodeDelete(id: number) {
    console.log("node delete", id);
  }
  linkDelete(id: number) {
    console.log("link delete", id);
  }
  linkAdded(link: ILink) {
    console.log("new link added:", link);
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  overflow: hidden;
  height: 800px;
  .tool-wrapper {
    position: relative;
  }
}
</style>