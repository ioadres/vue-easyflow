<template>
  <div class="app">
    <h1>simple flowchart</h1>
    <div class="tool-wrapper"></div>

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
import { Node } from "./shared/workflow/node.type";
@Component({
  components: { WorkFlowPath }
})
export default class extends Vue {
  public name = "App";
  
  public workflow: IWorkFlow = {
    scene: {
      lines: [],
      centerX: 1024,
      centerY: 140,
      scale: 1,
      nodes: [
        Node.fromData({
          id: 2,
          position: {
            x: -357,
            y: 80
          },
          type: "Action",
          label: "test1"
        }),
        Node.fromData({
          position: {
            x: -700,
            y: -69
          },
          id: 4,
          type: "Script",
          label: "test2"
        }),
        Node.fromData({
          id: 6,
          position: {
            x: -557,
            y: 80
          },
          type: "Rule",
          label: "test3"
        })
      ]
    },
    height: 800
  };

  canvasClick(e: any) {
    console.log("canvas Click, event:", e);
  }
  addNode() {
    let maxID = Math.max(
      0,
      ...this.workflow.scene.nodes.map(link => {
        return link.id;
      })
    );
    this.workflow.scene.nodes.push(new Node());
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