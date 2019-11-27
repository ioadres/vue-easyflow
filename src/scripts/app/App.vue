<template>
  <div class="app">
    <h1>simple flowchart</h1>
    <div class="tool-wrapper">
      <input type="text" v-model="label" />
      <select v-model="type">
        <option value="card">Card</option>
        <option value="action">Action</option>
        <option value="desicion">Desicion</option>
        <option value="point-start">start</option>
      </select>
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
import { Node, INode, Card, Diamon, Action, PointStart } from "./shared/workflow/node.type";
import { Position } from "./shared/workflow/position.type";
@Component({
  components: { WorkFlowPath }
})
export default class extends Vue {
  public name = "App";

  public workflow: IWorkFlow = {
    scene: {
      linesLinks: [],
      nodes: [],//[{"id":1,"position":{"x":-160,"y":293},"type":"card","label":"Ups, no entendí tu mensaje 😯, Por favor intentalo de nuevo.","width":300,"height":150,"leftPort":{"x":0,"y":0},"rightPort":{"x":0,"y":0}},{"id":2,"position":{"x":-746,"y":150},"type":"card","label":"Dinos tu correo electronico","width":300,"height":150,"leftPort":{"x":0,"y":0},"rightPort":{"x":0,"y":0}},{"id":3,"position":{"x":-268,"y":-66},"type":"desicion","label":"El proceso de registro de un nuevo usuario tan solo nos llevara unos poco minutos. ¿Continuamos con el reigistro?","width":200,"height":200,"leftPort":{"x":-40,"y":90},"rightPort":{"x":240,"y":90}},{"id":4,"position":{"x":-747,"y":386},"type":"action","label":"Sava Mail","width":300,"height":100,"leftPort":{"x":0,"y":0},"rightPort":{"x":300,"y":40}}],
      centerX: 1024,
      centerY: 140,
      scale: 1
    },
    height: 100
  };

  public label: string = "Test";
  public type: string = "";

  canvasClick(e: any) {
    console.log("canvas Click, event:", e);
  }

  exportData() {
    console.log(this.workflow.scene.nodes);
    console.log(JSON.stringify(this.workflow.scene.nodes))
    console.log(JSON.stringify(this.workflow.scene.linesLinks))
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

    let node: INode = new Card(maxID + 1);
    if (this.type === "desicion") {
      node = new Diamon(maxID + 1);
    }
    if (this.type === "action") {
      node = new Action(maxID + 1);
    }
    if (this.type === "point-start") {
      node = new PointStart(maxID + 1);
    }
    node.type = this.type;
    node.label = this.label;
    this.workflow.scene.nodes.push(node);
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

  @import '../../styles/main.scss'

</style>