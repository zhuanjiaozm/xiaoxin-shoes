<template>
  <div id="app">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1">网站数据更新</el-menu-item>
      <el-menu-item index="2">网站数据导出</el-menu-item>
      <!-- <el-menu-item index="3">网站数据更新</el-menu-item> -->
      <el-menu-item index="4" disabled>消息中心</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
import VXETable from "vxe-table";

export default {
  data() {
    return {
      activeIndex: "2",
    };
  },
  mounted() {
    if (!sessionStorage.getItem("token")) {
      this.login2();
    }
  },
  methods: {
    login2() {
      this.$api.login2({}).then((res) => {
        console.log(`服务端的登录结果是:`, res.data);
        if (res && res.success) {
          sessionStorage.setItem("token", res.data);
          VXETable.modal.message({
            content: `登录成功`,
            status: "success",
          });
        } else {
          VXETable.modal.message({
            content: `登录失败`,
            status: "error",
          });
        }
      });
    },
    handleSelect(key, keyPath) {
      console.log(key);
      if (key == 1) {
        this.$router.push({
          path: `/home`,
        });
      } else {
        this.$router.push({
          path: `/data`,
        });
      }
    },
  },
};
</script>
<style lang="scss">
</style>
