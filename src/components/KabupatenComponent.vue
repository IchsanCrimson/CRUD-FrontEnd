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
        :error-msg="errorMsg.update"
        @onContainerClick="clickKabupaten"
        @onUpdateClick="updateKabupaten"
        @onDeleteClick="deleteKabupaten"
        @clearErrorMsg="resetErrorMsg"
    />

    <div v-if="visibleKecamatanList">
      <div v-if="kecamatanList && kecamatanList.length">
        <KecamatanComponent
            v-for="(kecamatanData, idx) in kecamatanList"
            :key="idx"
            :kecamatan-data="kecamatanData"
            @onUmount="resetVisibleKecamatanInfo"
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
          :error-msg="errorMsg.add"
          @onAddClick="addKecamatan"
      />
    </div>
  </div>
</template>

<script>
import KecamatanComponent from "@/components/KecamatanComponent";
import ContainerTemplate from "@/components/template/ContainerTemplate";
import AddDataContainerTemplate from "@/components/template/AddDataContainerTemplate";
import EmptyTemplate from "@/components/template/EmptyTemplate";
import ReloadTemplate from "@/components/template/ReloadTemplate";

import { kabupaten, kecamatan } from "@/utils/api";
import { mapActions, mapGetters, mapState } from 'pinia';
import { useMenuStore, useKabupatenStore, useKecamatanStore } from "@/store";

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
      errorMsg: {},
      visibleReload: false
    }
  },
  created() {
    if (this.visibleKabupatenInfo) {
      this.loadKabupatenInfo();
    }
  },
  beforeUnmount() {
    this.visibleKecamatanList = false;
    this.$emit('onUnmount', this.kabupatenId);
  },
  computed: {
    ...mapGetters(useMenuStore, ['isKabupatenMenu', 'isKecamatanMenu']),
    ...mapState(useKabupatenStore, ['visibleKabupatenInfoList']),
    ...mapState(useKecamatanStore, ['reloadKecamatanList', 'reloadKecamatanListWithId']),
    kabupatenId() {
      return this.kabupatenData.id;
    },
    kabupatenName() {
      return this.kabupatenData.name;
    },
    visibleKabupatenInfo() {
      return this.visibleKabupatenInfoList[this.kabupatenId];
    }
  },
  methods: {
    // Component Methods
    ...mapActions(useKabupatenStore, ['triggerReloadKabupatenList', 'updateVisibleKabupatenInfo', 'removeVisibleKabupatenInfo']),
    ...mapActions(useKecamatanStore, ['triggerReloadKecamatanList', 'removeVisibleKecamatanInfo']),
    clickKabupaten() {
      this.resetErrorMsg();
      if (this.isKecamatanMenu) {
        this.visibleKecamatanList = !this.visibleKecamatanList;
        this.loadKecamatanList();
      } else {
        if (this.visibleKabupatenInfo) {
          this.updateVisibleKabupatenInfo(this.kabupatenId, false);
        } else {
          this.loadKabupatenInfo();
        }
      }
    },
    resetErrorMsg() {
      this.errorMsg = {};
    },
    resetVisibleKecamatanInfo(kecamatanId) {
      if (!this.visibleKecamatanList) {
        this.removeVisibleKecamatanInfo(kecamatanId);
      }
    },

    // API Methods
    loadKecamatanList() {
      kecamatan.getAllWithKabupatenId({ kabupatenId: this.kabupatenId })
        .then(response => this.successGetAllKecamatan(response.data))
        .catch(this.failGetAllKecamatan);
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
      this.updateVisibleKabupatenInfo(this.kabupatenId, true);
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
      this.triggerReloadKecamatanList({old: this.kabupatenId, new: this.kabupatenId});
      this.resetErrorMsg();
    },
    failAddKecamatan(response) {
      this.errorMsg.add = response.response.data;
    },
    updateKabupaten(data) {
      const requestBody = {
        provinsiId: data.provinsi.id,
        newKabupatenName: data.kabupaten.name
      };
      kabupaten.update(data.kabupaten.id, requestBody)
        .then(() => this.successUpdateKabupaten(requestBody.provinsiId))
        .catch(this.failUpdateKabupaten);
    },
    successUpdateKabupaten(newId) {
      const oldId = this.kabupatenInfo.provinsi.id;
      this.triggerReloadKabupatenList({old: oldId, new: newId});
    },
    failUpdateKabupaten(response) {
      this.errorMs.update = response.response.data;
    },
    deleteKabupaten() {
      kabupaten.delete(this.kabupatenId)
        .then(this.successDeleteKabupaten)
        .catch(this.failDeleteKabupaten);
    },
    successDeleteKabupaten() {
      const provinsiId = this.kabupatenInfo.provinsi.id;
      this.triggerReloadKabupatenList({old: provinsiId, new: provinsiId});
      this.removeVisibleKabupatenInfo(this.kabupatenId);
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
        this.updateVisibleKabupatenInfo(this.kabupatenId, false);
      }
    },
    isKecamatanMenu() {
      this.resetErrorMsg();
    },
    reloadKecamatanList() {
      if (this.visibleKecamatanList && 
      (this.kabupatenId == this.reloadKecamatanListWithId.old || this.kabupatenId == this.reloadKecamatanListWithId.new)) {
        this.loadKecamatanList();
      }
    },
    kabupatenData() {
      if (this.visibleKabupatenInfo) {
        this.loadKabupatenInfo();
      }
    }
  }
}
</script>

<style scoped>
</style>