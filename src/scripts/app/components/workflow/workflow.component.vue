
  
<template>
  <div class="flowchart-container" 
    @mousemove="handleMove" 
    @mouseup="handleUp"
    @mousedown="handleDown">
    <svg width="100%" :height="`${workflow.height}px`">
      <flow-link v-bind.sync="link" 
        v-for="(link, index) in lines" 
        :key="`link${index}`"
        @deleteLink="linkDelete(link.id)">
      </flow-link>
    </svg>
    <flow-node v-bind.sync="node" 
      v-for="(node, index) in workflow.scene.nodes" 
      :key="`node${index}`"
      :options="nodeOptions"
      @linkingStart="linkingStart(node.id)"
      @linkingStop="linkingStop(node.id)"
      @nodeSelected="nodeSelected(node.id, $event)">
    </flow-node>
  </div>
</template>

<script lang="ts">
import FlowLink from './flowlink/flowlink.component.vue';
import FlowNode from './flownode/flownode.component.vue';
import { getMousePosition } from '../core/position'

import { Component, Vue, Prop, Watch  } from 'vue-property-decorator';
import {IWorkFlow} from './workflow.type';
import {ILink, Link} from './flowlink/flowlink.type'
import {INode, Node} from './flownode/flownode.type'
@Component({  
  components: { FlowLink, FlowNode }
})
export default class WorkFlow extends Vue {
    @Prop() workflow! : IWorkFlow

    get nodeOptions() {
          return {
            centerY: this.workflow.scene.centerY,
            centerX: this.workflow.scene.centerX,
            scale: this.workflow.scene.scale,
            offsetTop: this.workflow.rootDivOffset.top,
            offsetLeft: this.workflow.rootDivOffset.left,
            selected: this.workflow.action.selected,
          }
        }
    get lines() {
      const lines = this.workflow.scene.links.map((link) => {
        const fromNode = this.findNodeWithID(link.from)
        const toNode = this.findNodeWithID(link.to)
        let x = 0, y= 0, cy= 0, cx= 0, ex= 0, ey= 0;
        if(fromNode !== undefined ) {
          x = this.workflow.scene.centerX + fromNode.position.x;
          y = this.workflow.scene.centerY + fromNode.position.y;
        }
        [cx, cy] = this.getPortPosition('bottom', x, y);
          if(toNode !== undefined) {
          x = this.workflow.scene.centerX + toNode.position.x;        
          y = this.workflow.scene.centerY + toNode.position.y;
        }
        [ex, ey] = this.getPortPosition('top', x, y);

        let linkget : ILink = {
          id:link.id,
          start: {
            x:ex,
            y:ey
          },
          end: {
            x:cx,
            y:cy
          },
          show: {
            delete:false
          },
          from : null,
          to: null
        }
        return  linkget;
      })
      if (this.workflow.draggingLink) {
        let x = 0, y = 0, cy = 0, cx= 0;
        const fromNode = this.findNodeWithID(this.workflow.draggingLink.from)
        if(fromNode !== undefined ) {
          x = this.workflow.scene.centerX + fromNode.position.x;
          y = this.workflow.scene.centerY + fromNode.position.y;
        }
        [cx, cy] = this.getPortPosition('bottom', x, y);
        

        // push temp dragging link, mouse cursor postion = link end postion 
        let linkget : ILink = {
          id:0,
          end: {
            x:this.workflow.draggingLink.mx,
            y:this.workflow.draggingLink.my,
          },
          start: {
            x:cx,
            y:cy
          },
          show: {
            delete:false
          },
          from : null,
          to: null
        }        
        lines.push(linkget)
      }
      return lines;
    }
    

 constructor() {
   super();
 }


 findNodeWithID(id: number | null) {
      return this.workflow.scene.nodes.find((item) => {
          return id === item.id
      })
    }

    getPortPosition(type: string, x: number, y: number) {
      if (type === 'top') {
        return [x + 40, y];
      }
      else if (type === 'bottom') {
        return [x + 40, y + 80];
      }     

      return [0,0]
    }

    linkingStart(index: number) {
      this.workflow.action.linking = true;
      this.workflow.draggingLink = {
        from: index,
        mx: 0,
        my: 0,
      };
    }

