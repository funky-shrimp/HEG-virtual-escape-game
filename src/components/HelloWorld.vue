<script setup>

</script>

<template>
  <div>
    <h1 class="title-1">Bienvenue dans notre Escape Game</h1>
    <p class="paragraph mb-4">
      Ceci est un paragraphe de texte, rédigé en Montserrat, pour expliquer le
      concept du jeu.
    </p>

    <button class="btn btn-primary mr-2">Bouton principal</button>
    <button class="btn btn-secondary">Bouton secondaire</button>
    <button @click="this.$router.push('/game');" class="btn btn-secondary">Jouer</button>
  </div>
</template>

<style scoped>
/* Si besoin d'ajouter des styles spécifiques au composant */
</style>
