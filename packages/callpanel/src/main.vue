<template>
  <transition name="el-callpanel-fade">
    <div
      :class="['el-callpanel', customClass, horizontalClass]"
      v-show="visible"
      :style="positionStyle"
      @click="click"
      role="alert"
    >
      <div class="el-callpanel__header">
        <i class="el-callpanel__icon"
          :class="[ typeClass, iconClass ]"
          v-if="type || iconClass">
        </i>
        <span class="el-callpanel__title" v-text="callText"></span>
        <div class="operation">
          <div class="mic" @click="show.mic = !show.mic">
            <img v-show="show.mic" src="~examples/assets/images/mic.svg" title="禁止麦克风">
            <img v-show="!show.mic" src="~examples/assets/images/nomic.svg" title="开启麦克风">
          </div>
          <div class="sound" @click="show.sound = !show.sound">
            <img v-show="show.sound" src="~examples/assets/images/sound.svg" title="点击静音">
            <img v-show="!show.sound" src="~examples/assets/images/mute.svg" title="取消静音">
          </div>
          <div class="record" @click="makeRecord">
            <img src="~examples/assets/images/record.svg" />
          </div>
          <!-- <el-dropdown @command="handleCommand">
            <span>...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="record">录音</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </div>
      <transition>
        <div class="el-callpanel__tips" v-show="showTips">
          <div class="record" v-show="show.record">
            <span v-if="record.clock > 0">{{recordTimerMin}}:{{recordTimerSec}}</span>
            <span v-else>正在录音...</span>
            <el-button size="mini" @click="finishRecord">完成</el-button>
          </div>
        </div>
      </transition>
      <div class="el-callpanel__content">
        <div class="el-callpanel__content_avatar">
          <a>
            <img class="avatar_pic" src="data:image/png;base64,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"/>
          </a>
        </div>
        <div class="el-callpanel__content_info">
          <p v-text="info.userName"></p>
          <p v-text="info.pnumber"></p>
        </div>
        <div class="el-callpanel__content_timer" v-show="info.timerClock > 0">
          <p>通话时长</p>
          <h3 class="clock">{{timerMin}} : {{timerSec}}</h3>
        </div>
      </div>
      <div class="el-callpanel__footer">
          <el-button type="success" class="accept" icon="el-icon-phone" @click="acceptCall" v-if="call.progress === 0 && call.direction === 'in'">接听</el-button>
          <el-button type="danger" class="hungup" icon="el-icon-phone" @click="hungupCall">挂断</el-button>
      </div>
    <div :style="{ display: 'none' }">
        <audio id="remoteAudio"></audio ><audio id="localAudio" muted="muted"></audio>
        <audio ref="ringTone" loop></audio>
        <audio ref="ringBackTone" loop></audio>
        <audio ref="dtmfTone"></audio>
    </div>
    </div>
  </transition>
</template>

