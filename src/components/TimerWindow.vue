<script>
export default {
  data() {
    return {};
  },

  inject: [],

  emits: [],

  props: {
    time: {
      type: String,
      required: true,
    },
  },

  methods: {},
};
</script>

<template>
  <div id="timer">
    <p>{{ time }}</p>
  </div>
</template>

<style>
#timer {
  background-color: rgb(185, 53, 53);
  padding: 20px;
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 10px;
  overflow: hidden;
  width: 100px; /* Largeur fixe */
  height: 50px; /* Hauteur fixe */
  display: flex;
  align-items: center;
  justify-content: center; /* Centre le texte horizontalement et verticalement */
}

#timer p {
  font-weight: bold;
  margin: 0; /* Supprime les marges par défaut */
  font-size: 1.5em; /* Taille uniforme */
  white-space: nowrap; /* Empêche le texte de se déformer */
}
</style>
