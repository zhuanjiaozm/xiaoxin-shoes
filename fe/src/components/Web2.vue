<template>
  <div class="hello">
    <div v-for="(item, index) in web1Data" :key="index">
      <div
        class="title"
        :class="{ success: 'text-success', error: 'text-error' }[item.type]"
      >
        <span> {{ item.label }}</span>
        <vxe-button
          size="medium"
          content="更新"
          v-if="item.type === 'success'"
          @click="update(item.data)"
        ></vxe-button>
      </div>
      <vxe-table
        :data="item.data"
        stripe
        border
        max-height="700"
        :row-config="{ isCurrent: true, isHover: true }"
      >
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="id" title="Style ID"></vxe-column>
        <vxe-column field="styleNo" title="Style No"></vxe-column>
        <vxe-column field="item" title="Item"></vxe-column>
        <vxe-column title="Color">
          <template #default="{ row }">
            <!-- <span :style="{ background: row.color.toLowerCase() }">{{
              row.color || "无颜色"
            }}</span> -->
            {{ row.color }}
          </template>
        </vxe-column>
        <vxe-column field="run" title="Run"></vxe-column>
        <vxe-column field="inventory" title="Inventory"></vxe-column>
        <vxe-column title="查看库存">
          <template #default="{ row }">
            <i
              v-if="row.id"
              :class="[isLoading ? 'vxe-icon--refresh roll' : 'vxe-icon--menu']"
              @click="getInventory(row)"
            ></i>

            <i
              :class="'vxe-icon--eye'"
              v-if="row.id"
              @click="openPage(row.id)"
            ></i>
          </template>
        </vxe-column>
      </vxe-table>

      <vxe-modal
        v-model="showDetails"
        :title="`详情[${currenItem.productId}]: ${currenItem.productName}, Active:${currenItem.active}, Price:${currenItem.sellingPrice}`"
        width="600"
        height="400"
        :mask="false"
        :lock-view="false"
        resize
      >
        <template #default>
          <vxe-table
            border="inner"
            auto-resize
            show-overflow
            height="auto"
            :row-config="{ isHover: true }"
            :show-header="true"
            :sync-resize="showDetails"
            :data="detailData"
          >
            <vxe-column field="colorId" title="colorId"></vxe-column>
            <vxe-column field="colorListId" title="colorListId"></vxe-column>
            <vxe-column field="colorName" title="colorName"></vxe-column>
            <vxe-column title="status">
              <template #default="{ row }">
                <span
                  v-if="row && row.sizes[0].status === 'Out of Stock'"
                  class="red"
                  >{{ row && row.sizes[0].status }}</span
                >
                <span
                  v-if="row && row.sizes[0].status === 'In Stock'"
                  class="green"
                  >{{ row && row.sizes[0].status }}</span
                >
              </template>
            </vxe-column>
            <vxe-column title="打钩">
              <template #default="{ row }">
                <span v-if="row && row.sizes[0].active === false" class="red">{{
                  row && row.sizes[0].active
                }}</span>
                <span
                  v-if="row && row.sizes[0].active === true"
                  class="green"
                  >{{ row && row.sizes[0].active }}</span
                >
              </template>
            </vxe-column>
          </vxe-table>
        </template>
      </vxe-modal>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "Web2",
  data() {
    return {
      showDetails: false,
      detailData: [],
      isLoading: false,
      currenItem: {},
    };
  },
  props: {
    msg: String,
  },
  methods: {
    openPage(id) {
      window.open(
        `https://vendoradmin.fashiongo.net/#/item/detail/${id}`,
        "_blank"
      ); //注意第二个参数
    },
    getInventory(row) {
      this.isLoading = true;
      this.$api.getInventory(row.id).then((res) => {
        if (res && res.success) {
          this.showDetails = true;
          this.isLoading = false;
          this.detailData = (res.data && res.data.inventory) || [];
          this.currenItem = (res.data && res.data.item) || [];
          console.log("这个规格对应的眼色列表:  ", res);
        } else {
          Message.error("网络请求异常，请稍后重试!");
        }
      });
    },
    update(data) {
      this.$api
        .update2({
          data,
        })
        .then((res) => {
          console.log("更新数据:  ", res);
          if (!res.response.success) {
            Message.error(res.response.message || "失败了");
          } else {
            Message.success("成功了");
          }
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
</style>
