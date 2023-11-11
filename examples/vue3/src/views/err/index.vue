<template>
  <div class="err">
    <el-tabs v-model="activeName">
      <el-tab-pane label="普通错误事件" name="first">
        <div class="mb">
          <el-alert
            type="warning"
            title="Tips:错误事件的捕获会有延迟"
            :closable="false"
            class="mb"
          >
          </el-alert>

          <el-button id="codeErr" type="danger" plain @click="codeError">
            代码错误
          </el-button>
          <el-button type="danger" plain @click="promiseError">
            Promise-错误
          </el-button>
          <el-button type="danger" plain @click="consoleErr">
            console-错误
          </el-button>
          <el-button type="danger" plain @click="sendBizErr">
            手动上报自定义错误
          </el-button>
          <!-- <el-button type="danger" plain @click="openX">
            开启错误录屏功能
          </el-button>
          <el-button type="danger" plain @click="closeX">
            关闭错误录屏功能
          </el-button> -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源错误事件" name="second">
        <el-alert
          type="warning"
          title="Tips:加载资源如果发生错误会产生两个事件：1.资源请求事件2.请求错误事件"
          :closable="false"
          class="mb"
        >
        </el-alert>
        <div class="mb resource">
          <el-button type="danger" plain @click="showImgTrue = true">
            加载错误图片
          </el-button>
          <img v-if="showImgTrue" src="https://www.baidu.com/as.webp" />
        </div>
        <div class="mb resource">
          <el-button type="danger" plain @click="showAudioTrue = true">
            加载错误音频
          </el-button>
          <audio
            v-if="showAudioTrue"
            src="https://someaudio.wav"
            controls
          ></audio>
        </div>
        <div class="mb resource">
          <el-button type="danger" plain @click="showVideoTrue = true">
            加载错误视频
          </el-button>
          <video
            v-if="showVideoTrue"
            src="https://str39/upload_transcode/202002/18/20200218114723HDu3hhxqIT.mp4"
          ></video>
          <!-- controls="controls" -->
        </div>
      </el-tab-pane>
      <el-tab-pane label="批量错误事件" name="third">
        <el-alert
          type="warning"
          title="Tips:开启了批量错误【scopeError：true】会导致所有错误有2s延迟，针对批量错误还会有20s的延迟, 详情请见控制台"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorA(10)">
            立即触发代码错误-10条
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorAT(10)">
            异步触发代码错误-10条
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorB(10)">
            立即触发【reject-10条 + 代码错误-10条 + console.error-10条】
          </el-button>
        </div>

        <div class="mb">
          <el-button type="danger" plain @click="batchErrorC(10)">
            异步触发【reject-10条 + 代码错误-10条 + console.error-10条】
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-button type="primary" class="mb" @click="getAllTracingList">
      获取最新上报数据
    </el-button>
    <c-table
      :data="tracingInfo.data"
      tableHeight="400"
      :config="tracingInfo.table.config"
    >
      <template v-slot:index="{ scope }">
        {{ `${scope.index + 1}` }}
      </template>
      <template v-slot:sendTime="{ scope }">
        {{ `${formatDate(scope.row.sendTime)}` }}
      </template>
      <template v-slot:triggerTime="{ scope }">
        {{ `${formatDate(scope.row.triggerTime)}` }}
      </template>
      <template v-slot:batchErrorLastHappenTime="{ scope }">
        {{ `${formatDate(scope.row.batchErrorLastHappenTime)}` }}
      </template>
      <template v-slot:actions="{ scope }">
        <!-- <el-button type="primary" @click="lookRecordscreen(scope.row)">
          查看错误录屏
        </el-button> -->
        <!-- <el-button type="primary" @click="lookSourceMap(scope.row)">
          查看错误源文件
        </el-button> -->
      </template>
    </c-table>

    <el-dialog
      v-model="errDialogVisible"
      width="1024px"
      top="10vh"
      :show-close="false"
    >
      <div id="recordscreen" v-if="errDialogVisible"></div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { traceError, options } from "@virtual-monitor/vue3";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";
import { ref, reactive, onMounted, inject, nextTick } from "vue";
// import { findCodeBySourceMap } from '../../utils/sourcemap'

const formatDate = inject("formatDate", Function, true);
const sendMessage = inject("sendMessage", Function, true);
const emitMessage = inject("emitMessage", Function, true);
const selfMessage = inject("selfMessage", Function, true);

onMounted(() => {
  // @ts-ignore
  window.getAllTracingList = getAllTracingList;
  getAllTracingList();
});

