<script>
export default {
  data() {
    return {
      password: "HEIGVD2025",  
      userInput: "",
    };
  },

  methods: {
    playGame(e) {
      e.preventDefault();
      if(this.userInput === this.password){
        this.$router.push("/game");
      }else{
        this.displayError();
      }
    },
    displayError() {
      if (document.getElementById("error").classList.contains("hidden")) {
        document.getElementById("error").classList.toggle("hidden");
      }
    },

    isEmailValid(email) {
      return /^[^\s@]+@heig-vd\.ch$/.test(email);
    },
  },
  mounted() {
    if(localStorage.getItem("gameProgress")) this.$router.push("/game");
  },
};
</script>

<template>
  <div id="intr">
    <h1 class="title-1">Virtual Escape Game</h1>
    <form>
      <div>
        <label for="password">Mot de passe</label>
        <input
          id="password"
          type="password"
          v-model="userInput"
        />
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
  </div>
</template>

<style scoped>
#intr {
  height: 100vh;
  width: 50vw;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
</style>
