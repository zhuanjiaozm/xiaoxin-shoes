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
        <vxe-column field="color" title="Color"></vxe-column>
        <vxe-column field="run" title="Run"></vxe-column>
        <vxe-column field="inventory" title="Inventory"></vxe-column>
      </vxe-table>
    </div>
  </div>
</template>

<script>
// import { update2 } from "@/api/api";
export default {
  name: "Web2",
  props: {
    msg: String,
  },
  methods: {
    update(data) {
      this.$api
        .update2({
          data,
        })
        .then((res) => {
          console.log("更新数据:  ", res);
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
</style>
