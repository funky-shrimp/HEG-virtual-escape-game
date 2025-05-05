<script setup>
import { ref, onMounted } from "vue"; // Ajoutez onMounted ici
import { supabase } from "@/services/supabase";
import { useRouter } from "vue-router";
import EditIntro from "@/components/EditIntro.vue";
import EditPassword from "@/components/EditPassword.vue";
import EditContent from "@/components/EditContent.vue";

const user = ref(null);
const showModal = ref(null); // Gère l'affichage des modaux
const router = useRouter();

onMounted(async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    router.push("/admin");
    return;
  }
  user.value = data.session.user;
});

async function logout() {
  await supabase.auth.signOut();
  router.push("/admin");
}

function openModal(type) {
  showModal.value = type;
}

function closeModal() {
  showModal.value = null;
}
</script>
<template>
  <div id="dashboard" class="p-6 max-w-3xl mx-auto" v-if="!showModal">
    <h1 class="text-3xl font-bold mb-4">Tableau de bord Admin</h1>

    <div v-if="user" class="mb-6">
      <p class="mb-2">
        Connecté en tant que <strong>{{ user.email }}</strong>
      </p>
      <button
        @click="logout"
        class="mb-4 px-4 py-2 bg-gray-600 text-white rounded"
      >
        Se déconnecter
      </button>
    </div>

    <div class="mb-6 flex gap-4">
      <button
        @click="openModal('intro')"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Modifier l'introduction
      </button>
      <button
        @click="openModal('content')"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Modifier le contenu
      </button>
      <button
        @click="openModal('password')"
        class="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Modifier le mot de passe
      </button>
    </div>
  </div>

  <!-- Modals -->
  <EditIntro v-if="showModal === 'intro'" @close="closeModal" />
  <EditContent v-if="showModal === 'content'" @close="closeModal" />
  <EditPassword v-if="showModal === 'password'" @close="closeModal" />
</template>

<style scoped>
.quill-editor {
  height: 100%;
}
</style>
