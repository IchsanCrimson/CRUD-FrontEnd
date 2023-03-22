<template>
  <div
      class="emptyContainer"
      :style="customMarginLeft"
  >
    Empty {{label}}
  </div>
</template>

<script>
export default {
  name: "EmptyTemplate",
  props: {
    label: {
      type: String
    },
    customMarginLeft: {
      type: Object
    }
  }
}
</script>

<style scoped>
.emptyContainer {
  font-size: 2vw;
  background-color: bisque;
  border-style: solid;
  border-color: grey;
  border-width: 0.1vw;
  padding: 1%;
}
</style>