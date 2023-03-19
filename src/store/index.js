import { defineStore } from 'pinia'
import { MENU } from "@/config/index.js";

export const useMenuStore = defineStore('menu', {
  state: () => ({
    currentMenu: MENU.provinsi
  }),
  getters: {
    isProvinsiMenu(state) {
      return state.currentMenu == MENU.provinsi;
    },
    isKabupatenMenu(state) {
      return state.currentMenu == MENU.kabupaten;
    },
    isKecamatanMenu(state) {
      return state.currentMenu == MENU.kecamatan;
    }
  },
  actions: {
    openProvinsiMenu() {
      this.currentMenu = MENU.provinsi;
    },
    openKabupatenMenu() {
      this.currentMenu = MENU.kabupaten;
    },
    openKecamatanMenu() {
      this.currentMenu = MENU.kecamatan;
    }
  }
});