<template>
  <div
      class="container text template-name"
      :style="[customMarginLeft, customGridTemplateColumns]"
      @click="onContainerClick"
  >
    <div>- {{ nameLabel }}:</div>
    <div class="template-name-text">{{ nameValue }}</div>

    <div class="justify-end align-center" v-if="isBase">Info</div>
    <div class="justify-end align-center" v-else-if="visibleList">v</div>
    <div class="justify-end align-center" v-else>></div>
  </div>

  <div
      class="container text template-info"
      :style="customMarginLeft"
      v-if="visibleInfo"
  >
    <div class="template-info-container">
      <div v-if="infoData && infoData.provinsi">
        <InfoEditTemplate
            v-if="isEdit"
            :info-label="'Provinsi'"
            :info-data="infoData.provinsi"
            :is-base="isProvinsiMenu"
            :dropdown-list="provinsiList"
            :z-index="'3'"
            @reload-dropdown="reloadDropdownProvinsi"
            @update-data-emitted="emitUpdateDataProvinsi"
            ref="editProvinsi"
        />
        <InfoTemplate
            v-else
            :info-label="'Provinsi'"
            :info-data="infoData.provinsi"
        />
      </div>

      <div v-if="infoData && infoData.kabupaten">
        <InfoEditTemplate
            v-if="isEdit"
            :info-label="'Kabupaten'"
            :info-data="infoData.kabupaten"
            :is-base="isKabupatenMenu"
            :dropdown-list="kabupatenList"
            :z-index="'2'"
            @update-data-emitted="emitUpdateDataKabupaten"
            ref="editKabupaten"
        />
        <InfoTemplate
            v-else
            :info-label="'Kabupaten'"
            :info-data="infoData.kabupaten"
        />
      </div>

      <div v-if="infoData && infoData.kecamatan">
        <InfoEditTemplate
            v-if="isEdit"
            :info-label="'Kecamatan'"
            :info-data="infoData.kecamatan"
            :is-base="isKecamatanMenu"
            :dropdown-list="[]"
            :z-index="'1'"
            @update-data-emitted="emitUpdateDataKecamatan"
            ref="editKecamatan"
        />
        <InfoTemplate
            v-else
            :info-label="'Kecamatan'"
            :info-data="infoData.kecamatan"
        />
      </div>

      <InfoTemplate
          v-if="errorMsg && errorMsg.length"
          :info-label="'Error'"
          :info-data="getErrorMsg"
          style="color: red"
      />
    </div>
    <div
        class="justify-end align-center template-info-button"
        @click="onEditOrSaveClick"
    >
      <div v-if="isEdit">Save</div>
      <div v-else>Edit</div>
    </div>
    <div
        class="justify-end align-center template-info-button"
        @click="onDeleteOrCancelClick"
    >
      <div v-if="isEdit">Cancel</div>
      <div v-else>Delete</div>
    </div>
  </div>
</template>

<script>
import InfoTemplate from "@/components/template/InfoTemplate";
import InfoEditTemplate from "@/components/template/InfoEditTemplate";

import {mapGetters} from "pinia/dist/pinia";
import {useMenuStore} from "@/store";
import {kabupaten, provinsi} from "@/utils/api";

export default {
  name: "ContainerTemplate",
  components: {
    InfoEditTemplate,
    InfoTemplate
  },
  props: {
    nameLabel: {
      type: String
    },
    nameValue: {
      type: String
    },
    isBase: {
      type: Boolean
    },
    visibleList: {
      type: Boolean
    },
    visibleInfo: {
      type: Boolean
    },
    infoData: {
      type: Object
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
  data() {
    return {
      isEdit: false,
      provinsiList: [],
      kabupatenList: [],
      collectedUpdateData: {}
    }
  },
  computed: {
    ...mapGetters(useMenuStore, ['isProvinsiMenu', 'isKabupatenMenu', 'isKecamatanMenu']),
    getErrorMsg() {
      if (this.errorMsg.includes('name_key') && this.errorMsg.includes('SQL')) {
        return {name: 'Name must be unique'};
      }
      return {name: this.errorMsg};
    }
  },
  methods: {
    // Component Methods
    onContainerClick() {
      this.$emit('onContainerClick');
      this.resetErrorMsg();
    },
    onEditOrSaveClick() {
      this.resetErrorMsg();
      if (this.isEdit) {
        this.isEdit = false;
        this.$refs.editProvinsi.fetchUpdateData();
      } else {
        if (this.isKabupatenMenu) {
          this.loadProvinsiList();
        } else if (this.isKecamatanMenu) {
          this.loadProvinsiList();
          this.loadKabupatenList(this.infoData.provinsi.id);
        }
        this.isEdit = true;
      }
    },
    onDeleteOrCancelClick() {
      this.resetErrorMsg();
      if (this.isEdit) {
        this.isEdit = false;
      } else {
        this.$emit('onDeleteClick');
      }
    },
    reloadDropdownProvinsi(value) {
      if (this.isKecamatanMenu) {
        this.loadKabupatenList(value.id);
      }
    },
    emitUpdateDataProvinsi(data) {
      this.collectedUpdateData = {
        provinsi: {
          ...data
        }
      };

      if (this.isProvinsiMenu) {
        this.$emit('onUpdateClick', this.collectedUpdateData);
        this.collectedUpdateData = {};
      } else {
        this.$refs.editKabupaten.fetchUpdateData();
      }
    },
    emitUpdateDataKabupaten(data) {
      this.collectedUpdateData = {
        ...this.collectedUpdateData,
        kabupaten: {
          ...data
        }
      };

      if (this.isKabupatenMenu) {
        this.$emit('onUpdateClick', this.collectedUpdateData);
        this.collectedUpdateData = {};
      } else {
        this.$refs.editKecamatan.fetchUpdateData();
      }
    },
    emitUpdateDataKecamatan(data) {
      this.collectedUpdateData = {
        ...this.collectedUpdateData,
        kecamatan: {
          ...data
        }
      };
      this.$emit('onUpdateClick', this.collectedUpdateData);
      this.collectedUpdateData = {};
    },
    resetErrorMsg() {
      this.$emit('clearErrorMsg');
    },

    // API Methods
    loadProvinsiList() {
      provinsi.getAll()
        .then(response => this.successGetAllProvisni(response.data))
        .catch(this.failGetAllProvinsi);
    },
    successGetAllProvisni(data) {
      this.provinsiList = data;
    },
    failGetAllProvinsi(response) {
      console.log('fail', response);
    },
    loadKabupatenList(id) {
      kabupaten.getAllWithProvinsiId({ provinsiId: id })
        .then(response => this.successGetAllKabupaten(response.data))
        .catch(response => this.failGetAllKabupaten(response));
    },
    successGetAllKabupaten(data) {
      this.kabupatenList = data;
    },
    failGetAllKabupaten(response) {
      console.log('fail', response);
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 2vw;
}

.container {
  border-style: solid;
  border-color: grey;
  border-width: 0.1vw;
  padding: 1%;
}

.template-name {
  display: grid;
  text-align: start;
  background-color: bisque;
}

.template-name:hover {
  cursor: pointer;
  color: white;
  background-color: seagreen;
}

.template-name-text {
  word-wrap: break-word;
}

.justify-end {
  justify-self: end;
}

.align-center {
  align-self: center;
}

.template-info {
  display: grid;
  grid-template-columns: 80% 10% 10%;
  background-color: gainsboro;
}

.template-info-container {
  margin: 1vh 0;
}

.template-info-button:hover {
  cursor: pointer;
  color: black;
}
</style>