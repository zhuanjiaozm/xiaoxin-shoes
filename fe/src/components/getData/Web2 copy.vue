<template>
  <div class="hello">

    <div class="operation">
      <vxe-button status="danger" :loading="inventoryDisabled" content="获取所有商品颜色的库存信息" @click="getAllInventory"></vxe-button>
      <vxe-button status="success" :loading="inventoryDisabled" content="获取网站所有商品列表" @click="getBasicActiveDataByPage"></vxe-button>
      <div v-if="inventoryArrayErrorList.length||inventoryArray.length" class="count">
        <div class="info">
          <span class="green"> 成功了{{inventoryIDS.length}}个,</span>
          <span class="red">失败了{{inventoryArrayErrorList.length}}个</span>
          <span class="red" v-if="inventoryArrayErrorList.length"></span>
        </div>
        <vxe-button @click="exportDataEvent">导出成功的数据({{inventoryIDS.length}}条)</vxe-button>
      </div>
    </div>

    <vxe-table border show-header-overflow show-overflow max-height="700" :row-config="{ isHover: true }" :data="inventoryArray" v-if="inventoryArray && inventoryArray.length" :span-method="mergeRowMethod" ref="xTable1">
      <vxe-column type="seq" width="60" />
      <vxe-column field="productId" title="Style ID" />
      <vxe-column field="name" title="Style No" />
      <vxe-column field="sellingPrice" title="Price" />
      <vxe-column field="active" title="Active" />
      <vxe-column field="colorName" title="Color Name"></vxe-column>
      <vxe-column field="availableQty" title="availableQty" />
      <vxe-column field="available" title="available" />
      <vxe-column field="status" title="Status">
        <template #default="{ row }">
          <span v-if="row && row.status === 'Out of Stock'" class="red">
            {{row && row.status}}
          </span>
          <span v-if="row && row.status === 'In Stock'" class="green">
            {{ row && row.status}}
          </span>
        </template>
      </vxe-column>
      <vxe-column title="查看库存">
        <template #default="{ row }">
          <i v-if="row.productId" :class="[isLoading ? 'vxe-icon--refresh roll' : 'vxe-icon--menu']" @click="getInventory(row)" />
          <i :class="'vxe-icon--eye'" v-if="row.productId" @click="openPage(row.productId)" />
        </template>
      </vxe-column>
      <template #empty>
        <span style="color: green;">
          <img src="https://n.sinaimg.cn/sinacn17/w120h120/20180314/89fc-fyscsmv5911424.gif">
          <p>恭喜你 没有发生错误哦 </p>
        </span>
      </template>
    </vxe-table>

    <vxe-table border show-header-overflow show-overflow max-height="700" :row-config="{ isHover: true }" :data="allGoodsList" v-if="allGoodsList && allGoodsList.length" ref="xTable2">
      <vxe-column type="seq" width="60" />
      <vxe-column field="productId" title="Style ID" />
      <vxe-column field="productName" title="Style No" />
      <vxe-column field="sellingPrice" title="Price" />
      <vxe-column field="active" title="Active" />
      <vxe-column title="查看库存">
        <template #default="{ row }">
          <i v-if="row.productId" :class="[isLoading ? 'vxe-icon--refresh roll' : 'vxe-icon--menu']" @click="getInventory(row)" />
          <i :class="'vxe-icon--eye'" v-if="row.productId" @click="openPage(row.productId)" />
        </template>
      </vxe-column>
    </vxe-table>

    <vxe-modal v-model="showDetails" :title="`详情[${currenItem.productId}]: ${currenItem.productName}, Active:${currenItem.active}, Price:${currenItem.sellingPrice}`" width="600" height="400" :mask="false" :lock-view="false" resize>
      <template #default>
        <vxe-table border="inner" auto-resize show-overflow height="auto" :row-config="{ isHover: true }" :show-header="true" :sync-resize="showDetails" :data="detailData">
          <vxe-column field="colorId" title="colorId" />
          <vxe-column field="colorListId" title="colorListId" />
          <vxe-column field="colorName" title="colorName" />
          <vxe-column title="status">
            <template #default="{ row }">
              <span v-if="row && row.sizes[0].status === 'Out of Stock'" class="red">{{
                  row && row.sizes[0].status
                }}</span>
              <span v-if="row && row.sizes[0].status === 'In Stock'" class="green">{{
                  row && row.sizes[0].status
                }}</span>
            </template>
          </vxe-column>
          <vxe-column title="打钩">
            <template #default="{ row }">
              <span v-if="row && row.sizes[0].active === false" class="red">{{
                  row && row.sizes[0].active
                }}</span>
              <span v-if="row && row.sizes[0].active === true" class="green">{{
                  row && row.sizes[0].active
                }}</span>
            </template>
          </vxe-column>
        </vxe-table>
      </template>
    </vxe-modal>

  </div>
</template>

<script>
import { Message } from "element-ui";
import VXETable from "vxe-table";

