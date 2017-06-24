<template>
  <div ref="box" class="prdiv-box"
       @mousedown="start"
       @mousemove="pull($event)"
       @mouseup="end"
       @touchstart="start($event)"
       @touchmove="pull($event)"
       @touchend="end"
       >
    <transition name="block">
      <div v-if="processing" ref="block" class="prdiv-block" :style="{
        height: blockHeight + 'px',
        maxHeight: blockHeight + 'px',
        minHeight: blockHeight + 'px'
      }">
        <div ref="iconWrapper" class="icon-wrapper">
          <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
          <svg :style="[
            Object.assign(defaultSvgStyle, svgStyle),
            (this.blockHeight >= this.targetHeight || refreshing) ? svgActiveStyle : null
          ]" width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                  <g transform="translate(1 1)" stroke-width="2">
                      <circle stroke-opacity=".5" cx="18" cy="18" r="18"/>
                      <path d="M36 18c0-9.94-8.06-18-18-18">
                          <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                      </path>
                  </g>
              </g>
          </svg>
          <transition name="message">
            <div class="message" v-if="message && refreshing" v-text="message"
              :style="[Object.assign(defaultMessageStyle, messageStyle)]"
            ></div>
          </transition>
       </div>
      </div>
    </transition>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    ignoreTagPattern: {
      validator(val) {
        return val instanceof RegExp;
      },
      default() {
         return /a|img|button|input|textarea|detail|code|pre/i;
      }
    },
    onRefresh: {
      type: Function,
      required: true
    },
    targetHeight: {
      type: Number,
      default: 100
    },
    extraHeight: {
      type: Number,
      default: 50
    },
    svgStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    svgActiveStyle: {
      type: Object,
      default() {
        return {};
      }
    },
    message: {
      type: String,
      default: ''
    },
    messageStyle: {
      tyle: Object,
      default() {
        return {};
      }
    },
    debug: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      blockHeight: 0,
      startPosition: 0, // for touch event
      refreshing: false,
      processing: false,
      exceeded: false,
      defaultSvgStyle: {
        display: 'block',
        width: '2em',
        height: '2em',
        stroke: '#fff',
        margin: '0 auto'
      },
      defaultMessageStyle: {
        color: '#fff',
        position: 'absolute',
        bottom: '-1.8em',
        right: '50%',
        transform: 'translateX(50%)'
      }
    };
  },
  computed: {
    maxHeight() {
      return this.targetHeight + this.extraHeight;
    }
  },
  methods: {
    getMovingAmount(y) {
      return y - this.startPosition;
    },
    reset() {
      const {box, block} = this.$refs;
      this.processing = false;
      this.refreshing = false;
      this.blockHeight = 0;
      box.style.cssText = '';
      block.style.transition = '';
    },
    start(ev) {
      if (this.ignoreTagPattern.test(ev.target.tagName)) {
        return;
      }
      const {box} = this.$refs;
      box.style.cssText = 'user-select:none';
      this.processing = true;
      if (ev.type === 'touchstart') {
        this.startPosition = Math.floor(ev.touches[0].clientY);
      }
    },
    end() {
      document.body.style.cursor = '';

      if (this.blockHeight >= this.targetHeight) {
        const {block} = this.$refs;
        this.refreshing = true;
        block.style.transition = '.2s cubic-bezier(0.455, 0.03, 0.515, 0.955)';

        requestAnimationFrame(() => {
          this.blockHeight = this.targetHeight;

          try {
            this.onRefresh()
              .then(() => this.reset())
              .catch(err => console.log(err));
          } catch (err) {
            console.log(err);
          }
        });
      } else {
        this.reset();
      }
    },
    pull(ev) {
      if (!this.processing || this.refreshing) {
        return;
      }

      const {iconWrapper} = this.$refs;
      if (ev.movementY || ev.movementY === 0) {
        this.blockHeight += ev.movementY * 0.75;
      } else {
        this.blockHeight += this.getMovingAmount(ev.touches[0].clientY) * 0.05;
      }

      document.body.style.cursor = 's-resize';

      if (this.blockHeight < iconWrapper.clientHeight) {
        iconWrapper.style.opacity = 0;
      } else {
        iconWrapper.style.opacity = this.blockHeight / this.targetHeight;
      }

      if (this.blockHeight < 0) {
        this.blockHeight = 0;
      } else if (this.blockHeight > this.maxHeight) {
        this.blockHeight = this.maxHeight;
      }
    }
  }
};

</script>

<style scoped>
.prdiv-block {
  position: relative;
  width: 100%;
  height: 0;
  overflow: hidden;
}

.block-enter {
  transition: 0s;
}

.block-leave-to {
  height: 0 !important;
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.icon-wrapper {
  position: absolute;
  right: 50%;
  bottom: 50%;
  -webkit-transform: translate(50%, 50%);
  transform: translate(50%, 50%);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.message {
  transition: .4s cubic-bezier(0.455, 0.03, 0.515, 0.955);
}

.message-enter,
.message-leave-to {
  opacity: 0;
  -webkit-filter: blur(5px);
  filter: blur(5px);
}
</style>
