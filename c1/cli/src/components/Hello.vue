<template>
  <div>
    <p v-if="isMorning">早上好</p>
    <p v-if="isAfterNoon">中午好</p>
    <p v-if="isEvening">晚上好</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMorning: new Date().getHours() < 12,
      isAfterNoon: new Date().getHours() >= 12 && new Date().getHours() < 18,
      isEvening: new Date().getHours() >= 18
    };
  }
};
</script>

<style></style>
