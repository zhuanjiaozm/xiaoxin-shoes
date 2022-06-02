<template>
  <div>
    <!-- <h2>网站上有商品{{ tableData.length }}个</h2>
    <el-table :data="tableData" border style="width: 100%" height="500">
      <el-table-column fixed prop="key" label="ID" width="180">
      </el-table-column>
      <el-table-column prop="name" label="产品名称" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
    </el-table> -->
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="lashowroom">
        <span slot="label"><i class="el-icon-date"></i> 1.lashowroom</span>
        <Web1></Web1>
      </el-tab-pane>
      <el-tab-pane name="fashiongo">
        <span slot="label"><i class="el-icon-date"></i> 2.fashiongo</span>
        <Web2></Web2>
      </el-tab-pane>
      <el-tab-pane name="orangeshine">
        <span slot="label"><i class="el-icon-date"></i> 3.orangeshine</span>
        <Web3></Web3>
      </el-tab-pane>
      <el-tab-pane name="faire">
        <span slot="label"><i class="el-icon-date"></i> 4.faire</span>
        <Web4></Web4>
      </el-tab-pane>
      <el-tab-pane name="fashiondomino">
        <span slot="label"><i class="el-icon-date"></i> 5.fashiondomino</span>
        <Web5></Web5>
      </el-tab-pane>
      <el-tab-pane name="myshopify">
        <span slot="label"><i class="el-icon-date"></i> 6.myshopify</span>
        <Web6></Web6>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { login } from "@/api/api";
import VXETable from "vxe-table";
import Upload from "@/components/common/Upload.vue";
import Web1 from "@/components/getData/Web1";
import Web2 from "@/components/getData/Web2";
import Web3 from "@/components/getData/Web3";
import Web4 from "@/components/getData/Web4";
import Web5 from "@/components/getData/Web5";
import Web6 from "@/components/getData/Web6";
export default {
  components: { Web1, Web2, Web3, Web4, Web5, Web6, Upload },
  data() {
    return {
      tableData: [],
      activeName: "fashiongo",
    };
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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