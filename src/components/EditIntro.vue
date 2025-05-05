<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from "vue";
import { supabase } from "@/services/supabase";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const emit = defineEmits(["close"]);
function close() {
  emit("close");
}

const selectedOption = ref("intro");
const introStatus = ref("");
const quill = ref(null);
const quillEditor = ref(null);
const part1 = ref([]);
const part2 = ref([]);
const introId = ref(null);

async function initializeQuill() {
  if (!quillEditor.value) return;
  quillEditor.value.innerHTML = "";
  quill.value = new Quill(quillEditor.value, {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // Options de texte
        [{ header: 1 }, { header: 2 }], // En-têtes
        [{ list: "ordered" }, { list: "bullet" }], // Listes
        [{ script: "sub" }, { script: "super" }], // Exposant / Indice
        ["clean"], // Supprimer la mise en forme
      ],
    },
  });
  await loadIntro();
}

function destroyQuill() {
  if (quill.value) {
    quillEditor.value.innerHTML = "";
    quill.value = null;
  }
}

async function loadIntro() {
  console.log("🔄 loadIntro()");
  const { data, error } = await supabase
    .from("game_intro")
    .select("id, content")
    .single();
  console.log("→ loadIntro response:", { data, error });
  if (error || !data) return;

  introId.value = data.id;
  console.log("→ introId loaded:", introId.value);

  try {
    const parsed = JSON.parse(data.content);
    part1.value = parsed.intro.part1;
    part2.value = parsed.intro.part2;
    const html = [...part1.value, ...part2.value]
      .map((p) => `<p>${p}</p>`)
      .join("");
    quill.value.root.innerHTML = html;
  } catch {
    quill.value.root.innerHTML = data.content;
  }
}

async function saveIntro() {
  // 1) on récupère le HTML modifié
  const html = quill.value.root.innerHTML;

  // 2) on (re)construit les tableaux part1/part2 si besoin
  //    ici on split chaque <p> en paragraphe de texte
  const container = document.createElement("div");
  container.innerHTML = html;
  const paras = Array.from(container.querySelectorAll("p")).map((el) =>
    el.textContent.trim()
  );

  // par exemple : on met la moitié des paragraphes dans part1, le reste dans part2
  const mid = Math.ceil(paras.length / 2);
  part1.value = paras.slice(0, mid);
  part2.value = paras.slice(mid);

  // 3) on reconstruit l’objet exactement comme vous l’avez chargé
  const updatedContent = {
    intro: {
      part1: part1.value,
      part2: part2.value,
      rawHtml: html,
    },
  };

  // 4) on envoie le PATCH et on force le RETURNING du content modifié
  const { data, error, status } = await supabase
    .from("game_intro")
    .update(
      // si votre colonne content est JSONB, envoyez l’objet directement :
      { content: updatedContent }
      // sinon (TEXT/VARCHAR), stringifiez-le :
      // { content: JSON.stringify(updatedContent) }
    )
    .eq("id", introId.value)
    .select("content")
    .single();

  if (error) {
    introStatus.value = `Erreur : ${error.message}`;
    return;
  }

  console.log("✔ Enregistré en base :", status, data.content);

  // 5) on recolle directement dans Quill pour voir le résultat
  try {
    // si content est une string, il faut JSON.parse
    const fresh =
      typeof data.content === "string"
        ? JSON.parse(data.content)
        : data.content;
    quill.value.root.innerHTML = fresh.intro.rawHtml;
  } catch {
    // en fallback, on inscrit brut
    quill.value.root.innerHTML = data.content;
  }

  introStatus.value = "Introduction enregistrée et rechargée !";
}

watch(selectedOption, async (newOpt, oldOpt) => {
  if (oldOpt === "intro") destroyQuill();
  if (newOpt === "intro") {
    await nextTick();
    await initializeQuill();
  }
});

onMounted(async () => {
  await nextTick();
  if (selectedOption.value === "intro") {
    await initializeQuill();
  }
});

onBeforeUnmount(() => destroyQuill());
</script>

<template>
  <div class="modal">
    <button @click="close" class="close-button">×</button>

    <h2 class="text-2xl font-semibold mb-4">Modifier l'introduction</h2>

    <!-- Choix entre introduction et salles -->
    <div class="flex gap-4 mb-4"></div>

    <!-- Section pour modifier l'introduction -->
    <div v-if="selectedOption === 'intro'">
      <div ref="quillEditor" class="border rounded h-64"></div>
      <button
        @click="saveIntro"
        class="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Enregistrer
      </button>
      <p v-if="introStatus" class="mt-1 text-sm text-green-500">
        {{ introStatus }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 75%; /* Augmentez la largeur */
}

button {
  cursor: pointer;
}

button:hover {
  opacity: 0.9;
}

.text-section {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
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
