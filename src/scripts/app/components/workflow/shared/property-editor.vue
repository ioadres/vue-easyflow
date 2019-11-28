<template>
  <div class="property-container" v-show="isVisible">
    <div class="property-legend">
      <p>Propiedades</p>
    </div>
    <div class="property-main">
      <div class="property">
        <div class="label">Titulo</div>
        <div class="input">
          <input v-model="node.label" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { INode } from "../../../shared/workflow/node.type";

@Component
export default class extends Vue {
  public Name = "PropertyEditor";
  @Prop() isVisible: boolean = false;
  @Prop() node?: INode;
}
</script>

<style scoped lang="scss">
.property-container {
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
  width: 250px;
  border-left: 3px solid #b5b1b1;
  border: 2px solid #b5b1b1;
  float: right;
  clear: both;
  height: 100vh;

  .property-legend {
    border-bottom: 1px solid #b5b1b1;
    text-align: center;
    p {
      font-size: 12px;
    }
  }

  .property-main {
    font-size: 10px;
    .property {
      width: 100%;
      display: inline-flex;
      border-bottom: 1px solid #b5b1b1;

          font-size: 12px;
      .label {
        padding: 5px;
        font-weight: 700;
        width: 20%;
        border-right: 1px solid #eee;
      }

      .input {
        padding-right: 2px;
        width: 80%;
        input {
          width: 100%;
          height: 28px;
          border: 0px;
          text-align: center;
        }
      }
    }
  }
}
</style>