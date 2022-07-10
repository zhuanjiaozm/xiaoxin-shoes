<template>
  <div>
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="updatePrice">
        <span slot="label"><i class="el-icon-date"></i>更新价格</span>
        <UpdatePrice></UpdatePrice>
      </el-tab-pane>
      <el-tab-pane name="updateInventory">
        <span slot="label"><i class="el-icon-date"></i>更新库存</span>
        <UpdateInventory></UpdateInventory>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VXETable from "vxe-table";
import UpdateInventory from "@/components/updateData/UpdateInventory";
import UpdatePrice from "@/components/updateData/UpdatePrice";
export default {
  components: { UpdatePrice, UpdateInventory, UpdateInventory },
  data() {
    return {
      tableData: [],
      activeName: "updatePrice",
    };
  },
  mounted() {
    this.login2();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    login2() {
      this.$api.login2({}).then((res) => {
        console.log(`服务端的登录结果是:`, res.data);
        if (res && res.success) {
          localStorage.setItem("token", res.data);
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
  },
  watch: {
    activeName(newValue, oldValue) {
      // newValue === "fashiongo" && this.login2();
      console.log("newValue:", newValue);
    },
  },
};
</script>

<style scoped lang="scss">
i {
  margin-right: 0.5rem;
}
</style>