<script>
import { supabase } from "../services/supabase"; // Importez le client Supabase

export default {
  data() {
    return {
      password: "", // Le mot de passe sera chargé depuis la DB
      userInput: "",
      errorMessage: null,
    };
  },

  methods: {
    async fetchPassword() {
      try {
        const { data, error } = await supabase
          .from("game_settings")
          .select("value")
          .eq("key", "escape_password")
          .single();

        if (error) {
          console.error(
            "Erreur lors de la récupération du mot de passe :",
            error.message
          );
          this.errorMessage = "Impossible de récupérer le mot de passe.";
        } else {
          this.password = data.value; // Stocke le mot de passe récupéré
        }
      } catch (err) {
        console.error("Erreur inattendue :", err);
        this.errorMessage = "Une erreur inattendue s'est produite.";
      }
    },

    playGame(e) {
      e.preventDefault();
      if (this.userInput === this.password) {
        this.$router.push("/game");
      } else {
        this.displayError();
      }
    },

    displayError() {
      if (document.getElementById("error").classList.contains("hidden")) {
        document.getElementById("error").classList.toggle("hidden");
      }
    },
  },

  async mounted() {
    await this.fetchPassword(); // Charge le mot de passe depuis la DB
    if (localStorage.getItem("gameProgress")) this.$router.push("/game");
  },
};
</script>

<template>
  <div id="intr">
    <!-- Lien vers la console d'administration en haut à droite -->
    <div id="admin-link">
      <router-link to="/admin" class="btn btn-primary">Admin</router-link>
    </div>

    <h1 class="title-1">Virtual Escape Game</h1>
    <form>
      <div>
        <label for="password">Mot de passe</label>
        <input id="password" type="password" v-model="userInput" />
      </div>
      <div id="error" class="hidden">
        <p>Vous n'avez pas entré le bon mot de passe</p>
      </div>
      <input
        type="submit"
        @click="playGame"
        class="btn btn-secondary"
        value="Jouer"
      />
    </form>
    <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
  </div>
</template>

<style scoped>
#intr {
  height: 100vh;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

#admin-link {
  position: absolute;
  top: 20px;
  right: 20px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  justify-content: center;
}

form div {
  margin: auto;
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

input[type="password"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #0d6efd;
  border-radius: 5px;
}
label {
  align-self: flex-start;
}

input[type="submit"] {
  margin-top: 20px;
  align-self: center;
}

.hidden {
  display: none;
}

#error {
  color: red;
}

.router-link {
  text-decoration: none;
}

.mt-4 {
  margin-top: 16px;
}

.text-red-500 {
  color: red;
}
</style>
