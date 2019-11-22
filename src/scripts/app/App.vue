<template>
  <div class="app">
   <h1> simple flowchart</h1>
    <div class="tool-wrapper">
    </div>
    
    <work-flow :workflow.sync="workflow" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WorkFlow from './components/workflow/workflow.component.vue';
import { IWorkFlow } from './components/workflow/workflow.type';
@Component({  
  components: { WorkFlow }
})
export default class extends Vue {
  public name = 'App';
  @Prop() workflow : IWorkFlow = {
    scene: {
      links : [],
      centerX: 1024,
        centerY: 140,
        scale: 1,
        nodes : [
          {
            id: 2,
            position : {              
               x: -357,
            y: 80,
            },
            type: 'Action',
            label: 'test1',
            options: {
              centerX: 0,
              scale : 0,
              centerY: 0
            },
            show: {
              delete : false
            }
          },
          { 
            position : {              
              x: -700,
              y: -69,
            },
            id: 4,           
            type: 'Script',
            label: 'test2',
            options: {
              centerX: 0,
              scale : 0,
              centerY: 0
            },
            show: {
              delete : false
            }
          },
          {
            id: 6,
            position : {   
            x: -557,
            y: 80,
            },
            type: 'Rule',
            label: 'test3',
            options: {
              centerX: 0,
              scale : 0,
              centerY: 0
            },
            show: {
              delete : false
            }
          }

        ]
    },
    height: 800,
    action: {
      linking: false,
      dragging: 0,
      scrolling:false,
      selected:0
    },
    mouse:{
      x:0,
      y:0,
      lastX:0,
      lastY:0
    },
    rootDivOffset: {
      top:0,
      left:0
    },
    draggingLink :{}

  }
}
</script>

<style lang="scss" scoped>
</style>