
  
<template>
  <div
    class="flowchart-container"
    @mousemove="handleMove"
    @mouseup="handleUp"
    @mousedown="handleDown"
  >
    <svg width="100%" :height="`${workflow.height}px`">
      <line-link
        :line="line"
        v-for="(line, index) in lines"
        :key="`line${index}`"
        @deleteLink="linkDelete(line.id)"
      />
    </svg>

    <card
      :node.sync="node"
      v-for="(node, index) in workflow.scene.nodes"
      :key="`node${index}`"
      :nodeOptions="nodeOptions"
      @linkingStart="linkingStart(node.id)"
      @linkingStop="linkingStop(node.id)"
      @nodeSelected="nodeSelected(node.id, $event)"
    ></card>
  </div>
</template>

<script lang="ts">
import LineLink from "./line-link/line-link.component.vue";
import Card from "./card/card.component.vue";

import { getMousePosition } from "../core/position";
import { Component, Vue, Prop } from "vue-property-decorator";
import { IWorkFlow, Action, Mouse, Option } from "./type";
import { ILink, Link, Line } from "./line-link/type";
@Component({
  components: { LineLink, Card },
  name: "WorkFlowPath"
})
export default class WorkFlowPath extends Vue {
  @Prop() workflow!: IWorkFlow;

  action: Action = new Action();
  mouse: Mouse = new Mouse();
  draggingLink: any = null;

  get nodeOptions() {
    let nodeOptions = new Option();
    nodeOptions.centerX = this.workflow.scene.centerX;
    nodeOptions.centerY = this.workflow.scene.centerY;
    nodeOptions.scale = this.workflow.scene.scale;
    if (this.action.selected) {
      nodeOptions.selected = this.action.selected;
    }
    return nodeOptions;
  }

  get lines() {
    const lines = this.workflow.scene.lines.map(line => {
      const fromNode = this.findNodeWithID(line.from);
      const toNode = this.findNodeWithID(line.to);
      let x = 0,
        y = 0,
        cy = 0,
        cx = 0,
        ex = 0,
        ey = 0;

      x = this.workflow.scene.centerX + fromNode!.position.x;
      y = this.workflow.scene.centerY + fromNode!.position.y;
      [cx, cy] = this.getPortPosition("bottom", x, y);

      x = this.workflow.scene.centerX + toNode!.position.x;
      y = this.workflow.scene.centerY + toNode!.position.y;
      [ex, ey] = this.getPortPosition("top", x, y);

      line.link.start.x = cx;
      line.link.start.y = cy;
      line.link.end.x = ex;
      line.link.end.y = ey;

      return line;
    });

    if (this.draggingLink) {
      let x = 0,
        y = 0,
        cy = 0,
        cx = 0;
      const fromNode = this.findNodeWithID(this.draggingLink.from);

      x = this.workflow.scene.centerX + fromNode!.position.x;
      y = this.workflow.scene.centerY + fromNode!.position.y;
      [cx, cy] = this.getPortPosition("bottom", x, y);

      // push temp dragging link, mouse cursor postion = link end postion
      let currentLink = new Line();
      currentLink.link.start.x = cx;
      currentLink.link.start.y = cy;
      currentLink.link.end.x = this.draggingLink.mx;
      currentLink.link.end.y = this.draggingLink.my;

      lines.push(currentLink);
    }
    return lines;
  }

  findNodeWithID(id: number | null) {
    return this.workflow.scene.nodes.find(item => {
      return id === item.id;
    });
  }

  getPortPosition(type: string, x: number, y: number) {
    if (type === "top") {
      return [x + 40, y];
    } else if (type === "bottom") {
      return [x + 40, y + 80];
    }
    return [0, 0];
  }

  linkingStart(index: number) {
    this.action.linking = true;
    this.draggingLink = {
      from: index,
      mx: 0,
      my: 0
    };
  }

