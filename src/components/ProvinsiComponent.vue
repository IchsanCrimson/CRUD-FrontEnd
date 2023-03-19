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
      :error-msg="errorMsgUpdate"
      @onContainerClick="clickProvinsi"
      @onUpdateClick="updateProvinsi"
      @onDeleteClick="deleteProvinsi"
      @clearErrorMsg="errorMsgUpdate = ''"
    />

    <div v-if="visibleKabupatenList">
      <div v-if="kabupatenList && kabupatenList.length">
        <KabupatenComponent
            v-for="(kabupatenData, idx) in kabupatenList"
            :key="idx"
            :kabupaten-data="kabupatenData"
            @child-updated="childUpdatedReload"
            @child-deleted="loadKabupatenList"
            ref="kabupatenRefs"
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
          :error-msg="errorMsgAdd"
          @onAddClick="addKabupaten"
      />
    </div>
  </div>
</template>

<script>
import KabupatenComponent from "@/components/KabupatenComponent";
import ContainerTemplate from "@/components/ContainerTemplate";
import AddDataContainerTemplate from "@/components/AddDataContainerTemplate";
import EmptyTemplate from "@/components/EmptyTemplate";
import ReloadTemplate from "@/components/ReloadTemplate";

import {kabupaten, provinsi} from "@/utils/api";
import { mapGetters } from 'pinia';
import { useMenuStore } from "@/store/index";

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
      visibleProvinsiInfo: false,
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
      errorMsgUpdate: '',
      errorMsgAdd: '',
      visibleReload: false
    }
  },
  computed: {
    ...mapGetters(useMenuStore, ['isProvinsiMenu', 'isKabupatenMenu']),
    provinsiId() {
      return this.provinsiData.id;
    },
    provinsiName() {
      return this.provinsiData.name;
    }
  },
  methods: {
    loadKabupatenList() {
      return kabupaten.getAllWithProvinsiId({ provinsiId: this.provinsiId })
        .then(response => this.successGetAllKabupaten(response.data))
        .catch(response => this.failGetAllKabupaten(response));
    },
    successGetAllKabupaten(data) {
      this.kabupatenList = data;
      this.visibleReload = false;
    },
    failGetAllKabupaten() {
      this.visibleReload = true;
    },
    clickProvinsi() {
      this.resetErrorMsgAdd();
      if (!this.isProvinsiMenu) {
        this.visibleKabupatenList = !this.visibleKabupatenList;
        this.loadKabupatenList();
      } else {
        this.provinsiInfo = {
          provinsi: {
            id: this.provinsiId,
            name: this.provinsiName
          }
        }
        this.visibleProvinsiInfo = !this.visibleProvinsiInfo;
      }
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
      this.loadKabupatenList();
      this.resetErrorMsgAdd();
    },
    failAddKabupaten(response) {
      this.errorMsgAdd = response.response.data;
    },
    updateProvinsi(data) {
      const requestBody = {
        newProvinsiName: data.provinsi.name
      };
      provinsi.update(data.provinsi.id, requestBody)
        .then(() => this.successUpdateProvinsi(data))
        .catch(this.failUpdateProvinsi);
    },
    successUpdateProvinsi(data) {
      this.$emit('childUpdated', data);
      this.visibleProvinsiInfo = false;
    },
    failUpdateProvinsi(response) {
      this.errorMsgUpdate = response.response.data;
    },
    deleteProvinsi() {
      provinsi.delete(this.provinsiId)
        .then(this.successDeleteProvinsi)
        .catch(this.failDeleteProvinsi);
    },
    successDeleteProvinsi() {
      this.$emit('childDeleted');
      this.visibleProvinsiInfo = false;
    },
    failDeleteProvinsi(response) {
      console.log('fail', response);
    },
    childUpdatedReload(data) {
      this.$emit('childUpdated', data);
      if (!data.kecamatan) {
        this.loadKabupatenList();
      }
    },
    childUpdatedReloadByParent(data) {
      if (this.visibleKabupatenList && data.kecamatan) {
        const idx = this.kabupatenList.findIndex((kabupaten) => kabupaten.id == data.kabupaten.id);
        this.$refs.kabupatenRefs[idx].childUpdatedReloadByParent(data);
      } else if (this.visibleKabupatenList && data.kabupaten) {
        this.loadKabupatenList()
          .then(() => {
            const idx = this.kabupatenList.findIndex((kabupaten) => kabupaten.id == data.kabupaten.id);
            this.$refs.kabupatenRefs[idx].childUpdatedReloadByParent(data);
          });
      } else if (this.visibleProvinsiInfo && data.provinsi) {
        this.visibleProvinsiInfo = false;
      }
    },
    resetErrorMsgAdd() {
      this.errorMsgAdd = '';
    }
  },
  watch: {
    isProvinsiMenu(newValue) {
      if (newValue) {
        this.visibleKabupatenList = false;
      } else {
        this.visibleProvinsiInfo = false;
      }
    },
    isKabupatenMenu() {
      this.resetErrorMsgAdd();
    }
  }
}
</script>

<style scoped>
</style>