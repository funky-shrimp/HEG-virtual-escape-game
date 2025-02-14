<script>

export default {
  data() {
    return {};
  },

  emits: ["closeItem", "takeItem", "dropItem"],

  props: {
    item: Object,
    inventory: Array,
  },

  methods: {
    isItemInInventory(item) {
      return this.inventory.some(
        (invItem) => JSON.stringify(invItem) === JSON.stringify(item)
      );
    },
  },
};
</script>

<template>
  <div class="overlay"></div>
  <div class="item-window">
    <div class="item-header">
      <p>{{ item.name }}</p>
      <button id="close-item-cross" @click="$emit('closeItem')"></button>
    </div>
    <div class="item-content" v-if="item.description">
      {{ item.description }}
    </div>
    <div class="item-content" v-if="item.link">
      <a :href="item.link.url" target="_blank">{{ item.link.text }}</a>
    </div>
    <div class="item-content" v-if="item.image_zoom">
      <img
        :src="item.image_zoom"
        alt="zoom sur l'objet"
        :style="{ width: '50%' }"
      />
    </div>
    <div class="item-footer">
      <button id="close-item-window" @click="$emit('closeItem')">Fermer</button>
      <button
        v-if="!isItemInInventory(item) && item.takeable"
        id="take-item"
        @click="$emit('takeItem')"
      >
        Ramasser
      </button>
      <button
        v-if="isItemInInventory(item)"
        id="take-item"
        @click="$emit('dropItem')"
      >
        Déposer
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.43);
}

.item-window {
  position: absolute;
  max-width: 60vw;
  background-color: white;
  border-radius: 5px;
}

.item-window div {
  padding: 10px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.item-content {
  display: flex;
  justify-content: center;
  min-height: 10vh;
}

.item-content:has(img) {
  align-items: center;
}

.item-content a{
  color: #0d6efd;
}

.item-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #dee2e6;
}

.item-header p {
  font-weight: bold;
}

.item-footer button {
  margin-left: 10px;
  padding: 10px;
  border-radius: 5px;
  color: white;
}

#close-item-window {
  background-color: #6c757d;
}

#take-item {
  background-color: #0d6efd;
}

#close-item-cross {
  position: relative;
  width: 32px;
  height: 32px;
  opacity: 0.3;
}
#close-item-cross:hover {
  opacity: 1;
}
#close-item-cross:before,
#close-item-cross:after {
  position: absolute;
  top: 0px;
  content: " ";
  height: 33px;
  width: 2px;
  background-color: #333;
}
#close-item-cross:before {
  transform: rotate(45deg);
}
#close-item-cross:after {
  transform: rotate(-45deg);
}
</style>
