<template>
  <div class="template-info-detail">
    <div class="justify-end">{{ infoLabel }}:</div>
    <div class="template-info-detail-name">
      <div
          v-if="isBase"
          :id="'template-input-' + infoLabel + infoData.id"
          class="template-info-input"
          contenteditable="true"
      >
        {{ infoData.name }}
      </div>
      <div v-else>
        <div>
          <div
              v-if="dropdownList && dropdownList.length"
              class="dropdown-btn"
              @click="onBtnClick"
          >
            <div>{{ activeValue.name }}</div>
            <div>v</div>
          </div>
          <div
              v-else
              class="dropdown-empty"
          >
            Empty {{ infoLabel }}
          </div>
        </div>
        <div
            class="dropdown-list"
            v-if="showDropdownList"
            :style="{'z-index': zIndex}"
        >
          <div
              class="dropdown-list-content"
              v-for="(eachValue, idx) in dropdownList"
              :key="idx"
              @click="onContentClick(eachValue)"
          >
            {{ eachValue.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InfoEditTemplate",
  props: {
    infoLabel: {
      type: String
    },
    infoData: {
      type: Object
    },
    isBase: {
      type: Boolean
    },
    dropdownList: {
      type: Array
    },
    zIndex: {
      type: String
    }
  },
  data() {
    return {
      showDropdownList: false,
      activeValue: this.infoData,
      ignoreWatch: true
    }
  },
  methods: {
    onBtnClick() {
      this.showDropdownList = !this.showDropdownList;
    },
    onContentClick(value) {
      this.activeValue = value;
      this.showDropdownList = false;
      this.$emit('reloadDropdown', value);
    },
    fetchUpdateData() {
      let updateData;
      if (this.isBase) {
        updateData = {
          id: this.infoData.id,
          name: document.getElementById('template-input-' + this.infoLabel + this.infoData.id).innerHTML
        };
      } else {
        updateData = this.activeValue;
      }
      this.$emit('updateDataEmitted', updateData);
    }
  },
  watch: {
    dropdownList() {
      if (this.ignoreWatch) {
        this.ignoreWatch = false;
      } else {
        this.activeValue = { name: 'Please choose' };
        this.showDropdownList = false;
      }
    }
  }
}
</script>

<style scoped>
.justify-end {
  justify-self: end;
}

.template-info-detail {
  display: grid;
  grid-template-columns: 30% 70%;
  margin: 1vh 0;
}

.template-info-detail-name {
  margin-left: 1vw;
  justify-self: start;
  align-self: center;
  width: 30vw;
  word-break: break-all;
  text-align: start;
}

.template-info-input {
  font-size: 2vw;
  background-color: white;
  color: grey;
  padding: 0 1vw;
  border-style: solid;
  border-radius: 0.5vw;
  border-width: 0.1vw;
  width: 28vw;
}

.template-info-input:focus {
  outline: none;
}

.dropdown-btn {
  display: flex;
  justify-content: space-between;
  background-color: white;
  border-style: solid;
  border-width: 0.1vw;
}

.dropdown-empty, .dropdown-btn {
  padding: 1% 1vw;
}

.dropdown-list {
  position: absolute;
  overflow-y: auto;
  height: 15vh;
}

.dropdown-list-content {
  background-color: white;
  border-left-style: solid;
  border-right-style: solid;
  border-bottom-style: solid;
  border-width: 0.1vw;
  width: 28vw;
  padding: 1% 1vw;
}

.dropdown-list-content:hover {
  color: white;
  background-color: darkgray;
}
</style>