<template>
  <div>
    <ContainerTemplate
        :name-label="'Kecamatan'"
        :name-value="kecamatanName"
        :is-base="isKecamatanMenu"
        :visible-list="false"
        :visible-info="visibleKecamatanInfo"
        :info-data="kecamatanInfo"
        :custom-grid-template-columns="customGridTemplateColumns"
        :custom-margin-left="customMarginLeft"
        :error-msg="errorMsg.update"
        @onContainerClick="clickKecamatan"
        @onUpdateClick="updateKecamatan"
        @onDeleteClick="deleteKecamatan"
        @clearErrorMsg="resetErrorMsg"
    />
  </div>
</template>

<script>
import ContainerTemplate from "@/components/template/ContainerTemplate";

import { mapActions, mapState, mapGetters } from 'pinia';
import { useMenuStore, useKecamatanStore } from "@/store";
import { kecamatan } from "@/utils/api";

export default {
  name: "KecamatanComponent",
  components: {
    ContainerTemplate
  },
  props: {
    kecamatanData: {
      type: Object
    }
  },
  data() {
    return {
      kecamatanInfo: {},
      customGridTemplateColumns: {
        'grid-template-columns': '25% 65% 10%'
      },
      customMarginLeft: {
        'margin-left': '4%'
      },
      errorMsg: {}
    }
  },
  created() {
    if (this.visibleKecamatanInfo) {
      this.loadKecamatanInfo();
    }
  },
  beforeUnmount() {
    this.$emit('onUmount', this.kecamatanId);
  },
  computed: {
    ...mapGetters(useMenuStore, ['isKecamatanMenu']),
    ...mapState(useKecamatanStore, ['visibleKecamatanInfoList']),
    kecamatanId() {
      return this.kecamatanData.id;
    },
    kecamatanName() {
      return this.kecamatanData.name;
    },
    visibleKecamatanInfo() {
      return this.visibleKecamatanInfoList[this.kecamatanId];
    }
  },
  methods: {
    // Component Methods
    ...mapActions(useKecamatanStore, ['triggerReloadKecamatanList', 'updateVisibleKecamatanInfo', 'removeVisibleKecamatanInfo']),
    clickKecamatan() {
      if (this.visibleKecamatanInfo) {
        this.updateVisibleKecamatanInfo(this.kecamatanId, false);
      } else {
        this.loadKecamatanInfo();
      }
    },
    resetErrorMsg() {
      this.errorMsg = {};
    },

    // API Methods
    loadKecamatanInfo() {
      kecamatan.info(this.kecamatanId)
        .then(response => this.successGetKecamatanInfo(response.data))
        .catch(response => this.failGetKecamatanInfo(response));
    },
    successGetKecamatanInfo(data) {
      this.kecamatanInfo = {
        provinsi: {
          id: data.provinsiId,
          name:  data.provinsiName
        },
        kabupaten: {
          id: data.kabupatenId,
          name:  data.kabupatenName
        },
        kecamatan: {
          id: data.id,
          name:  data.name
        }
      };
      this.updateVisibleKecamatanInfo(this.kecamatanId, true);
    },
    failGetKecamatanInfo(response) {
      console.log('fail', response);
    },
    updateKecamatan(data) {
      const requestBody = {
        kabupatenId: data.kabupaten.id,
        newKecamatanName: data.kecamatan.name
      };
      kecamatan.update(data.kecamatan.id, requestBody)
        .then(() => this.successUpdateKecamatan(requestBody.kabupatenId))
        .catch(this.failUpdateKecamatan);
    },
    successUpdateKecamatan(newId) {
      const oldId = this.kecamatanInfo.kabupaten.id;
      this.triggerReloadKecamatanList({old: oldId, new: newId});
    },
    failUpdateKecamatan(response) {
      this.errorMsg.update = response.response.data;
    },
    deleteKecamatan() {
      kecamatan.delete(this.kecamatanId)
        .then(this.successDeleteKecamatan)
        .catch(this.failDeleteKecamatan);
    },
    successDeleteKecamatan() {
      const kabupatenId = this.kecamatanInfo.kabupaten.id;
      this.triggerReloadKecamatanList({old: kabupatenId, new: kabupatenId});
      this.removeVisibleKecamatanInfo(this.kecamatanId);
    },
    failDeleteKecamatan(response) {
      console.log('fail', response);
    }
  },
  watch: {
    kecamatanData() {
      if (this.visibleKecamatanInfo) {
        this.loadKecamatanInfo();
      }
    }
  }
}
</script>

<style scoped>
</style>