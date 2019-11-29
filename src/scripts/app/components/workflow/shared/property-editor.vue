<template>
  <div class="property-container" v-show="isVisible">
    <div class="legend">
      <span>Componente</span>
    </div>
    <div class="property-main">
      <div class="property">
        <div class="label">Titulo</div>
        <div class="input">
          <input v-model="node.label" />
        </div>
      </div>
    </div>
    <div class="legend">
      <span>Propiedades</span>
    </div>
    <div class="property-main">
      <div v-for="(property, index) in properties" :key="`property-${index}`">
        <div class="property" v-if="typeof node.custom[property] !== 'object'">
          <div class="label">{{property}}</div>
          <div class="input">
            <input :value="node.custom[property]" @input="update(node.custom,property, $event)" />
          </div>
        </div>
        <div v-else class="object">
          <div class="object-legend">{{property}}</div>
          <div
            v-for="(propertyChild, index) in  propertiesMap(node.custom[property])"
            :key="`property-child-${index}`"
            class="object-main"
          >
            <div class="label">{{propertyChild}}</div>
            <div class="input">
              <input
                :value="node.custom[property][propertyChild]"
                @input="update(node.custom[property],propertyChild, $event)"
              />
            </div>
          </div>
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
  @Prop() node!: INode;

  get properties() {
    if (this.node && this.node.custom !== undefined) {
      return this.propertiesMap(this.node.custom);
    }
    return {};
  }

  propertiesMap(object: any) {
    let properties = Object.getOwnPropertyNames(object);
    return properties.filter(x => x !== "__ob__").sort();
  }
  update(obj: any, prop: string, e: any) {
    Vue.set(obj, prop, e.target.value);
  }
}
</script>

<style scoped lang="scss">
.property-container {
  font-family: Helvetica Neue, Segoe UI, Helvetica, Arial, sans-serif;
  width: 500px;
  border-left: 3px solid #1e1e1e;
  background-color: #333333;
  border: 2px solid #1e1e1e;
  float: right;
  clear: both;
  height: 100vh;

  .legend {
    background-color: #1e1e1e;
    color: #b1b2b3;
    padding: 12px;
    text-align: center;
    font-size: 15px;
  }

  .property-main {
    font-size: 10px;
    .object {
      width: 100%;
      font-size: 12px;
      border-top: 3px dotted #444444;
      border-bottom: 3px dotted #444444;

      .object-legend {
        background-color: #1e1e1e;
        color: #b1b2b3;
        padding-top: 8px;
        padding-bottom: 8px;
        text-align: center;
        font-size: 14px;
        width: 100%;
        border-bottom: 1px solid #313131;
      }
      .object-main {
        display: inline-flex;

        width: 100%;
        .label {
          color: #b1b2b3;
          padding: 5px;
          font-weight: 500;
          width: 20%;
          text-align: right;
          padding-right: 10px;
          border-right: 1px solid #1e1e1e;
        }

        .input {
          padding-right: 2px;
          width: 80%;
          border-bottom: 1px solid #1e1e1e;
          input {
            width: 100%;
            height: 28px;
            border: 0px;
            text-align: center;
            background-color: #3c3c3c;
            color: #fff;
          }
        }
      }
    }
    .property {
      width: 100%;
      display: inline-flex;
      border-bottom: 1px solid #1e1e1e;
      font-size: 12px;

      .label {
        color: #b1b2b3;
        padding: 5px;
        font-weight: 500;
        width: 20%;
        text-align: right;
        padding-right: 10px;

        border-right: 1px solid #1e1e1e;
      }

      .input {
        padding-right: 2px;
        width: 80%;
        border-bottom: 1px solid #1e1e1e;
        input {
          width: 100%;
          height: 28px;
          border: 0px;
          text-align: center;
          background-color: #3c3c3c;
          color: #fff;
        }
      }
    }
  }
}
</style>