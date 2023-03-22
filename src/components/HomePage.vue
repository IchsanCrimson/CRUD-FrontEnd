<template>
  <div>
    <HeaderComponent />

    <div class="menu-table">
      <MenuOptions />
      <div>
        <div v-if="provinsiList && provinsiList.length">
          <ProvinsiComponent
              v-for="(provinsiData, idx) in provinsiList"
              :key="idx"
              :provinsi-data="provinsiData"
          />
        </div>
        <ReloadTemplate
            v-else-if="visibleReload"
            :custom-margin-left="customProvinsiMarginLeft"
            @click="loadProvinsiList"
        />
        <EmptyTemplate
            v-else
            :label="'Provinsi'"
            :custom-margin-left="customProvinsiMarginLeft"
        />

        <AddDataContainerTemplate
            v-if="isProvinsiMenu"
            :label="'Provinsi'"
            :unique-id="'provinsi'"
            :custom-margin-left="customProvinsiMarginLeft"
            :custom-grid-template-columns="customProvinsiGridTemplateColumns"
            :error-msg="errorMsg.add"
            @onAddClick="addProvinsi"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import ProvinsiComponent from "@/components/ProvinsiComponent";
import AddDataContainerTemplate from "@/components/template/AddDataContainerTemplate";
import MenuOptions from "@/components/MenuOptions";
import EmptyTemplate from "@/components/template/EmptyTemplate";
import ReloadTemplate from "@/components/template/ReloadTemplate";

import { provinsi } from "@/utils/api";
import { mapActions, mapGetters, mapState } from 'pinia';
import { useMenuStore, useProvinsiStore } from "@/store";

export default {
  name: 'HomePage',
  components: {
    ReloadTemplate,
    EmptyTemplate,
    HeaderComponent,
    ProvinsiComponent,
    MenuOptions,
    AddDataContainerTemplate
  },
  data() {
    return {
      provinsiList: [],
      customProvinsiGridTemplateColumns: {
        'grid-template-columns': '15% 75% 10%'
      },
      customProvinsiMarginLeft: {},
      errorMsg: {},
      visibleReload: false
    }
  },
  created() {
    this.loadProvinsiList();
  },
  computed: {
    ...mapState(useProvinsiStore, ['reloadProvinsiList']),
    ...mapGetters(useMenuStore, ['isProvinsiMenu'])
  },
  methods: {
    // Component Methods
    ...mapActions(useProvinsiStore, ['triggerReloadProvinsiList']),
    resetErrorMsg() {
      this.errorMsg = {};
    },

    // API Methods
    loadProvinsiList() {
      provinsi.getAll()
        .then(response => this.successGetAllProvisni(response.data))
        .catch(this.failGetAllProvinsi);
    },
    successGetAllProvisni(data) {
      this.provinsiList = data; 
      this.visibleReload = false;
    },
    failGetAllProvinsi() {
      this.visibleReload = true;
    },
    addProvinsi(name) {
      const data = {
        newProvinsiName: name
      };

      provinsi.create(data)
        .then(this.successAddProvisni)
        .catch(this.failAddProvinsi);
    },
    successAddProvisni() {
      this.triggerReloadProvinsiList();
      this.resetErrorMsg();
    },
    failAddProvinsi(response) {
      this.errorMsg.add = response.response.data;
    }
  },
  watch: {
    isProvinsiMenu() {
      this.resetErrorMsg();
    },
    reloadProvinsiList() {
      this.loadProvinsiList();
    }
  }
}
</script>

<style scoped>
.menu-table {
  display: flex;
  flex-direction: column;
  border-radius: 2vw;
  margin: 2% 10%;
}
</style>
