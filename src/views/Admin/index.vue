<script>
import { supabase } from "../../services/supabase"; // Importez Supabase

export default {
  data() {
    return {
      isLogin: true, // Permet de basculer entre connexion et inscription
      username: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
      this.errorMessage = "";
    },
    async handleLogin() {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.username,
        password: this.password,
      });

      if (error) {
        this.errorMessage = "Nom d'utilisateur ou mot de passe incorrect.";
      } else {
        this.$router.push("/admin/dashboard"); // Redirige vers le tableau de bord
      }
    },
    async handleSignup() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Les mots de passe ne correspondent pas.";
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: this.username,
        password: this.password,
      });

      if (error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage =
          "Compte créé avec succès. Vous pouvez maintenant vous connecter.";
        this.isLogin = true;
      }
    },
  },
};
</script>

<template>
  <div id="admin-auth">
    <!-- Bouton pour revenir à l'Escape Game -->
    <div id="back-to-game">
      <router-link to="/" class="btn btn-secondary"
        >← Retour à l'Escape Game</router-link
      >
    </div>

    <h1 class="title-1">
      {{ isLogin ? "Connexion Admin" : "Créer un compte Admin" }}
    </h1>
    <form @submit.prevent="isLogin ? handleLogin() : handleSignup()">
      <div>
        <label for="username">E-Mail</label>
        <input id="username" type="email" v-model="username" required />
      </div>
      <div>
        <label for="password">Mot de passe</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <div v-if="!isLogin">
        <label for="confirmPassword">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          type="password"
          v-model="confirmPassword"
          required
        />
      </div>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button type="submit" class="btn btn-primary">
        {{ isLogin ? "Se connecter" : "Créer un compte" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
#admin-auth {
  height: 100vh; /* Prend toute la hauteur de la page */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Centre verticalement */
  align-items: center; /* Centre horizontalement */
  text-align: center;
  position: relative; /* Nécessaire pour positionner le bouton */
}

#back-to-game {
  position: absolute;
  top: 20px;
  left: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 400px; /* Limite la largeur du formulaire */
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%; /* Prend toute la largeur disponible */
}

.error {
  color: red;
  font-size: 0.9em;
}

.mt-4 {
  margin-top: 16px;
}
</style>
