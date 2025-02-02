<script>
export default {
  data() {
    return {};
  },

  inject: [],

  emits: ["closeWindow"],

  props: {
    congratText: String,
  },

  methods: {
  },
};
</script>

<template>
  <div class="overlay"></div>
  <div class="contextual-window">
    <div class="contextual-header">
      <p>Bravo</p>
      <button id="close-contextual-cross" @click="$emit('closeWindow')"></button>
    </div>
    <div class="contextual-content" v-if="congratText">
      {{ congratText }}
    </div>
    <div class="contextual-footer">
        <button id="close-contextual-window" @click="$emit('closeWindow')">Ok</button>
    </div>
  </div>
</template>

<style>
.overlay {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.43);
}

.contextual-window {
  position: absolute;
  max-width: 60vw;
  background-color: white;
  border-radius: 5px;
}

.contextual-window div {
  padding: 10px;
}

.contextual-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contextual-content {
  display: flex;
  justify-content: center;
  min-height: 10vh;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

.contextual-content:has(img) {
  align-items: center;
}

.contextual-footer {
  display: flex;
  justify-content: flex-end;
}

.contextual-header p {
  font-weight: bold;
}

.contextual-footer button {
  margin-left: 10px;
  padding: 10px;
  border-radius: 5px;
  color: white;
}

#close-contextual-window {
  background-color: #6c757d;
}

#close-contextual-cross {
  position: relative;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
#close-contextual-cross:hover {
  opacity: 1;
}
#close-contextual-cross:before,
#close-contextual-cross:after {
  position: absolute;
  top:0px;
  content: " ";
  height: 33px;
  width: 2px;
  background-color: #333;
}
#close-contextual-cross:before {
  transform: rotate(45deg);
}
#close-contextual-cross:after {
  transform: rotate(-45deg);
}
</style>
