
  
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
        @linkDelete="linkDelete(line.id)"
      />
    </svg>

    <card
      :node.sync="node"
      v-for="(node, index) in workflow.scene.nodes"
      :key="`node${index}`"
      :nodeViewScale="getNodeViewScale"
      @handleNodeEntrydelete="handleNodeEntrydelete(node, $event)"
      @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
      @linkingStart="linkingNodeStart(node.id)"
      @linkingStop="linkingNodeStop(node.id)"
      @nodeSelected="nodeSelected(node.id, $event)"
    ></card>
  </div>
</template>

<script lang="ts">
import LineLink from "./line-link/line-link.component.vue";
import Card from "./card/card.component.vue";

import { getMousePosition } from "../core/position";
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  IWorkFlow,
  NodeAction,
  Mouse,
  LinkAction
} from "./../../shared/workflow/workflow.type";
import { INodeViewScale, INode } from "./../../shared/workflow/node.type";
import { Line, ILine } from "./../../shared/workflow/line.type";

@Component({
  components: { LineLink, Card }
})
export default class extends Vue {
  public name = "WorkFlowPath";

  @Prop() workflow!: IWorkFlow;

  private nodeAction: NodeAction = new NodeAction();
  private linkAction: LinkAction = new LinkAction();
  private mouse: Mouse = new Mouse();

  get getNodeViewScale() {
    let nodeViewScale: INodeViewScale = {
      centerX: this.workflow.scene.centerX,
      centerY: this.workflow.scene.centerY,
      scale: this.workflow.scene.scale,
      selected: this.nodeAction.selected
    };

    return nodeViewScale;
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

    if (this.linkAction.isDragging) {
      let x = 0,
        y = 0,
        cy = 0,
        cx = 0;
      const fromNode = this.findNodeWithID(this.linkAction.from);

      x = this.workflow.scene.centerX + fromNode!.position.x;
      y = this.workflow.scene.centerY + fromNode!.position.y;
      [cx, cy] = this.getPortPosition("bottom", x, y);

      let currentLink = new Line();
      currentLink.link.start.x = cx;
      currentLink.link.start.y = cy;
      currentLink.link.end.x = this.linkAction.x;
      currentLink.link.end.y = this.linkAction.y;

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

  linkingNodeStart(index: number) {
    this.linkAction = {
      from: index,
      x: 0,
      y: 0,
      isDragging: true
    };
  }

  linkingNodeStop(nodeElementeIndex: number) {
    // add new Link
    if (this.linkAction && this.linkAction.from !== nodeElementeIndex) {
      // check link existence
      const existed = this.workflow.scene.lines.find(line => {
        return (
          line.from === this.linkAction.from && line.to === nodeElementeIndex
        );
      });

      if (!existed) {
        let maxID = Math.max(
          0,
          ...this.workflow.scene.lines.map(line => {
            return line.id;
          })
        );

        let newLink: ILine = new Line();
        newLink.id = maxID + 1;
        newLink.from = this.linkAction.from;
        newLink.to = nodeElementeIndex;

        this.workflow.scene.lines.push(newLink);
        this.$emit("linkAdded", newLink);
      }
    }
    this.linkAction.isDragging = false;
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
    this.nodeAction.isDragging = true;
    this.nodeAction.selected = id;
    this.mouse.lastX =
      e.pageX || e.clientX + document.documentElement.scrollLeft;
    this.mouse.lastY =
      e.pageY || e.clientY + document.documentElement.scrollTop;

    this.$emit("nodeClick", id);
  }

  handleMove(e: any) {
    if (this.linkAction.isDragging) {
      [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
      [this.linkAction.x, this.linkAction.y] = [this.mouse.x, this.mouse.y];
    }

    if (this.nodeAction.isDragging) {
      this.nodeMove(e);
    }

    if (this.nodeAction.isScrolling) {
      [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
      let diffX = this.mouse.x - this.mouse.lastX;
      let diffY = this.mouse.y - this.mouse.lastY;
      this.mouse.lastX = this.mouse.x;
      this.mouse.lastY = this.mouse.y;
      this.workflow.scene.centerX += diffX;
      this.workflow.scene.centerY += diffY;
    }
  }

  handleNodeEntrydelete(nodeToDelete: INode, e: any) {
    if (!this.linkAction.isDragging) {
      this.workflow.scene.nodes = this.workflow.scene.nodes.filter(node => {
        return node.id !== nodeToDelete.id;
      });
      this.workflow.scene.lines = this.workflow.scene.lines.filter(line => {
        return line.from !== nodeToDelete.id && line.to !== nodeToDelete.id;
      });
      this.$emit("nodeDelete", nodeToDelete.id);
    }
  }

  handleUp(e: any) {
    this.nodeAction.isDragging = false;
    this.nodeAction.isScrolling = false;
  }

  handleDown(e: any) {
    const target = e.target || e.srcElement;
    if (
      (target === this.$el || target.matches("svg, svg *")) &&
      e.which === 1
    ) {
      this.nodeAction.isScrolling = true;
      [this.mouse.lastX, this.mouse.lastY] = getMousePosition(this.$el, e);
      this.nodeAction.selected = null;
    }
    this.$emit("canvasClick", e);
  }

  nodeMove(e: any) {
    let self = this;

    this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft;
    this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop;
    let diffX = this.mouse.x - this.mouse.lastX;
    let diffY = this.mouse.y - this.mouse.lastY;
    this.mouse.lastX = this.mouse.x;
    this.mouse.lastY = this.mouse.y;

    let index = this.workflow.scene.nodes.findIndex(item => {
      return item.id === self.nodeAction.selected;
    });
    let left =
      this.workflow.scene.nodes[index].position.x +
      diffX / this.workflow.scene.scale;
    let top =
      this.workflow.scene.nodes[index].position.y +
      diffY / this.workflow.scene.scale;

    this.workflow.scene.nodes[index].position.x = left;
    this.workflow.scene.nodes[index].position.y = top;
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