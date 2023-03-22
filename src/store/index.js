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

export const useProvinsiStore = defineStore('provinsi', {
  state: () => ({
    reloadProvinsiList: 0,
    visibleProvinsiInfoList: {}
  }),
  actions: {
    triggerReloadProvinsiList() {
      this.reloadProvinsiList++;
    },
    removeVisibleProvinsiInfo(key) {
      if (!this.visibleProvinsiInfoList[key]) {
        delete this.visibleProvinsiInfoList[key];
      }
    },
    updateVisibleProvinsiInfo(key, value) {
      this.visibleProvinsiInfoList[key] = value;
    }
  }
});

export const useKabupatenStore = defineStore('kabupaten', {
  state: () => ({
    reloadKabupatenList: 0,
    reloadKabupatenListWithId: {},
    visibleKabupatenInfoList: {}
  }),
  actions: {
    triggerReloadKabupatenList(id) {
      this.reloadKabupatenList++;
      this.reloadKabupatenListWithId = {
        old: id.old,
        new: id.new
      };
    },
    removeVisibleKabupatenInfo(key) {
      if (this.visibleKabupatenInfoList[key]) {
        delete this.visibleKabupatenInfoList[key];
      }
    },
    updateVisibleKabupatenInfo(key, value) {
      this.visibleKabupatenInfoList[key] = value;
    }
  }
});

export const useKecamatanStore = defineStore('kecamatan', {
  state: () => ({
    reloadKecamatanList: 0,
    reloadKecamatanListWithId: {},
    visibleKecamatanInfoList: {}
  }),
  actions: {
    triggerReloadKecamatanList(id) {
      this.reloadKecamatanList++;
      this.reloadKecamatanListWithId = {
        old: id.old,
        new: id.new
      };
    },
    removeVisibleKecamatanInfo(key) {
      if (this.visibleKecamatanInfoList[key]) {
        delete this.visibleKecamatanInfoList[key];
      }
    },
    updateVisibleKecamatanInfo(key, value) {
      this.visibleKecamatanInfoList[key] = value;
    }
  }
});