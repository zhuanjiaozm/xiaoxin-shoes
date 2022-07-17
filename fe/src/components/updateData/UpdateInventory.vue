<template>
  <div class="hello">
    <h1>{{ buttonContent }}</h1>
    <el-button style="float: right; padding: 3px 0" type="text" @click="updateHandle()">更新第二个网站的库存</el-button>
  </div>
</template>

<script>
export default {
  name: "UpdateInventory",
  props: {
    msg: String,
  },
  methods: {
    // 通用行合并函数（将相同多列数据合并为一行）
    updateHandle() {
      this.buttonContent = "正在更新数据中";
      var timerAllTimer = setInterval(() => {
        if (timerAll > 0) {
          timerAll--;
          this.buttonContent = `正在更新数据中, 理论上大约还需要${timerAll}秒`;
        } else {
          this.buttonContent = `正在更新数据中, 理论上时间差不多了,再耐心等等吧`;
        }
      }, 1000);
      const time1 = new Date().valueOf();
      this.$api
        .update2()
        .then((res) => {
          console.log("====================================");
          console.log(res);
          console.log("====================================");
        })
        .finally(() => {
          console.log("清理定时器");
          clearInterval(timerAllTimer);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
