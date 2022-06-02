<template>
  <div class="container">
    <input type="file" name="" id="" @change="uploadConfig" />
  </div>
</template>
<script>
import VXETable from "vxe-table";
export default {
  data() {
    return {
      fileList: [],
    };
  },
  methods: {
    uploadConfig(e) {
      let file = e.target.files[0];
      if (file) {
        this.$api.uploadFile(null, file, true).then((res) => {
          if (res) {
            this.$message({
              message: "上传基础数据成功",
              type: "success",
            });
            console.log(res);
            res.success && this.$store.commit("setWeb1Data", res.data);
            // this.$store.commit("setErrorList1", res.data.errorsList);
            // this.$store.commit("setList1", res.data.goodsList);
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
  margin-bottom: 2rem;
}
</style>