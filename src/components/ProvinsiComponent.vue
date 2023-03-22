<template>
  <div>
    <ContainerTemplate
      :name-label="'Provinsi'"
      :name-value="provinsiName"
      :is-base="isProvinsiMenu"
      :visible-list="visibleKabupatenList"
      :visible-info="visibleProvinsiInfo"
      :info-data="provinsiInfo"
      :custom-grid-template-columns="customGridTemplateColumns"
      :custom-margin-left="customMarginLeft"
      :error-msg="errorMsg.update"
      @onContainerClick="clickProvinsi"
      @onUpdateClick="updateProvinsi"
      @onDeleteClick="deleteProvinsi"
      @clearErrorMsg="resetErrorMsg"
    />

    <div v-if="visibleKabupatenList">
      <div v-if="kabupatenList && kabupatenList.length">
        <KabupatenComponent
            v-for="(kabupatenData, idx) in kabupatenList"
            :key="idx"
            :kabupaten-data="kabupatenData"
            @onUnmount="resetVisibleKabupatenInfo"
        />
      </div>
      <ReloadTemplate
          v-else-if="visibleReload"
          :custom-margin-left="customKabupatenMarginLeft"
          @click="loadKabupatenList"
      />
      <EmptyTemplate
          v-else
          :label="'Kabupaten'"
          :custom-margin-left="customKabupatenMarginLeft"
      />

      <AddDataContainerTemplate
          v-if="isKabupatenMenu"
          :label="'Kabupaten'"
          :unique-id="'kabupaten' + provinsiId"
          :custom-margin-left="customKabupatenMarginLeft"
          :custom-grid-template-columns="customKabupatenGridTemplateColumns"
          :error-msg="errorMsg.add"
          @onAddClick="addKabupaten"
      />
    </div>
  </div>
</template>

<script>
import KabupatenComponent from "@/components/KabupatenComponent";
import ContainerTemplate from "@/components/template/ContainerTemplate";
import AddDataContainerTemplate from "@/components/template/AddDataContainerTemplate";
import EmptyTemplate from "@/components/template/EmptyTemplate";
import ReloadTemplate from "@/components/template/ReloadTemplate";

import { kabupaten, provinsi } from "@/utils/api";
import { mapActions, mapGetters, mapState } from 'pinia';
import { useMenuStore, useProvinsiStore, useKabupatenStore } from "@/store";

export default {
  name: "ProvinsiComponent",
  components: {
    KabupatenComponent,
    ContainerTemplate,
    AddDataContainerTemplate,
    EmptyTemplate,
    ReloadTemplate
  },
  props: {
    provinsiData: {
      type: Object
    }
  },
  data() {
    return {
      kabupatenList: [],
      visibleKabupatenList: false,
      provinsiInfo: {},
      customGridTemplateColumns: {
        'grid-template-columns': '15% 75% 10%'
      },
      customMarginLeft: {},
      customKabupatenGridTemplateColumns: {
        'grid-template-columns': '20% 70% 10%'
      },
      customKabupatenMarginLeft: {
        'margin-left': '2%'
      },
      errorMsg: {},
      visibleReload: false
    }
  },
  created() {
    if (this.visibleProvinsiInfo) {
      this.loadProvinsiInfo();
    }
  },
  beforeUnmount() {
    this.visibleKabupatenList = false;
  },
  computed: {
    ...mapGetters(useMenuStore, ['isProvinsiMenu', 'isKabupatenMenu']),
    ...mapState(useProvinsiStore, ['visibleProvinsiInfoList']),
    ...mapState(useKabupatenStore, ['reloadKabupatenList', 'reloadKabupatenListWithId']),
    provinsiId() {
      return this.provinsiData.id;
    },
    provinsiName() {
      return this.provinsiData.name;
    },
    visibleProvinsiInfo() {
      return this.visibleProvinsiInfoList[this.provinsiId];
    }
  },
  methods: {
    // Component Methods
    ...mapActions(useProvinsiStore, ['triggerReloadProvinsiList', 'updateVisibleProvinsiInfo', 'removeVisibleProvinsiInfo']),
    ...mapActions(useKabupatenStore, ['triggerReloadKabupatenList', 'removeVisibleKabupatenInfo']),
    clickProvinsi() {
      this.resetErrorMsg();
      if (!this.isProvinsiMenu) {
        this.visibleKabupatenList = !this.visibleKabupatenList;
        this.loadKabupatenList();
      } else {
        if (this.visibleProvinsiInfo) {
          this.updateVisibleProvinsiInfo(this.provinsiId, false);
        } else {
          this.loadProvinsiInfo();
        }
      }
    },
    resetErrorMsg() {
      this.errorMsg = {};
    },
    resetVisibleKabupatenInfo(kabupatenId) {
      if (!this.visibleKabupatenList) {
        this.removeVisibleKabupatenInfo(kabupatenId);
      }
    },

    // API Methods
    loadProvinsiInfo() {
      this.provinsiInfo = {
        provinsi: {
          id: this.provinsiId,
          name: this.provinsiName
        }
      };
      this.updateVisibleProvinsiInfo(this.provinsiId, true);
    },
    loadKabupatenList() {
      kabupaten.getAllWithProvinsiId({ provinsiId: this.provinsiId })
        .then(response => this.successGetAllKabupaten(response.data))
        .catch(this.failGetAllKabupaten);
    },
    successGetAllKabupaten(data) {
      this.kabupatenList = data;
      this.visibleReload = false;
    },
    failGetAllKabupaten() {
      this.visibleReload = true;
    },
    addKabupaten(name) {
      const data = {
        provinsiId: this.provinsiId,
        newKabupatenName: name
      };

      kabupaten.create(data)
        .then(this.successAddKabupaten)
        .catch(this.failAddKabupaten);
    },
    successAddKabupaten() {
      this.triggerReloadKabupatenList({old: this.provinsiId, new: this.provinsiId});
      this.resetErrorMsg();
    },
    failAddKabupaten(response) {
      this.errorMsg.add = response.response.data;
    },
    updateProvinsi(data) {
      const requestBody = {
        newProvinsiName: data.provinsi.name
      };
      provinsi.update(data.provinsi.id, requestBody)
        .then(this.successUpdateProvinsi)
        .catch(this.failUpdateProvinsi);
    },
    successUpdateProvinsi() {
      this.triggerReloadProvinsiList();
    },
    failUpdateProvinsi(response) {
      this.errorMsg.update = response.response.data;
    },
    deleteProvinsi() {
      provinsi.delete(this.provinsiId)
        .then(this.successDeleteProvinsi)
        .catch(this.failDeleteProvinsi);
    },
    successDeleteProvinsi() {
      this.triggerReloadProvinsiList();
      this.removeVisibleProvinsiInfo(this.provinsiId);
    },
    failDeleteProvinsi(response) {
      console.log('fail', response);
    }
  },
  watch: {
    isProvinsiMenu(newValue) {
      if (newValue) {
        this.visibleKabupatenList = false;
      } else {
        this.updateVisibleProvinsiInfo(this.provinsiId, false);
      }
    },
    isKabupatenMenu() {
      this.resetErrorMsg();
    },
    reloadKabupatenList() {
      if (this.visibleKabupatenList && 
      (this.provinsiId == this.reloadKabupatenListWithId.old || this.provinsiId == this.reloadKabupatenListWithId.new)) {
        this.loadKabupatenList();
      }
    },
    provinsiData() {
      if (this.visibleProvinsiInfo) {
        this.loadProvinsiInfo();
      }
    }
  }
}
</script>

<style scoped>
</style>