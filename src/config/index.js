const TARGET = 'http://localhost:8081'

const API = {
  provinsi: {
    create: TARGET + '/provinsi/create',
    getAll: TARGET + '/provinsi/getAll',
    update: TARGET + '/provinsi/{id}/update',
    delete: TARGET + '/provinsi/{id}/delete'
  },
  kabupaten: {
    create: TARGET + '/kabupaten/create',
    getAllWithProvinsiId: TARGET + '/kabupaten/getAllWithProvinsiId',
    info: TARGET + '/kabupaten/{id}/info',
    update: TARGET + '/kabupaten/{id}/update',
    delete: TARGET + '/kabupaten/{id}/delete'
  },
  kecamatan: {
    create: TARGET + '/kecamatan/create',
    getAllWithKabupatenId: TARGET + '/kecamatan/getAllWithKabupatenId',
    info: TARGET + '/kecamatan/{id}/info',
    update: TARGET + '/kecamatan/{id}/update',
    delete: TARGET + '/kecamatan/{id}/delete'
  }
}

const MENU = {
  provinsi: 'provinsi',
  kabupaten: 'kabupaten',
  kecamatan: 'kecamatan'
}

export {
  API,
  MENU
}