    linkingStop(index:number) {
      // add new Link
      if (this.workflow.draggingLink && this.workflow.draggingLink.from !== index) {
        // check link existence
        const existed = this.workflow.scene.links.find((link) => {
          return link.from === this.workflow.draggingLink.from && link.to === index;
        })
        if (!existed) {
          let maxID = Math.max(0, ...this.workflow.scene.links.map((link) => {
            return link.id
          }))
          const newLink = new Link();

            newLink.id =  maxID + 1;
            newLink.from = this.workflow.draggingLink.from;
            newLink.to = index;

          this.workflow.scene.links.push(newLink)
          this.$emit('linkAdded', newLink)
        }
      }
      this.workflow.draggingLink = null
    }

    linkDelete(id: number) {
      const deletedLink = this.workflow.scene.links.find((item) => {
          return item.id === id;
      });
      if (deletedLink) {
        this.workflow.scene.links = this.workflow.scene.links.filter((item) => {
            return item.id !== id;
        });
        this.$emit('linkBreak', deletedLink);
      }
    }

    nodeSelected(id: number, e: any) {
      this.workflow.action.dragging = id;
      this.workflow.action.selected = id;
      this.$emit('nodeClick', id);
      this.workflow.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft
      this.workflow.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop
    }

    handleMove(e:any) {
      if (this.workflow.action.linking) {
        [this.workflow.mouse.x, this.workflow.mouse.y] = getMousePosition(this.$el, e);
        [this.workflow.draggingLink.mx, this.workflow.draggingLink.my] = [this.workflow.mouse.x, this.workflow.mouse.y];
      }
      if (this.workflow.action.dragging) {
        this.workflow.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft
        this.workflow.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop
        let diffX = this.workflow.mouse.x - this.workflow.mouse.lastX;
        let diffY = this.workflow.mouse.y - this.workflow.mouse.lastY;
        this.workflow.mouse.lastX = this.workflow.mouse.x;
        this.workflow.mouse.lastY = this.workflow.mouse.y;
        this.moveSelectedNode(diffX, diffY);
      }
      if (this.workflow.action.scrolling) {
        [this.workflow.mouse.x, this.workflow.mouse.y] = getMousePosition(this.$el, e);
        let diffX = this.workflow.mouse.x - this.workflow.mouse.lastX;
        let diffY = this.workflow.mouse.y - this.workflow.mouse.lastY;
        this.workflow.mouse.lastX = this.workflow.mouse.x;
        this.workflow.mouse.lastY = this.workflow.mouse.y;
        this.workflow.scene.centerX += diffX;
        this.workflow.scene.centerY += diffY;
        // this.hasDragged = true
      }
    }

    handleUp(e:any) {
      const target = e.target || e.srcElement;
      if (this.$el.contains(target)) {
        if (typeof target.className !== 'string' || target.className.indexOf('node-input') < 0) {
          this.workflow.draggingLink = null;
        }
        if (typeof target.className === 'string' && target.className.indexOf('node-delete') > -1) {
          // console.log('delete2', this.action.dragging);
          this.nodeDelete(this.workflow.action.dragging);
        }
      }
      this.workflow.action.linking = false;
      this.workflow.action.dragging = null;
      this.workflow.action.scrolling = false;
    }

    handleDown(e: any) {
      const target = e.target || e.srcElement;
      // console.log('for scroll', target, e.keyCode, e.which)
      if ((target === this.$el || target.matches('svg, svg *')) && e.which === 1) {
        this.workflow.action.scrolling = true;
        [this.workflow.mouse.lastX, this.workflow.mouse.lastY] = getMousePosition(this.$el, e);
        this.workflow.action.selected = null; // deselectAll
      }
      this.$emit('canvasClick', e);
    }

    moveSelectedNode(dx: any, dy: any) {
      let index = this.workflow.scene.nodes.findIndex((item) => {
        return item.id === this.workflow.action.dragging
      })
      let left = this.workflow.scene.nodes[index].position.x + dx / this.workflow.scene.scale;
      let top = this.workflow.scene.nodes[index].position.y + dy / this.workflow.scene.scale;
      this.$set(this.workflow.scene.nodes, index, Object.assign(this.workflow.scene.nodes[index], {
        x: left,
        y: top,
      }));
    }

    nodeDelete(id: number | null) {
      this.workflow.scene.nodes = this.workflow.scene.nodes.filter((node) => {
        return node.id !== id;
      })
      this.workflow.scene.links = this.workflow.scene.links.filter((link) => {
        return link.from !== id && link.to !== id
      })
      this.$emit('nodeDelete', id)
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