<script setup>
// Vue依赖
import { reactive, onMounted } from "vue";
// 组件依赖
import { ElMessage } from "element-plus";
import entrie from "/public/entrie.json";
const state = reactive({
  entrieList: [], //原始列表
  selectList: [], //选中列表
  quertList: [], //筛选列表
  // 筛选参数
  queryParams: {
    keywork: "",
    keyworkList: [],
  },
  dialog: {
    title: "修改备注",
    visible: false,
  },
  detailsdialog: {
    title: "详情",
    visible: false,
  },
  formData: {
    index: "",
    note: "",
  },
  details: {},
  show: "all",
  message: "",
});

const debounce = (fun, delay) => {
  let t = "";
  return (args) => {
    let that = this;
    let _args = args;
    clearTimeout(t);
    t = setTimeout(function () {
      fun.call(that, _args);
    }, delay);
  };
};

function select(row) {
  state.selectList.push(row);
  localStorage.setItem("selectList", JSON.stringify(state.selectList));
  if (state.message.close) state.message.close();
  state.message = ElMessage.success("添加成功");
}

function remove(scope) {
  state.selectList.splice(scope.$index, 1);
  localStorage.setItem("selectList", JSON.stringify(state.selectList));
  if (state.message.close) state.message.close();
  state.message = ElMessage.success("移除成功");
}

function note(scope) {
  if (scope.row.note) state.formData.note = scope.row.note;
  state.formData.index = scope.$index;
  state.dialog.visible = true;
}

function details(row) {
  state.details = row;
  state.detailsdialog.visible = true;
}

function submitForm() {
  state.selectList[state.formData.index].note = state.formData.note;
  localStorage.setItem("selectList", JSON.stringify(state.selectList));
  state.formData.note = "";
  state.dialog.visible = false;
}

function searchFun() {
  state.queryParams.keyworkList = []; //清空关键词数组
  state.quertList = []; //清空筛选数组
  state.queryParams.keywork.split(" ").forEach((el) => {
    //空格分割关键词，遍历去除空格
    if (el == "") return;
    state.queryParams.keyworkList.push(el);
  });

  state.entrieList.forEach((entrie) => {
    const flag = state.queryParams.keyworkList.every((keywork) => {
      return entrie.name.includes(keywork);
    });
    if (flag) state.quertList.push(entrie);
  });
}

const search = debounce(() => {
  searchFun();
}, 300);

/**
 * 初始化数据
 */
onMounted(() => {
  state.entrieList = entrie;
  if (localStorage.getItem("selectList")) state.selectList = JSON.parse(localStorage.getItem("selectList"));
});
</script>

<template>
  <div v-loading="state.loading">
    <div class="app-container hidden-lg-and-up">
      <div class="btns">
        <el-button :type="state.show == 'all' ? 'primary' : 'info'" plain @click="state.show = 'all'" class="touch-action">全部词条</el-button>
        <el-button :type="state.show == 'select' ? 'primary' : 'info'" plain @click="state.show = 'select'" class="touch-action"
          >选中词条({{ state.selectList.length }})</el-button
        >
      </div>
      <div v-show="state.show == 'all'">
        <el-input v-model="state.queryParams.keywork" placeholder="关键词搜索(空格隔开)" @input="search" class="input" />
        <el-scrollbar always>
          <el-table v-loading="state.loading" :data="state.quertList.length == 0 ? state.entrieList : state.quertList" height="calc(100vh - 100px)">
            <el-table-column label="词条描述" align="center" prop="name" />
            <el-table-column label="buff" align="center" prop="value" width="60" />
            <el-table-column label="操作" align="center" width="85">
              <template #default="scope">
                <el-button type="primary" plain @click="select(scope.row)" class="touch-action">选中</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <div v-show="state.show == 'select'">
        <el-scrollbar always>
          <el-table v-loading="state.loading" :data="state.selectList" height="calc(100vh - 70px)">
            <el-table-column label="词条描述" align="center" prop="name" />
            <el-table-column label="buff" align="center" prop="value" width="60" />
            <el-table-column label="操作" align="center" width="85">
              <template #default="scope">
                <el-button type="primary" plain @click="remove(scope)" class="touch-action">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>
    <div class="app-container hidden-md-and-down">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-head">全部词条</span>
            </template>
            <div>
              <el-input v-model="state.queryParams.keywork" placeholder="关键词搜索(空格隔开)" @input="search" class="input" clearable/>
              <el-scrollbar always>
                <el-table v-loading="state.loading" :data="state.quertList.length == 0 ? state.entrieList : state.quertList" height="calc(100vh - 150px)">
                  <el-table-column label="词条描述" align="center" prop="name" />
                  <el-table-column label="buff" align="center" prop="value" width="60" />
                  <el-table-column label="操作" align="center" width="85">
                    <template #default="scope">
                      <el-button type="primary" plain @click="select(scope.row)" class="touch-action">选中</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <template #header>
              <span class="card-head">选中词条</span>
            </template>
            <div>
              <el-scrollbar always>
                <el-table v-loading="state.loading" :data="state.selectList" height="calc(100vh - 120px)">
                  <el-table-column label="词条描述" align="center" prop="name" />
                  <el-table-column label="buff" align="center" prop="value" width="60" />
                  <el-table-column label="操作" align="center" width="85">
                    <template #default="scope">
                      <el-button type="primary" plain @click="remove(scope)" class="touch-action">移除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-card__header) {
  text-align: center;
}
.touch-action {
  touch-action: none !important;
}
.btns {
  display: flex;
  justify-content: center;
  margin: 10px;
}
.btns .el-button {
  padding: 18px 25px;
}
.el-row {
  margin: 0 !important;
}
.el-input {
  width: 100%;
}
</style>
