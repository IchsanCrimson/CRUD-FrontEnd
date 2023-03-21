<template>
  <div>
    <ContainerTemplate
        :name-label="'Kabupaten'"
        :name-value="kabupatenName"
        :is-base="isKabupatenMenu"
        :visible-list="visibleKecamatanList"
        :visible-info="visibleKabupatenInfo"
        :info-data="kabupatenInfo"
        :custom-grid-template-columns="customGridTemplateColumns"
        :custom-margin-left="customMarginLeft"
        :error-msg="errorMsgUpdate"
        @onContainerClick="clickKabupaten"
        @onUpdateClick="updateKabupaten"
        @onDeleteClick="deleteKabupaten"
        @clearErrorMsg="errorMsgUpdate = ''"
    />

    <div v-if="visibleKecamatanList">
      <div v-if="kecamatanList && kecamatanList.length">
        <KecamatanComponent
            v-for="(kecamatanData, idx) in kecamatanList"
            :key="idx"
            :kecamatan-data="kecamatanData"
            @child-updated="childUpdatedReload"
            @child-deleted="loadKecamatanList"
            ref="kecamatanRefs"
        />
      </div>
      <ReloadTemplate
          v-else-if="visibleReload"
          :custom-margin-left="customKecamatanMarginLeft"
          @click="loadKecamatanList"
      />
      <EmptyTemplate
          v-else
          :label="'Kecamatan'"
          :custom-margin-left="customKecamatanMarginLeft"
      />

      <AddDataContainerTemplate
          v-if="isKecamatanMenu"
          :label="'Kecamatan'"
          :unique-id="'kecamatan' + kabupatenId"
          :custom-margin-left="customKecamatanMarginLeft"
          :custom-grid-template-columns="customKecamatanGridTemplateColumns"
          :error-msg="errorMsgAdd"
          @onAddClick="addKecamatan"
      />
    </div>
  </div>
</template>

<script>
import KecamatanComponent from "@/components/KecamatanComponent";
import ContainerTemplate from "@/components/ContainerTemplate";
import AddDataContainerTemplate from "@/components/AddDataContainerTemplate";
import EmptyTemplate from "@/components/EmptyTemplate";
import ReloadTemplate from "@/components/ReloadTemplate";

import {kabupaten, kecamatan} from "@/utils/api";
import { mapGetters } from 'pinia';
import { useMenuStore } from "@/store/index";

export default {
  name: "KabupatenComponent",
  components: {
    KecamatanComponent,
    ContainerTemplate,
    AddDataContainerTemplate,
    EmptyTemplate,
    ReloadTemplate
  },
  props: {
    kabupatenData: {
      type: Object
    }
  },
  data() {
    return {
      kecamatanList: [],
      visibleKecamatanList: false,
      visibleKabupatenInfo: false,
      kabupatenInfo: {},
      customGridTemplateColumns: {
        'grid-template-columns': '20% 70% 10%'
      },
      customMarginLeft: {
        'margin-left': '2%'
      },
      customKecamatanGridTemplateColumns: {
        'grid-template-columns': '25% 65% 10%'
      },
      customKecamatanMarginLeft: {
        'margin-left': '4%'
      },
      errorMsgUpdate: '',
      errorMsgAdd: '',
      visibleReload: false
    }
  },
  computed: {
    ...mapGetters(useMenuStore, ['isKabupatenMenu', 'isKecamatanMenu']),
    kabupatenId() {
      return this.kabupatenData.id;
    },
    kabupatenName() {
      return this.kabupatenData.name;
    }
  },
  methods: {
    // Component Methods
    clickKabupaten() {
      this.resetErrorMsgAdd();
      if (this.isKecamatanMenu) {
        this.visibleKecamatanList = !this.visibleKecamatanList;
        this.loadKecamatanList();
      } else {
        if (this.visibleKabupatenInfo) {
          this.visibleKabupatenInfo = false;
        } else {
          this.loadKabupatenInfo();
        }
      }
    },
    childUpdatedReload(data) {
      this.$emit('childUpdated', data);
      this.loadKecamatanList();
    },
    childUpdatedReloadByParent(data) {
      if (this.visibleKecamatanList && data.kecamatan) {
        this.loadKecamatanList()
          .then(() => {
            const idx = this.kecamatanList.findIndex((kecamatan) => kecamatan.id == data.kecamatan.id);
            this.$refs.kecamatanRefs[idx].childUpdatedReloadByParent(data);
          });
      } else if (this.visibleKabupatenInfo && data.kabupaten) {
        this.visibleKabupatenInfo = false;
      }
    },
    resetErrorMsgAdd() {
      this.errorMsgAdd = '';
    },

    // API Methods
    loadKecamatanList() {
      return kecamatan.getAllWithKabupatenId({ kabupatenId: this.kabupatenId })
        .then(response => this.successGetAllKecamatan(response.data))
        .catch(response => this.failGetAllKecamatan(response));
    },
    successGetAllKecamatan(data) {
      this.kecamatanList = data;
      this.visibleReload = false;
    },
    failGetAllKecamatan() {
      this.visibleReload = true;
    },
    loadKabupatenInfo() {
      kabupaten.info(this.kabupatenId)
        .then(response => this.successGetKabupatenInfo(response.data))
        .catch(response => this.failGetKabupatenInfo(response));
    },
    successGetKabupatenInfo(data) {
      this.kabupatenInfo = {
        provinsi: {
          id: data.provinsiId,
          name:  data.provinsiName
        },
        kabupaten: {
          id: data.id,
          name:  data.name
        },
      };
      this.visibleKabupatenInfo = true;
    },
    failGetKabupatenInfo(response) {
      console.log('fail', response);
    },
    addKecamatan(name) {
      const data = {
        kabupatenId: this.kabupatenId,
        newKecamatanName: name
      };

      kecamatan.create(data)
        .then(this.successAddKecamatan)
        .catch(this.failAddKecamatan);
    },
    successAddKecamatan() {
      this.loadKecamatanList();
      this.resetErrorMsgAdd();
    },
    failAddKecamatan(response) {
      this.errorMsgAdd = response.response.data;
    },
    updateKabupaten(data) {
      const requestBody = {
        provinsiId: data.provinsi.id,
        newKabupatenName: data.kabupaten.name
      };
      kabupaten.update(data.kabupaten.id, requestBody)
        .then(() => this.successUpdateKabupaten(data))
        .catch(this.failUpdateKabupaten);
    },
    successUpdateKabupaten(data) {
      this.$emit('childUpdated', data);
      this.visibleKabupatenInfo = false;
    },
    failUpdateKabupaten(response) {
      this.errorMsgUpdate = response.response.data;
    },
    deleteKabupaten() {
      kabupaten.delete(this.kabupatenId)
        .then(this.successDeleteKabupaten)
        .catch(this.failDeleteKabupaten);
    },
    successDeleteKabupaten() {
      this.$emit('childDeleted');
      this.visibleKabupatenInfo = false;
    },
    failDeleteKabupaten(response) {
      console.log('fail', response);
    }
  },
  watch: {
    isKabupatenMenu(newValue) {
      if (newValue) {
        this.visibleKecamatanList = false;
      } else {
        this.visibleKabupatenInfo = false;
      }
    },
    isKecamatanMenu() {
      this.resetErrorMsgAdd();
    }
  }
}
</script>

<style scoped>
</style>