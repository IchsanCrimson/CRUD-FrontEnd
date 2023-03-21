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
              @child-updated="childUpdatedReload"
              @child-deleted="loadProvinsiList"
              ref="provinsiRefs"
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
            :error-msg="errorMsgAdd"
            @onAddClick="addProvinsi"
        />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent";
import ProvinsiComponent from "@/components/ProvinsiComponent";
import AddDataContainerTemplate from "@/components/AddDataContainerTemplate";
import MenuOptions from "@/components/MenuOptions";
import EmptyTemplate from "@/components/EmptyTemplate";
import ReloadTemplate from "@/components/ReloadTemplate";

import { provinsi } from "@/utils/api";
import { mapGetters } from 'pinia';
import { useMenuStore } from "@/store/index";

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
      errorMsgAdd: '',
      visibleReload: false
    }
  },
  created() {
    this.loadProvinsiList();
  },
  computed: {
    ...mapGetters(useMenuStore, ['isProvinsiMenu'])
  },
  methods: {
    // Component Methods
    childUpdatedReload(data) {
      if (data.kecamatan) {
        const idx = this.provinsiList.findIndex((provinsi) => provinsi.id == data.provinsi.id);
        this.$refs.provinsiRefs[idx].childUpdatedReloadByParent(data);
      } else if (data.kabupaten) {
        const idx = this.provinsiList.findIndex((provinsi) => provinsi.id == data.provinsi.id);
        this.$refs.provinsiRefs[idx].childUpdatedReloadByParent(data);
      } else if (data.provinsi) {
        this.loadProvinsiList()
          .then(() => {
            const idx = this.provinsiList.findIndex((provinsi) => provinsi.id == data.provinsi.id);
            this.$refs.provinsiRefs[idx].childUpdatedReloadByParent(data)
          });
      }
    },
    resetErrorMsgAdd() {
      this.errorMsgAdd = '';
    },

    // API Methods
    loadProvinsiList() {
      return provinsi.getAll()
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
      this.loadProvinsiList();
      this.resetErrorMsgAdd();
    },
    failAddProvinsi(response) {
      this.errorMsgAdd = response.response.data;
    }
  },
  watch: {
    isProvinsiMenu() {
      this.resetErrorMsgAdd();
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
