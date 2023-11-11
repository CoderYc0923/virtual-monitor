<template>
  <div class="home">
    <h1 @click="enter">VirtualMonitor - 测试靶场</h1>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const enter = () => {
  router.push("/test-range");
};
</script>

<style lang="scss">
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: #fdf6e3;
}
h1 {
  cursor: pointer;
  color: rgba($color: #f7d7b5, $alpha: 0.7);

  &:hover {
    color: rgba($color: #f7d7b5, $alpha: 1);
    animation: bounce; /* referring directly to the animation's @keyframe declaration */
    animation-duration: 1s; /* don't forget to set a duration! */
  }
}
</style>
