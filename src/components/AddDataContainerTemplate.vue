<template>
  <div>
    <div
        class="template-add"
        :style="[customGridTemplateColumns, customMarginLeft]"
    >
      <div>- {{ label }}: </div>
      <div
          :id="'template-input-' + uniqueId"
          class="template-add-detail-input"
          contenteditable="true"
      />
      <div
          class="template-add-button"
          @click="addClicked"
      >
        Add
      </div>
    </div>

    <div
        v-if="errorMsg && errorMsg.length"
        class="add-error-container"
        :style="[customMarginLeft]"
    >
      Error: {{getErrorMsg}}
    </div>
  </div>
</template>

<script>
export default {
  name: "AddDataContainerTemplate",
  props: {
    label: {
      type: String
    },
    uniqueId: {
      type: String
    },
    customGridTemplateColumns: {
      type: Object
    },
    customMarginLeft: {
      type: Object
    },
    errorMsg: {
      type: String
    }
  },
  computed: {
    getErrorMsg() {
      if (this.errorMsg.includes('name_key') && this.errorMsg.includes('SQL')) {
        return 'Name must be unique';
      }
      return this.errorMsg;
    }
  },
  methods: {
    addClicked() {
      const name = document.getElementById('template-input-' + this.uniqueId).innerHTML;
      this.$emit('onAddClick', name);
      document.getElementById('template-input-' + this.uniqueId).innerHTML = '';
    }
  }
}
</script>

<style scoped>
.template-add {
  display: grid;
  border-style: solid;
  border-width: 0.1vw;
  border-color: grey;
  text-align: start;
  padding: 1%;
  font-size: 2vw;
  background-color: bisque;
}

.template-add-button {
  justify-self: end;
  align-self: center;
}

.template-add-button:hover {
  cursor: pointer;
  color: black;
}

.template-add-detail-input {
  font-size: 2vw;
  background-color: white;
  color: grey;
  padding: 0 2%;
  border-style: solid;
  border-radius: 0.5vw;
  border-width: 0.1vw;
  width: 90%;
}

.template-add-detail-input:focus {
  outline: none;
}

.add-error-container {
  font-size: 2vw;
  color: red;
  background-color: bisque;
  border-style: solid;
  display: flex;
  justify-content: flex-start;
  padding: 1%;
  word-break: break-all;
}
</style>