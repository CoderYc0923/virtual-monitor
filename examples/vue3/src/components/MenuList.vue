<template>
  <div class="menu-list">
    <el-menu
      :default-active="defaultActive"
      router
      background-color="#ffffff"
      text-color="#eee"
      active-text-color="#000"
    >
      <!-- 遍历菜单 -->
      <template v-for="(item, index) in props.items">
        <!-- 含有子菜单 -->
        <template v-if="item.children">
          <!-- 第一层 含有子菜单菜单 -->
          <el-sub-menu :index="item.path" :key="item.path">
            <template slot="title">
              <span slot="title">{{ item.meta.title }}</span>
            </template>
            <menu-list :items="item.children" />
          </el-sub-menu>
        </template>

        <!-- 第一层 不含子菜单  -->
        <template v-else>
          <el-menu-item
            :index="item.path"
            :key="item.path"
            style="width: 260px"
          >
            <i :class="item.meta.icon"></i>
            <span slot="title">{{ item.meta.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script lang="ts">
export default {
  name: "MenuList",
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

interface Props {
  items: any[];
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
});

const route = useRoute();
const defaultActive = computed(() => route.path);
</script>

<style lang="scss" scoped>
.menu-list {
  height: 100vh;
  background-color: #ffffff;
  border-right: 1px solid #e4e7ed;
}
</style>
