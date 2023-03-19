<template>
  <div class="header">
    <img class="image" alt="Vue logo" src="@/assets/logo.png">
    <div class="desktop">Desktop</div>
    <div class="tablet">Tablet</div>
    <div class="mobile">Mobile</div>
  </div>
</template>

<script>
export default {
  name: "HeaderComponent"
}
</script>

<style scoped>
.header {
  font-size: 2vw;
  color: black;
}

.image {
  width: 5vw;
  height: 5vw;
}

/*Mobile*/
@media only screen and (max-width: 480px) {
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .tablet, .desktop {
    display: none;
  }
}

/*Tablet*/
@media only screen and (min-width: 481px) and (max-width:768px) {
  .header {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .desktop, .mobile {
    display: none;
  }
}

/*Desktop*/
@media only screen and (min-width: 769px) {
  .tablet, .mobile {
    display: none;
  }
}
</style>