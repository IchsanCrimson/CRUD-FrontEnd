<template>
  <div class="reload" :style="customMarginLeft">
    Click to reload
  </div>
</template>

<script>
export default {
  name: "ReloadTemplate",
  props: {
    customMarginLeft: {
      type: Object
    }
  }
}
</script>

<style scoped>
.reload {
  font-size: 2vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1%;
  background-color: bisque;
  border-style: solid;
  border-color: grey;
  border-width: 0.1vw;
  color: red;
}

.reload:hover {
  color: black;
  cursor: pointer;
}
</style>