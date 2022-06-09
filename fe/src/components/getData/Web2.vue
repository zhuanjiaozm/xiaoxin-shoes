<template>
  <div class="web">
    <div class="header">
      <el-button-group>
        <el-button type="success" icon="vxe-icon--search" size="small" @click="getProductList()">获取商品列表</el-button>
        <el-button type="primary" icon="vxe-icon--search" size="small" @click="getProductList(true)">获取库存列表</el-button>
        <el-button type="warning" icon="vxe-icon--download" size="small" @click="download">下载商品和库存列表</el-button>
      </el-button-group>
    </div>
    <div>
      <vxe-toolbar>
        <template #buttons>
          <vxe-input v-model="filterName" type="search" placeholder="全表搜索" @keyup="searchEvent"></vxe-input>
          <span class="count" v-if="tableData && tableData.length">(<b>{{tableData && tableData.length}}</b>条数据)</span>
        </template>
      </vxe-toolbar>
      <vxe-table border show-header-overflow show-overflow max-height="700" :row-config="{ isHover: true }" :data="tableData" :loading="isLoading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="productId" title="Style ID" />
        <vxe-column field="productName" title="Style No" />
        <vxe-column field="sellingPrice" title="Selling Price" />
        <vxe-column field="active" title="Active">
          <template #default="{ row }">
            <span :class="[row.active ? 'green' : 'red']">
              {{row.active ? 'Active' : 'Inactive'}}
            </span>
          </template>
        </vxe-column>
        <vxe-column field="colorName" title="Color Name" />
        <vxe-column field="status" title="Status" />
        <vxe-column field="availableQty" title="availableQty" />
        <vxe-column title="fashiongo" width="150">
          <template #default="{ row }">
            <i class="vxe-icon--eye green point" v-if="row.productId" @click="openPage(row.productId)" />
          </template>
        </vxe-column>
        <template #empty>
          <div class="empty-block">
            <i class="vxe-icon--empty"></i>
            <p>没有查询到数据</p>
          </div>
        </template>
      </vxe-table>
    </div>
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
      isLoading: false,
      tableData: [],
      tableDataCopy: [],
      filterName: "",
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
    download() {
      var a = document.createElement("a"); //创建一个<a></a>标签
      a.href =
        "http://" + window.document.location.hostname + ":3000/exportExcel"; // 将流文件写入a标签的href属性值
      a.style.display = "none"; // 障眼法藏起来a标签
      document.body.appendChild(a); // 将a标签追加到文档对象中
      a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove(); // 一次性的，用完就删除a标签
    },
    searchEvent() {
      this.tableData = this.tableDataCopy.filter((item) => {
        if (this.filterName.replace(/(^\s*)|(\s*$)/g, "")) {
          let keyword = this.filterName
            .replace(/(^\s*)|(\s*$)/g, "")
            .toLowerCase();
          if (keyword === "active") {
            keyword = true;
          }
          if (keyword === "inactive") {
            keyword = false;
          }
          return JSON.stringify(item).indexOf(keyword) > -1;
        } else {
          return true;
        }
      });
    },
    getProductList(flag = false) {
      this.isLoading = true;
      this.$api
        .getProductList(flag)
        .then((res) => {
          if (res && res.success) {
            const tableData = [];
            Object.keys(res.data).forEach((productID) => {
              tableData.push(res.data[productID]);
            });

            this.tableData = tableData;
            this.tableDataCopy = tableData;
          } else {
            Message.error("网络请求异常，请稍后重试!");
          }
        })
        .catch((err) => {
          Message.error("网络请求异常，请2222稍后重试!");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    openPage(id) {
      window.open(
        `https://vendoradmin.fashiongo.net/#/item/detail/${id}`,
        "_blank"
      ); // 注意第二个参数
    },
  },
  computed: {},
  mounted() {
    this.getProductList();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.header {
  padding-bottom: 1rem;
}
.count {
  margin-left: 1rem;
  b {
    color: green;
    margin-right: 5px;
  }
}
.green {
  color: green;
}
.red {
  color: red;
}
.point {
  cursor: pointer;
}
</style>