const activeName = ref("first");
const showImgTrue = ref(false);
const showImgFalse = ref(false);
const showAudioTrue = ref(false);
const showAudioFalse = ref(false);
const showVideoTrue = ref(false);
const showVideoFalse = ref(false);
const errDialogVisible = ref(false);

const tracingInfo = reactive({
  data: [],
  table: {
    config: [
      { label: "序号", prop: "index", width: "50", isTemplate: true },
      { label: "事件ID", prop: "eventId" },
      { label: "事件类型", prop: "eventType", width: "100" },
      { label: "当前页面URL", prop: "triggerPageUrl", width: "160" },
      {
        label: "事件发送时间",
        prop: "sendTime",
        isTemplate: true,
        width: "140",
      },
      {
        label: "事件发生时间",
        prop: "triggerTime",
        isTemplate: true,
        width: "140",
      },
      { label: "错误信息", prop: "errMessage" },
      { label: "完整错误信息", prop: "errStack", width: "140" },
      { label: "错误行", prop: "line" },
      { label: "错误列", prop: "col" },
      { label: "是否为批量错误", prop: "batchError" },
      {
        label: "批量错误最后发生时间",
        prop: "batchErrorLastHappenTime",
        width: "140",
        isTemplate: true,
      },
      { label: "批量错误-错误个数", prop: "batchErrorLength" },
      { label: "资源请求链接", prop: "requestUrl", width: "100" },
      { label: "参数", prop: "params" },
      {
        label: "操作",
        prop: "actions",
        width: "300",
        isTemplate: true,
      },
    ],
  },
});

function codeError() {
  sendMessage();

  const a = {};

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  a.split("/");
}
function promiseError() {
  sendMessage();

  const promiseWrap = () =>
    new Promise((resolve, reject) => {
      reject("promise reject");
    });
  promiseWrap().then((res) => {
    console.log("res", res);
  });
}
function consoleErr() {
  sendMessage();

  console.error("consoleErr1", "consoleErr1.1", "consoleErr1.2");
}
function sendBizErr() {
  sendMessage();

  traceError({
    eventId: "自定义错误ID",
    errMessage: "自定义错误message",
    src: "/interface/order",
    params: {
      id: "12121",
    },
  });
  emitMessage();
}

// ------- 批量错误 -------
function batchErrorA(num: number) {
  for (let x = 1; x <= num; x++) {
    document.getElementById("codeErr")?.click();
  }
}
function batchErrorAT(num: number) {
  for (let x = 1; x <= num; x++) {
    setTimeout(() => {
      document.getElementById("codeErr")?.click();
    }, x * 300);
  }
}
function batchErrorB(num: number) {
  for (let x = 1; x <= num; x++) {
    document.getElementById("codeErr")?.click();
    consoleErr();
    promiseError();
  }
}
function batchErrorC(num: number) {
  for (let x = 1; x <= num; x++) {
    setTimeout(() => {
      batchErrorB(1);
    }, x * 300);
  }
}
function batchErrorD() {
  setInterval(() => {
    document.getElementById("codeErr")?.click();
  }, 200);
}

// function lookSourceMap(row: any) {
//   // errDialogVisible.value = true
//   console.log('row', row)
//   const { line, col } = row
//   findCodeBySourceMap(
//     {
//       fileName:
//         'http://localhost:6657/node_modules/.vite/deps/chunk-5LLMT6L7.js?v=aadddc15',
//       line,
//       column: col
//     },
//     (res: string) => {
//       console.log('执行完毕', res)
//     }
//   )
// }

// ------- 查看错误 -------
function getAllTracingList() {
  axios
    .get("/getAllTracingList", { params: { eventType: "error" } })
    .then((res) => {
      tracingInfo.data = res.data.data;
      selfMessage("成功查询最新数据 - 错误事件");
    });
}
</script>

<style scoped lang="scss">
.err {
  :deep(.el-dialog__header),
  :deep(.el-dialog__body) {
    padding: 0;
  }
  .el-tab-pane {
    min-height: 300px;
  }
  .resource {
    display: flex;
    width: 800px;
    .el-button {
      height: 32px;
      margin-right: 10px;
    }
    img {
      display: block;
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
    video {
      display: block;
      width: 200px;
      height: 200px;
      margin-right: 20px;
    }
    audio {
      display: block;
      width: 200px;
      height: 200px;
      border: 1px solid red;
      margin-right: 20px;
    }
  }
}
</style>