const env = process.env.NODE_ENV;
export default {
  name: "Web2",
  data() {
    return {
      inventoryArray: [],
      inventoryIDS: [],
      inventoryArrayErrorList: [],
      inventoryDisabled: false,
      showDetails: false,
      detailData: [],
      isLoading: false,
      currenItem: {},
      updateErrorsList: [],
      updateResponseObj: {},
      buttonContent: "",
      timer: {},
      allGoodsList: [],
      baseHref:
        env === "production"
          ? "http://xx.fengziqiao.xyz:3000/download2?fileName="
          : "http://localhost:3000/download2?fileName=",
    };
  },
  props: {
    msg: String,
  },
  methods: {
    exportDataEvent() {
      this.$refs.xTable1.exportData({ type: "csv" });
    },
    // 通用行合并函数（将相同多列数据合并为一行）
    mergeRowMethod({ row, _rowIndex, column, visibleData }) {
      const fields = ["productId", "name", "sellingPrice"];
      // const fields = [];
      const cellValue = row[column.property];
      if (cellValue && fields.includes(column.property)) {
        const prevRow = visibleData[_rowIndex - 1];
        let nextRow = visibleData[_rowIndex + 1];
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        } else {
          let countRowspan = 1;
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = visibleData[++countRowspan + _rowIndex];
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      }
    },
    openPage(id) {
      window.open(
        `https://vendoradmin.fashiongo.net/#/item/detail/${id}`,
        "_blank"
      ); // 注意第二个参数
    },
    getInventory(row) {
      this.isLoading = true;
      this.$api.getInventory(row.productId).then((res) => {
        if (res && res.success) {
          this.showDetails = true;
          this.isLoading = false;
          this.detailData = (res.data && res.data.inventory) || [];
          this.currenItem = (res.data && res.data.item) || [];
        } else {
          Message.error("网络请求异常，请稍后重试!");
        }
      });
    },
    getBasicActiveDataByPage() {
      this.isLoading = true;
      this.inventoryDisabled = true;
      this.$api
        .getBasicActiveDataByPage()
        .then((res) => {
          if (res && res.success) {
            this.isLoading = false;
            this.allGoodsList = res.data && res.data;
            VXETable.modal.message({
              content: `获取全量商品成功`,
              status: "success",
            });
          } else {
            VXETable.modal.message({
              content: `获取全量商品失败`,
              status: "error",
            });
          }
        })
        .finally(() => {
          this.inventoryDisabled = false;
        });
    },
    getAllInventory(row) {
      this.inventoryDisabled = true;
      this.inventoryArray = [];
      this.inventoryIDS = [];
      this.inventoryArrayErrorList = [];
      this.allGoodsList = [];
      this.$api
        .getAllInventory()
        .then((res) => {
          if (res.success) {
            VXETable.modal.message({
              content: `获取库存数据成功了`,
              status: "success",
            });
            if (res.success) {
              this.inventoryArray = res.data.inventoryArray;
              this.inventoryIDS = res.data.inventoryIDS;
              this.inventoryArrayErrorList = res.data.errorList;
            }
          } else {
            VXETable.modal.message({
              content: `获取库存数据失败`,
              status: "error",
            });
          }
        })
        .finally(() => {
          this.inventoryDisabled = false;
        });
    },
    download(filename) {
      this.$api.download(filename).then((res) => {
        Message.success("下载导入结果成功");
      });
    },
    updateHandle(data, timerAll) {
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
        .update2({
          data,
        })
        .then((res) => {
          const time2 = new Date().valueOf();
          this.timer = {
            total: parseInt((time2 - time1) / 1000, 10),
          };
          console.log("更新数据:  ", time2 - this.time1);
          this.buttonContent = "去更新数据" + (time2 - this.time1);
          if (!res.success) {
            Message.error(res.message || "失败了");
          } else {
            VXETable.modal.message({
              content: `更新数据成功了`,
              status: "success",
            });
            this.updateResponseObj = res.data;
          }
        })
        .finally(() => {
          console.log("清理定时器");
          clearInterval(timerAllTimer);
        });
    },
  },
  computed: {
    web1Data() {
      return this.$store.state.web1Data || []; // count 为某个状态
    },
    getErrorList() {
      return this.$store.state.errorList1 || []; // count 为某个状态
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.title {
  line-height: 3rem;
  padding: 0 1rem;
  border: 1px solid #e9eaec;
  border-bottom: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vxe-table {
  margin-bottom: 2rem;
}

.text-success {
  background-color: #008000ab;
}
.text-error {
  background-color: #ff0000a8;
}
.vxe-icon--menu,
.vxe-icon--eye,
.vxe-icon--refresh {
  color: green;
  cursor: pointer;
  font-size: 120%;
  margin-right: 1rem;
}
.green {
  color: green;
}
.red {
  color: red;
}

.result {
  margin-bottom: 1rem;
  b {
    margin: 0 0.5rem;
    font-size: 120%;
  }
}
.operation {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .count {
    display: flex;
    align-items: center;
    .info {
      margin-right: 2rem;
    }
  }
}
</style>
