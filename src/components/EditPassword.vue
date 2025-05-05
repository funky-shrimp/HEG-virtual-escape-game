<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/services/supabase";

// Ajoutez `defineEmits` pour déclarer l'événement `close`
const emit = defineEmits(["close"]);

const password = ref(""); // Champ texte pour le mot de passe
const passwordStatus = ref(""); // Statut de la sauvegarde

onMounted(async () => {
  await loadPassword(); // Charger le mot de passe actuel au montage
});

async function loadPassword() {
  const { data, error } = await supabase
    .from("game_settings")
    .select("value")
    .eq("key", "escape_password")
    .single();
  if (!error && data) password.value = data.value; // Charger la valeur actuelle
}

async function savePassword() {
  const { error } = await supabase.from("game_settings").upsert(
    { key: "escape_password", value: password.value }, // Mettre à jour ou insérer
    { onConflict: ["key"] } // Éviter les doublons
  );
  passwordStatus.value = error
    ? "Erreur lors de la sauvegarde."
    : "Mot de passe enregistré !";
}

function close() {
  emit("close"); // Émet l'événement `close` pour informer le parent
}
</script>

<template>
  <div class="modal">
    <!-- Icône de fermeture -->
    <button @click="close" class="close-button">×</button>

    <h2 class="text-2xl font-semibold mb-2">Modifier le mot de passe</h2>
    <div class="flex items-center">
      <input
        v-model="password"
        type="text"
        placeholder="Nouveau mot de passe"
        class="border p-2 rounded flex-grow"
      />
      <button
        @click="savePassword"
        class="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Enregistrer
      </button>
    </div>
    <p v-if="passwordStatus" class="mt-1 text-sm text-green-500">
      {{ passwordStatus }}
    </p>
  </div>
</template>
<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(
    -50%,
    -50%
  ); /* Centre le modal horizontalement et verticalement */
  background: white;
  padding: 20px;
  border-radius: 8px; /* Coins arrondis pour l'effet de carte */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Ombre pour l'effet de carte */
  z-index: 1000;
  width: 400px; /* Largeur fixe pour un design cohérent */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}

.close-button:hover {
  color: #000;
}
</style>
