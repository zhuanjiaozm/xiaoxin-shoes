<template>
  <div class="hello">
    <Upload></Upload>
    <ul class="webs">
      <li>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>3.orangeshine</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="updatePrice(3,allDataToUpdatePrice)">开始更新</el-button>
          </div>
          <div class="card-body">
            <el-progress type="circle" :percentage="percentage" :status="progressStatus"></el-progress>
            <ul class="steps">
              <li v-bind:class="{ active: steps.some(item=>item.step===1 && item.list.length) }"> 0.{{this.steps[0]&&this.steps[0].msg||'获取原本网站上的数据'}}</li>

              <li v-bind:class="{ active: steps.some(item=>item.step===2 && item.list.length) }"> 1.{{this.steps[1]&&this.steps[1].msg||'匹配当前需要导入的数据是否存在网站上'}}</li>

              <li> 2.将匹配成功的数据批量修改到网站上</li>
              <li> 4.修改完再再次获取网站上的数据和需要导入的数据对比</li>
            </ul>
          </div>

        </el-card>
      </li>
      <li>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div class="text item">
            {{'列表内容 ' }}
          </div>
        </el-card>
      </li>
      <li>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div class="text item">
            {{'列表内容 ' }}
          </div>
        </el-card>
      </li>
    </ul>
  </div>
</template>

<script>
import Upload from "@/components/common/Upload.vue";
export default {
  components: { Upload },
  name: "UpdatePrice",
  props: {
    msg: String,
  },
  data() {
    return {
      steps: [],
      percentage: 0,
      webSocket: null,
      myInterval: "",
      progressStatus: "warning",
    };
  },
  created() {
    this.initWebSocket();
  },
  destroyed() {
    this.webSocket.close(); //离开路由之后断开websocket连接
  },
  methods: {
    updatePrice(webIndex, allDataToUpdatePrice) {
      this.updateProgress(0, 25);
      this.webSocketSend(
        JSON.stringify({
          webIndex,
          allDataToUpdatePrice,
        })
      );
    },
    updateProgress(start, end) {
      var percentage = start;
      this.myInterval = setInterval(() => {
        if (percentage < end) {
          percentage += 1;
          this.percentage = percentage;
        } else {
          percentage = start;
        }
      }, 2000);

      this.progressStatus = "warning";
    },
    initWebSocket() {
      //初始化webSocket
      const webSocketUrl = "ws://127.0.0.1:3000/ws-UpdatePrice";
      this.webSocket = new WebSocket(webSocketUrl);
      this.webSocket.onmessage = this.webSocketOnMessage;
      this.webSocket.onopen = this.webSocketOnOpen;
      this.webSocket.onerror = this.webSocketOnError;
      this.webSocket.onclose = this.webSocketClose;
    },

    webSocketOnError() {
      //连接建立失败重连
      this.initWebSocket();
    },
    webSocketOnMessage(e) {
      //数据接收
      const res = JSON.parse(e.data);
      clearInterval(this.myInterval);
      this.percentage = res.data.percentage;
      this.steps.push(res.data);
      this.progressStatus = res.success ? "success" : "exception";

      this.$VXETable.modal.message({
        content: res.data.msg,
        status: res.success ? "success" : "error",
      });
    },
    webSocketSend(Data) {
      //数据发送
      this.webSocket.send(Data);
    },
    webSocketClose(e) {
      //关闭
      console.log("断开连接", e);
    },
  },
  computed: {
    allDataToUpdatePrice() {
      return this.$store.state.allDataToUpdatePrice || []; // count 为某个状态
    },
  },
};
</script>

<style scoped lang="scss">
ul.webs {
  display: flex;
  margin: 1rem 0 0;
  padding: 0;
  li {
    list-style: none;
    margin: 0;
    padding-right: 1rem;
    flex: 1;
    .card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
.active {
  color: green;
}
.inactive {
  color: red;
}
</style>
