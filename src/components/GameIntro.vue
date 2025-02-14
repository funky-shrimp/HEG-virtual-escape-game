<script>
export default {
  props: {},

  data() {
    return {};
  },

  //Déclaration des événements
  emits: ["startGame"],

  watch: {},

  methods: {
    switchText() {
      document.querySelector(".first").classList.toggle("hidden");
      document.querySelector(".second").classList.toggle("hidden");
    },
  },

  mounted() {},
};
</script>

<template>
  <div id="game-intro">
    <div class="first">
      <p>
        Printemps 2022, l'entreprise Innokask qui a développé de nouveaux
        casques connectés tient à se présenter au concours international
        Innosport, moteur de l'innovation dans le domaine du sport.
      </p>
      <p>
        À quelques jours du concours… MALHEUR! Innokask est remise en cause par
        le groupe multinational Legranmechan qui proclame avoir lui-même créé le
        casque connecté.
      </p>
      <p>
        Pour prouver sa bonne foi, Innokask doit présenter au jury d'Innosport,
        et à Legranmechan, son premier prototype : le golden kask !
      </p>
      <p>
        Or celui-ci est resté dans les anciens vestiaires de gym du créateur
        principal, un petit suisse (premier diplômé du Master Innokick
        d'ailleurs…).
      </p>
      <p>
        Le temps presse, l'Innokicker doit donc retourner chercher son golden
        kask mais le chemin est semé d'embuches et, comme si cela ne suffisait
        pas, il apprend que les agents envoyés par Legranmechan sont à sa
        poursuite ! Ils ne doivent surtout pas mettre la main sur le précieux
        casque !
      </p>
      <button @click="switchText">Suivant</button>
    </div>
    <div class="second hidden">
      <p>
        Vous allez vous mettre dans la peau du petit suisse, ce brave premier
        Innokicker, et partir à la recherche du golden kask.
      </p>
      <p>
        Dans une oreillette, vos collègues de chez Innokask vont vous guider au
        mieux…
      </p>
      <p>Instructions pratiques</p>
      <p>
        Au cours de votre parcours, lorsque vous passerez votre souris sur
        l'écran, vous verrez :
      </p>
      <ul>
        <li>
          Des <u>zones bleues</u> → elles indiquent des
          <u>objets à ramasser</u>. Vous pourrez placer certains objets dans
          votre inventaire (et oui un Innokicker digne de ce nom ne part jamais
          sans son Innosak)
        </li>
        <li>
          Des <u>zones vertes</u> → elles indiquent des
          <u>objets à observer de plus près</u> ou un passage vers d'autres
          salles
        </li>
      </ul>
      <p>
        Si vous vous sentez bloqué à certains moments, pas de panique! Vos
        collègues dans l'oreillette seront là pour vous aider!
      </p>
      <button @click="$emit('startGame')">Démarrer le jeu</button>
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
    margin-top:20px;
  align-self: center;
  padding: 10px;
  border-radius: 5px;
  color: white;
  background-color: #0d6efd;
}

.hidden {
  display: none !important;
}

ul{
    list-style: circle;
    list-style-position: outside;
    padding: 0 20px 0 20px;
}

p {
  margin: 10px 0;
  align-self: flex-start;
}

</style>
