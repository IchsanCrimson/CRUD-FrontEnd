<template>
  <div class="template-info-detail">
    <div class="justify-end">{{ infoLabel }}:</div>
    <div class="template-info-detail-name">{{ infoData.name }}</div>
  </div>
</template>

<script>
export default {
  name: "InfoTemplate",
  props: {
    infoLabel: {
      type: String
    },
    infoData: {
      type: Object
    }
  }
}
</script>

<style scoped>
.justify-end {
  justify-self: end;
}

.template-info-detail {
  display: grid;
  grid-template-columns: 30% 70%;
  margin: 1vh 0;
}

.template-info-detail-name {
  margin-left: 1vw;
  justify-self: start;
  align-self: center;
  width: 30vw;
  word-break: break-all;
  text-align: start;
}
</style>