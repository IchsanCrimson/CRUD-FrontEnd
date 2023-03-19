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
        :error-msg="errorMsgUpdate"
        @onContainerClick="clickKecamatan"
        @onUpdateClick="updateKecamatan"
        @onDeleteClick="deleteKecamatan"
        @clearErrorMsg="errorMsgUpdate = ''"
    />
  </div>
</template>

<script>
import ContainerTemplate from "@/components/ContainerTemplate";

import { mapGetters } from 'pinia';
import { useMenuStore } from "@/store/index";
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
      visibleKecamatanInfo: false,
      kecamatanInfo: {},
      customGridTemplateColumns: {
        'grid-template-columns': '25% 65% 10%'
      },
      customMarginLeft: {
        'margin-left': '4%'
      },
      errorMsgUpdate: ''
    }
  },
  computed: {
    ...mapGetters(useMenuStore, ['isKecamatanMenu']),
    kecamatanId() {
      return this.kecamatanData.id;
    },
    kecamatanName() {
      return this.kecamatanData.name;
    }
  },
  methods: {
    clickKecamatan() {
      if (this.visibleKecamatanInfo) {
        this.visibleKecamatanInfo = false;
      } else {
        this.loadKecamatanInfo();
      }
    },
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
      this.visibleKecamatanInfo = true;
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
        .then(() => this.successUpdateKecamatan(data))
        .catch(this.failUpdateKecamatan);
    },
    successUpdateKecamatan(data) {
      this.$emit('childUpdated', data);
      this.visibleKecamatanInfo = false;
    },
    failUpdateKecamatan(response) {
      this.errorMsgUpdate = response.response.data;
    },
    deleteKecamatan() {
      kecamatan.delete(this.kecamatanId)
        .then(this.successDeleteKecamatan)
        .catch(this.failDeleteKecamatan);
    },
    successDeleteKecamatan() {
      this.$emit('childDeleted');
      this.visibleKecamatanInfo = false;
    },
    failDeleteKecamatan(response) {
      console.log('fail', response);
    },
    childUpdatedReloadByParent(data) {
      if (this.visibleKecamatanInfo && data.kecamatan) {
        this.visibleKecamatanInfo = false;
      }
    }
  }
}
</script>

<style scoped>
</style>