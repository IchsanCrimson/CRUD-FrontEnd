import { API } from '@/config/index.js'
import axios from "axios";

const replacePathVariableId = (url, id) => url.replace('{id}', id);

const addQueryParam = (url, queryParam) => url + '?' + new URLSearchParams(queryParam).toString();

const provinsi = {
  create: (data) => axios.post(API.provinsi.create, data),
  getAll: () => axios.get(API.provinsi.getAll),
  update: (id, data) => axios.put(replacePathVariableId(API.provinsi.update, id), data),
  delete: (id) => axios.delete(replacePathVariableId(API.provinsi.delete, id))
}

const kabupaten = {
  create: (data) => axios.post(API.kabupaten.create, data),
  getAllWithProvinsiId: (queryParam) => axios.get(addQueryParam(API.kabupaten.getAllWithProvinsiId, queryParam)),
  info: (id) => axios.get(replacePathVariableId(API.kabupaten.info, id)),
  update: (id, data) => axios.put(replacePathVariableId(API.kabupaten.update, id), data),
  delete: (id) => axios.delete(replacePathVariableId(API.kabupaten.delete, id))
}

const kecamatan = {
  create: (data) => axios.post(API.kecamatan.create, data),
  getAllWithKabupatenId: (queryParam) => axios.get(addQueryParam(API.kecamatan.getAllWithKabupatenId, queryParam)),
  info: (id) => axios.get(replacePathVariableId(API.kecamatan.info, id)),
  update: (id, data) => axios.put(replacePathVariableId(API.kecamatan.update, id), data),
  delete: (id) => axios.delete(replacePathVariableId(API.kecamatan.delete, id))
}

export {
  provinsi,
  kabupaten,
  kecamatan
}