<script type="text/babel">
  import ElButton from '../../button';
  const ringToneWav = require('../../../src/assets/sounds/ringtone.wav');
  const ringBackToneWav = require('../../../src/assets/sounds/ringbacktone.mp3');
  const dtmfToneWav = require('../../../src/assets/sounds/dtmf.wav');

  let typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  export default {
    data() {
      return {
        visible: false,
        duration: 4500,
        type: '',
        showClose: true,
        customClass: '',
        iconClass: '',
        onClose: null,
        onClick: null,
        closed: false,
        verticalOffset: 0,
        timer: null,
        position: 'bottom-right',
        info: {
          userName: '陌生号码',
          pnumber: '',
          timerClock: 0
        },
        call: {
          type: 'audio',
          direction: 'in', // in 拨入， out 拨出
          progress: 0 // 0 等待接听，1 通话中， 2 通话结束
        },
        record: {
          clock: 0,
          timer: null
        },
        onAccept: null,
        onHungup: null,
        onRecord: null,
        onRecordDone: null,
        show: {
          record: false, // 录音组件
          mic: true, // 语音按钮
          sound: true // 声音按钮
        }
      };
    },
    components: {
      ElButton
    },
    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
      },

      horizontalClass() {
        return this.position.indexOf('right') > -1 ? 'right' : 'left';
      },

      verticalProperty() {
        return /^top-/.test(this.position) ? 'top' : 'bottom';
      },

      positionStyle() {
        return {
          [this.verticalProperty]: `${ this.verticalOffset }px`
        };
      },

      timerSec() {
        return this.info.timerClock % 60;
      },
      timerMin() {
        return Math.floor(this.info.timerClock / 60);
      },
      recordTimerSec() {
        return this.record.clock % 60;
      },
      recordTimerMin() {
        return Math.floor(this.record.clock / 60);
      },
      progressText() {
        if (this.call.progress === 0) {
          return '等待接听';
        } else if (this.call.progress === 1) {
          return '通话中';
        } else if (this.call.progress === 2) {
          return '通话结束';
        }
      },
      callText() {
        return (this.call.type === 'audio' ? '语音' : '视频') + (this.call.direction === 'in' ? '来电' : '拨打');
      },
      showTips() {
        return this.show.record || '';
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      },
      'call.progress': function(newVal) {
        this.$refs.ringTone.pause();
        this.$refs.ringBackTone.pause();
        // 当电话接通时
        if (newVal === 1) {
          this.startTimer();
        } else if (newVal === 2) {
          this.close();
        }
      }
    },
    mounted() {
      this.$refs.ringTone.src = ringToneWav;
      this.$refs.ringBackTone.src = ringBackToneWav;
      this.$refs.dtmfTone.src = dtmfToneWav;
      if (this.call.direction === 'in') {
        this.$refs.ringTone.play();
      } else if (this.call.direction === 'out') {
        this.$refs.ringBackTone.play();
      }
    },
    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      click() {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      },

      close() {
        this.closed = true;
        this.$refs.ringTone.pause();
        this.$refs.ringBackTone.pause();
        this.clearTimer();
        if (typeof this.onClose === 'function') {
          this.onClose();
        }
      },

      clearTimer() {
        clearInterval(this.timer);
        this.info.timerClock = 0;
      },

      startTimer() {
        if (this.info.timerClock >= 0) {
          this.timer = setInterval(() => {
            this.info.timerClock++;
          }, 1000);
        }
      },
      acceptCall() {
        this.call.progress = 1;
        if (typeof this.onAccept === 'function') {
          this.onAccept();
        }
      },
      hungupCall() {
        if (typeof this.onHungup === 'function') {
          this.onHungup();
        }
        this.call.progress = 2;
      },
      // handleCommand(command) {
      //   switch (command) {
      //     case 'record':
      //       // TODO
      //       this.show.record = true;
      //       if (typeof this.onRecord === 'function') {
      //         this.onRecord();
      //       }
      //       break;
      //     default:
      //       break;
      //   }
      // },
      makeRecord() {
        // TODO
        // 只有当通话中才能够录音
        // 若正在录音（clock > 0），则不能录音
        if (this.call.progress !== 1 || this.record.clock > 0) {
          return false;
        }
        // 展示录音效果
        this.show.record = true;
        // 开始录音计时
        this.startRecordTimer();
        if (typeof this.onRecord === 'function') {
          this.onRecord();
        }
      },
      startRecordTimer() {
        if (this.record.clock >= 0) {
          this.record.timer = setInterval(() => {
            this.record.clock++;
          }, 1000);
        }
      },
      clearRecordTimer() {
        clearInterval(this.record.timer);
        this.record.clock = 0;
      },
      finishRecord() {
        // 展示录音效果
        this.show.record = false;
        this.clearRecordTimer();
        if (typeof this.onRecordDone === 'function') {
          this.onRecordDone();
        }
      }
    }
  };
</script>

