<template>
  <div class="menu-options">
    <div
        class="menu-options-value"
        @click="clickProvinsiMenu"
        :style="provinsiMenuStyle"
    >
      Provinsi
    </div>

    <div
        class="menu-options-value"
        @click="clickKabupatenMenu"
        :style="kabupatenMenuStyle"
    >
      Kabupaten
    </div>

    <div
        class="menu-options-value"
        @click="clickKecamatanMenu"
        :style="kecamatanMenuStyle"
    >
      Kecamatan
    </div>
  </div>
</template>

<script>
import { mapActions } from 'pinia';
import { useMenuStore } from "@/store/index";

export default {
  name: "MenuOptions",
  data() {
    return {
      provinsiMenuStyle: {},
      kabupatenMenuStyle: {},
      kecamatanMenuStyle: {},
      activeMenuStyle: {
        'background-color': 'bisque',
        'color': 'black',
        'border-left-style': 'solid',
        'border-top-style': 'solid',
        'border-right-style': 'solid',
        'border-width': '0.1vw'
      }
    }
  },
  created() {
    this.clickProvinsiMenu();
  },
  methods: {
    ...mapActions(useMenuStore, [
        'openProvinsiMenu',
        'openKabupatenMenu',
        'openKecamatanMenu'
    ]),
    clickProvinsiMenu() {
      this.provinsiMenuStyle = this.setActiveMenuStyle();
      this.openProvinsiMenu();
    },
    clickKabupatenMenu() {
      this.kabupatenMenuStyle = this.setActiveMenuStyle();
      this.openKabupatenMenu();
    },
    clickKecamatanMenu() {
      this.kecamatanMenuStyle = this.setActiveMenuStyle();
      this.openKecamatanMenu();
    },
    setActiveMenuStyle() {
      this.provinsiMenuStyle = {};
      this.kabupatenMenuStyle = {};
      this.kecamatanMenuStyle = {};

      return this.activeMenuStyle;
    }
  }
}
</script>

<style scoped>
.menu-options {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: lightgrey;
  background-color: ivory;
}

.menu-options-value {
  border-radius: 2vw 2vw 0 0;
  font-size: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2% 0;
}

.menu-options-value:hover {
  cursor: pointer;
  color: black;
}
</style>