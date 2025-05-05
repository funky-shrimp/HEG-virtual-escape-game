<script>
import { supabase } from "../services/supabase"; // ton client Supabase

export default {
  data() {
    return {
      intro: { part1: [], part2: [] },
      loading: true,
      error: null,
    };
  },

  emits: ["startGame"],

  async created() {
    // 1. On récupère la ligne (id unique ou la première)
    const { data, error } = await supabase
      .from("game_intro")
      .select("content")
      .single();

    if (error) {
      this.error = error.message;
    } else {
      let content = data.content;

      // 2. Si tu as stocké content en TEXT, il faut parser le JSON
      if (typeof content === "string") {
        try {
          content = JSON.parse(content);
        } catch (e) {
          this.error = "Impossible de parser le contenu JSON";
        }
      }

      // 3. On alimente intro avec content.intro
      if (content && content.intro) {
        this.intro = content.intro;
      }
    }

    this.loading = false;
  },

  methods: {
    switchText() {
      document.querySelector(".first").classList.toggle("hidden");
      document.querySelector(".second").classList.toggle("hidden");
    },
  },
};
</script>

<template>
  <div id="game-intro">
    <div v-if="loading">Chargement…</div>
    <div v-else>
      <div v-if="error" class="text-red-400">{{ error }}</div>

      <div v-else>
        <div class="first">
          <p v-for="(text, i) in intro.part1" :key="'part1-' + i">{{ text }}</p>
          <button @click="switchText">Suivant</button>
        </div>

        <div class="second hidden">
          <p
            v-for="(text, i) in intro.part2"
            :key="'part2-' + i"
            v-html="text"
          ></p>
          <button @click="$emit('startGame')">Démarrer le jeu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
#game-intro {
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: justify;
  color: white;
}

#game-intro div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  margin-top: 20px;
  align-self: center;
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: #0d6efd;
}

.hidden {
  display: none !important;
}

ul {
  list-style: circle;
  list-style-position: outside;
  padding: 0 20px 0 20px;
}

p {
  margin: 10px 0;
  align-self: flex-start;
}
</style>
