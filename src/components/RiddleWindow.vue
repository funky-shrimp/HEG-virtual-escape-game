<script>
export default {
  data() {
    return {
        userAnswer:"",
    };
  },

  props: {
    riddle: Object,
  },

  emits: ["closeRiddle", "answerRiddle"],

  methods: {},
};
</script>

<template>
  <div class="overlay"></div>
  <div class="riddle-window">
    <div class="riddle-header">
      <p>{{ riddle.header }}</p>
      <button id="close-riddle-cross" @click="$emit('closeRiddle')"></button>
    </div>
    <div class="riddle-content">
        <p>{{ riddle.question }}</p>
        <input type="text" v-model="userAnswer" placeholder="Votre réponse" @keypress.enter="$emit('answerRiddle', userAnswer)"/>
    </div>
    <div class="item-footer">
      <button id="close-riddle-window" @click="$emit('closeRiddle')">
        Fermer
      </button>
      <button id="validate-riddle" @click="$emit('answerRiddle', userAnswer)">
        Valider
      </button>
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

.riddle-window {
  position: absolute;
  max-width: 60vw;
  background-color: white;
  border-radius: 5px;
}

.riddle-window div {
  padding: 10px;
}

.riddle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.riddle-content {
  display: flex;
  flex-direction: column;
  gap:10px;
  justify-content: center;
  min-height: 10vh;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
}

.riddle-content input {
    width:100%;
    border: 1px solid #dee2e6;
    text-transform: uppercase;
    padding:5px;
}

.riddle-content:has(img) {
  align-items: center;
}

.riddle-footer {
  display: flex;
  justify-content: flex-end;
}

.riddle-header p {
  font-weight: bold;
}

.riddle-footer button {
  margin-left: 10px;
  padding: 10px;
  border-radius: 5px;
  color: white;
}

#close-riddle-window {
  background-color: #6c757d;
}

#validate-riddle {
  background-color: #0d6efd;
}

#close-riddle-cross {
  position: relative;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
#close-riddle-cross:hover {
  opacity: 1;
}
#close-riddle-cross:before,
#close-riddle-cross:after {
  position: absolute;
  top: 0px;
  content: " ";
  height: 33px;
  width: 2px;
  background-color: #333;
}
#close-riddle-cross:before {
  transform: rotate(45deg);
}
#close-riddle-cross:after {
  transform: rotate(-45deg);
}
</style>
