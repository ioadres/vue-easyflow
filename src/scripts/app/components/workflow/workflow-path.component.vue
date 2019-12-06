<template>
  <div>
    <property-editor :isVisible="propertyIsVisible" :node.sync="nodePropertySelected"></property-editor>

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

      <point-start
        :node.sync="node"
        v-for="(node, index) in getNodesByType('point-start')"
        :key="`point-start-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @linkingStart="linkingNodeStart"
        @linkingStop="linkingNodeStop"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></point-start>

      <point-end
        :node.sync="node"
        v-for="(node, index) in getNodesByType('point-end')"
        :key="`point-end-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @linkingStart="linkingNodeStart"
        @linkingStop="linkingNodeStop"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></point-end>

      <general
        :node.sync="node"
        v-for="(node, index) in getNodesByType('general')"
        :key="`general-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @linkingStart="linkingNodeStart"
        @linkingStop="linkingNodeStop"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></general>

      <action
        :node.sync="node"
        v-for="(node, index) in getNodesByType('action')"
        :key="`action-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @linkingStart="linkingNodeStart"
        @linkingStop="linkingNodeStop"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></action>

      <label-text
        :node.sync="node"
        v-for="(node, index) in getNodesByType('label')"
        :key="`label-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></label-text>

      <diamond
        :node.sync="node"
        v-for="(node, index) in getNodesByType('desicion')"
        :key="`desicion-${index}`"
        :nodeViewScale="getNodeViewScale"
        @nodedelete="handleNodeEntrydelete(node, $event)"
        @handleNodeEntryInput="handleNodeEntryInput(node, $event)"
        @linkingStart="linkingNodeStart"
        @linkingStop="linkingNodeStop"
        @nodeSelected="nodeSelected(node.id, $event)"
      ></diamond>
    </div>
  </div>
</template>

<script lang="ts">
import LineLink from "./line-link/line-link.component.vue";
import LabelText from "./diagram/label-text/label-text.vue";
import General from "./diagram/general/general.component.vue";
import Diamond from "./diagram/diamon/diamon.component.vue";
import Action from "./diagram/action/action.component.vue";
import PointStart from "./diagram/point-start/point-start.component.vue";
import PointEnd from "./diagram/point-end/point-end.component.vue";
import PropertyEditor from "./shared/property-editor.vue";
import { Path } from "@/scripts/app/shared/workflow/path/path";

import { getMousePosition } from "../core/position";
import { Component, Vue, Prop } from "vue-property-decorator";
import {
  IWorkFlow,
  NodeAction,
  LinkAction
} from "./../../shared/workflow/workflow.type";
import { INodeViewScale, INode } from "./../../shared/workflow/node.type";
import { Line, ILine } from "./../../shared/workflow/line.type";
import { LocationPort } from "../../shared/workflow/enum";

@Component({
  components: {
    PropertyEditor,
    LineLink,
    LabelText,
    General,
    Diamond,
    Action,
    PointEnd,
    PointStart
  },
  name: "WorkFlowPath"
})
export default class extends Vue {
  @Prop() workflow!: IWorkFlow;

  private nodeAction: NodeAction = new NodeAction();
  private linkAction: LinkAction = new LinkAction();
  private path: Path = new Path();

  get nodePropertySelected() {
    if (this.nodeAction.selected! > 0 && this.nodeAction.isDragging == false) {
      return this.workflow.scene.nodes.find(item => {
        return item.id === this.nodeAction.selected;
      });
    }
    return {};
  }
  get propertyIsVisible() {
    return this.nodeAction.selected! > 0 && this.nodeAction.isDragging == false;
  }

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
    if (this.workflow.scene.scale > 0.6) {
      this.workflow.scene.scale -= 0.2;
    }
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
    if (
      this.linkAction &&
      this.linkAction.from !== node.id &&
      this.linkAction.isDragging === true
    ) {
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

    this.path.saveMouseLastPosition(e);

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
      this.scrollingMove(e);
    }
  }

  handleNodeEntrydelete(nodeToDelete: INode, e: any) {
    if (!this.linkAction.isDragging) {
      this.nodeAction.selected = null;
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
      this.nodeAction.selected = null;
      this.path.saveMouseLastPositionWithOffset(this.$el, e);
    }
    this.$emit("canvasClick", e);
  }

  linkMove(e: any) {
    [this.linkAction.x, this.linkAction.y] = this.path.lineLinkMove(
      this.$el,
      e
    );
  }

  nodeMove(e: any) {
    let self = this;

    let index = this.workflow.scene.nodes.findIndex(item => {
      return item.id === self.nodeAction.selected;
    });

    let node = this.workflow.scene.nodes[index];
    [node.position.x, node.position.y] = this.path.nodeMove(
      node,
      this.workflow.scene.scale,
      this.$el,
      e
    );
  }

  scrollingMove(e: any) {
    let left, top;
    [left, top] = this.path.scrollingMove(this.$el, e);
    this.workflow.scene.centerX += left;
    this.workflow.scene.centerY += top;
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>