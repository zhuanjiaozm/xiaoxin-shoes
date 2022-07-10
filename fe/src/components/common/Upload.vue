<template>
  <div>
    <div class="container">
      <input type="file" name="" id="" @change="uploadConfig" />
    </div>
    <div>
      上传结果: <b v-bind:class="{ active: success }">{{msg}}</b>
      <!-- <div v-if="data && data.length">
        {{data.map(item=>item.NAME)}}
      </div> -->
    </div>
  </div>
</template>
<script>
import VXETable from "vxe-table";
export default {
  data() {
    return {
      msg: "还没开始上传",
      success: false,
      data: [],
    };
  },
  methods: {
    uploadConfig(e) {
      let file = e.target.files[0];
      if (file) {
        this.$api.uploadFile("upload_excel_price", file, true).then((res) => {
          if (res) {
            this.$message({
              message: res.msg || "上传基础数据成功",
              type: res.success ? "success" : "error",
            });
            this.$store.commit("setAllDataToUpdatePrice", res.data);
            this.msg = res.msg;
            this.success = res.success;
            this.data = res.data;
          }
        });
      } else {
        VXETable.modal.message({
          content: `请选择上传的文件`,
          status: "error",
        });
      }
    },
  },
};
</script>

<style scoped>
.container {
  margin: 1rem 0;
}
.active {
  color: green;
}
</style>