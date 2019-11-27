
  
<template>
  <div
    class="flowchart-container"
    @mousemove="handleMove"
    @mouseup="handleUp"
    @mousedown="handleDown"
  >
  <button v-shortkey="['ctrl', 'alt', 'f']" @shortkey="sumScale()" style="display:none"></button>
  <button v-shortkey="['ctrl', 'alt','g']" @shortkey="restScale()" style="display:none"></button>
    <svg width="100%" :height="`${workflow.height}vh`">
      <line-link
        :line="line"
        v-for="(line, index) in lines"
        :key="`line${index}`"
        @linkDelete="linkDelete(line.id)"
      />
    </svg>

    <card
      :node.sync="node"
      v-for="(node, index) in getNodesByType('card')"
      :key="`card${index}`"
      :nodeViewScale="getNodeViewScale"
      @handleNodeEntrydelete="handleNodeEntrydelete(node, $event)"
      @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
      @linkingStart="linkingNodeStart"
      @linkingStop="linkingNodeStop"
      @nodeSelected="nodeSelected(node.id, $event)"
    ></card>

    <action
      :node.sync="node"
      v-for="(node, index) in getNodesByType('action')"
      :key="`action${index}`"
      :nodeViewScale="getNodeViewScale"
      @handleNodeEntrydelete="handleNodeEntrydelete(node, $event)"
      @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
      @linkingStart="linkingNodeStart"
      @linkingStop="linkingNodeStop"
      @nodeSelected="nodeSelected(node.id, $event)"
    ></action>

    <diamond
      :node.sync="node"
      v-for="(node, index) in getNodesByType('desicion')"
      :key="`desicion${index}`"
      :nodeViewScale="getNodeViewScale"
      @handleNodeEntrydelete="handleNodeEntrydelete(node, $event)"
      @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
      @linkingStart="linkingNodeStart"
      @linkingStop="linkingNodeStop"
      @nodeSelected="nodeSelected(node.id, $event)"
    ></diamond>
  </div>
</template>

<script lang="ts">
import LineLink from "./line-link/line-link.component.vue";
import Card from "./card/card.component.vue";
import Diamond from "./diamon/diamon.component.vue";
import Action from "./action/action.component.vue";

import { getMousePosition } from "../core/position";
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  IWorkFlow,
  NodeAction,
  LinkAction,
  Mouse
} from "./../../shared/workflow/workflow.type";
import { INodeViewScale, INode } from "./../../shared/workflow/node.type";
import { Line, ILine } from "./../../shared/workflow/line.type";
import { LocationPort } from '../../shared/workflow/enum';

@Component({
  components: { LineLink, Card, Diamond ,Action},
  name: "WorkFlowPath"
})
export default class extends Vue {
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

  getNodesByType(type: string) {
    const nodes = this.workflow.scene.nodes.filter(x => x.type === type);
    return nodes;
  }

  get lines() {
    const lines = this.workflow.scene.linesLinks.map(line => {
      const fromNode = this.findNodeWithID(line.from);
      const toNode = this.findNodeWithID(line.to);
      let cy = 0,
        cx = 0,
        ex = 0,
        ey = 0;

      [cx, cy] = fromNode!.getPositionNodePort(
        this.workflow.scene.centerX,
        this.workflow.scene.centerY,
        line.locationPortInput,
        this.workflow.scene.scale
      );

      [ex, ey] = toNode!.getPositionNodePort(
        this.workflow.scene.centerX,
        this.workflow.scene.centerY,
        LocationPort.Top,
        this.workflow.scene.scale
      );

      line.link.start.x = cx;
      line.link.start.y = cy;
      line.link.end.x = ex;
      line.link.end.y = ey;

      return line;
    });

    if (this.linkAction.isDragging) {
      let cy = 0,
        cx = 0;

      const fromNode = this.findNodeWithID(this.linkAction.from);
      [cx, cy] = fromNode!.getPositionNodePort(
        this.workflow.scene.centerX,
        this.workflow.scene.centerY,
        this.linkAction.locationPortInput,
        this.workflow.scene.scale
      );
      let currentLink = new Line();
      currentLink.link.start.x = cx;
      currentLink.link.start.y = cy;
      currentLink.link.end.x = this.linkAction.x;
      currentLink.link.end.y = this.linkAction.y;

      lines.push(currentLink);
    }

    return lines;
  }

  sumScale() {
    this.workflow.scene.scale += 0.2;
  }
  restScale() {
    if(this.workflow.scene.scale > 0.6)
    this.workflow.scene.scale-= 0.2;
  }

  findNodeWithID(id: number | null) {
    return this.workflow.scene.nodes.find(item => {
      return id === item.id;
    });
  }

  linkingNodeStart(node: INode, locationPortInput: string) {
    this.linkAction = {
      from: node.id,
      locationPortInput: locationPortInput,
      x: 0,
      y: 0,
      isDragging: true
    };
  }

  linkingNodeStop(node: INode, port: string) {
    // add new Link
    if (this.linkAction && this.linkAction.from !== node.id &&  this.linkAction.isDragging === true) {
      // check link existence
      const existed = this.workflow.scene.linesLinks.find(line => {
        return line.from === this.linkAction.from && line.to === node.id;
      });

      if (!existed) {
        let maxID = Math.max(
          0,
          ...this.workflow.scene.linesLinks.map(line => {
            return line.id;
          })
        );

        let newLink: ILine = new Line();
        newLink.id = maxID + 1;
        newLink.from = this.linkAction.from;
        newLink.locationPortInput = this.linkAction.locationPortInput;
        newLink.to = node.id;

        this.workflow.scene.linesLinks.push(newLink);
        this.$emit("linkAdded", newLink);
      }
    }
    this.linkAction.isDragging = false;
  }

  linkDelete(id: number) {
    const deletedLink = this.workflow.scene.linesLinks.find(item => {
      return item.id === id;
    });
    if (deletedLink) {
      this.workflow.scene.linesLinks = this.workflow.scene.linesLinks.filter(
        item => {
          return item.id !== id;
        }
      );
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
      this.linkMove(e);
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
      this.workflow.scene.linesLinks = this.workflow.scene.linesLinks.filter(
        line => {
          return line.from !== nodeToDelete.id && line.to !== nodeToDelete.id;
        }
      );
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

  linkMove(e: any) {
    [this.mouse.x, this.mouse.y] = getMousePosition(this.$el, e);
    [this.linkAction.x, this.linkAction.y] = [this.mouse.x, this.mouse.y];
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
  border: 1px solid #eee;
  background: #fcfcfc;
  position: relative;
  overflow: hidden;
  svg {
    cursor: grab;
  }
}
</style>