  linkingStop(index: number) {
    // add new Link
    if (this.draggingLink && this.draggingLink.from !== index) {
      // check link existence
      const existed = this.workflow.scene.lines.find(line => {
        return line.from === this.draggingLink.from && line.to === index;
      });
      if (!existed) {
        let maxID = Math.max(
          0,
          ...this.workflow.scene.lines.map(line => {
            return line.id;
          })
        );
        const newLink = new Line();

        newLink.id = maxID + 1;
        newLink.from = this.draggingLink.from;
        newLink.to = index;

        this.workflow.scene.lines.push(newLink);
        this.$emit("linkAdded", newLink);
      }
    }
    this.draggingLink = null;
  }

  linkDelete(id: number) {
    const deletedLink = this.workflow.scene.lines.find(item => {
      return item.id === id;
    });
    if (deletedLink) {
      this.workflow.scene.lines = this.workflow.scene.lines.filter(item => {
        return item.id !== id;
      });
      this.$emit("linkDelete", deletedLink);
    }
  }

  nodeSelected(id: number, e: any) {
    this.action.dragging = id;
    this.action.selected = id;
    this.mouse.lastX =
      e.pageX || e.clientX + document.documentElement.scrollLeft;
    this.mouse.lastY =
      e.pageY || e.clientY + document.documentElement.scrollTop;

    this.$emit("nodeClick", id);
  }

  handleMove(e: any) {
    if (this.action.linking) {
      [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
      [this.draggingLink.mx, this.draggingLink.my] = [
        this.mouse.x,
        this.mouse.y
      ];
    }
    if (this.action.dragging) {
      this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop;
      let diffX = this.mouse.x - this.mouse.lastX;
      let diffY = this.mouse.y - this.mouse.lastY;
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.moveSelectedNode(diffX, diffY);
    }
    if (this.action.scrolling) {
      [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
      let diffX = this.mouse.x - this.mouse.lastX;
      let diffY = this.mouse.y - this.mouse.lastY;
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.workflow.scene.centerX += diffX;
      this.workflow.scene.centerY += diffY;
    }
  }

  handleUp(e: any) {
    const target = e.target || e.srcElement;
    if (this.$el.contains(target)) {
      if (
        typeof target.className !== "string" ||
        target.className.indexOf("node-input") < 0
      ) {
        this.draggingLink = null;
      }
      if (
        typeof target.className === "string" &&
        target.className.indexOf("node-delete") > -1 &&
        this.action.dragging !== null
      ) {
        this.nodeDelete(this.action.dragging);
      }
    }
    this.action.linking = false;
    this.action.dragging = null;
    this.action.scrolling = false;
  }

  handleDown(e: any) {
    const target = e.target || e.srcElement;
    if (
      (target === this.$el || target.matches("svg, svg *")) &&
      e.which === 1
    ) {
      this.action.scrolling = true;
      [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
      this.action.selected = null; // deselectAll
    }
    this.$emit("canvasClick", e);
  }

  moveSelectedNode(dx: any, dy: any) {
    let self = this;
    let index = this.workflow.scene.nodes.findIndex(item => {
      return item.id === self.action.dragging;
    });
    let left =
      this.workflow.scene.nodes[index].position.x +
      dx / this.workflow.scene.scale;
    let top =
      this.workflow.scene.nodes[index].position.y +
      dy / this.workflow.scene.scale;

    this.workflow.scene.nodes[index].position.x = left;
    this.workflow.scene.nodes[index].position.y = top;
  }

  nodeDelete(id: number) {
    this.workflow.scene.nodes = this.workflow.scene.nodes.filter(node => {
      return node.id !== id;
    });
    this.workflow.scene.lines = this.workflow.scene.lines.filter(line => {
      return line.from !== id && line.to !== id;
    });
    this.$emit("nodeDelete", id);
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.flowchart-container {
  margin: 0;
  background: #ddd;
  position: relative;
  overflow: hidden;
  svg {
    cursor: grab;
  }
}
</style>