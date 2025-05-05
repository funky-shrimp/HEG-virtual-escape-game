<template>
  <div class="p-6 space-y-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">Éditeur de Consignes (Page 2)</h1>

    <!-- Section Texte page 2 -->
    <section class="space-y-4 border p-4 rounded">
      <h2 class="font-semibold">Modifier le contenu de la page 2</h2>

      <label class="block">
        Titre :
        <input v-model="page2Title" class="w-full border rounded px-2 py-1" />
      </label>

      <label class="block">
        Prix du casque (CHF) :
        <input
          type="number"
          v-model.number="prixUnitaire"
          class="w-full border rounded px-2 py-1"
        />
      </label>
    </section>

    <!-- Section Tableau page 2 -->
    <section class="space-y-4 border p-4 rounded">
      <h2 class="font-semibold">Modifier le tableau</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border px-2 py-1">Mois</th>
            <th class="border px-2 py-1">Prévision 2022</th>
            <th class="border px-2 py-1">Prévision 2023</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(r, i) in tableData" :key="i">
            <td class="border px-2 py-1">{{ r.mois }}</td>
            <td class="border px-2 py-1">
              <input
                type="number"
                v-model.number="r.prevision2022"
                class="w-full text-right border rounded px-1 py-0.5"
              />
            </td>
            <td class="border px-2 py-1">
              <input
                type="number"
                v-model.number="r.prevision2023"
                class="w-full text-right border rounded px-1 py-0.5"
              />
            </td>
          </tr>
          <tr class="font-semibold bg-gray-100">
            <td class="border px-2 py-1">Total</td>
            <td class="border px-2 py-1 text-right">{{ total2022 }}</td>
            <td class="border px-2 py-1 text-right">{{ total2023 }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Actions -->
    <div class="flex gap-4">
      <button
        @click="generatePDFAndUpdateRooms"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Générer le PDF
      </button>

      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Retour au tableau de bord
      </button>
    </div>
  </div>
</template>

<script setup>
import helmetPng from "@/assets/img/Innokask.png";
import { ref, computed, onMounted, watch } from "vue";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/services/supabase.js";

const totalUnits2022 = computed(() =>
  tableData.value.reduce((sum, r) => sum + r.prevision2022, 0)
);
const totalUnits2023 = computed(() =>
  tableData.value.reduce((sum, r) => sum + r.prevision2023, 0)
);
// Notez bien le .value sur prixUnitaire
const total2022 = computed(() => totalUnits2022.value * prixUnitaire.value);
const total2023 = computed(() => totalUnits2023.value * prixUnitaire.value);
// --- Données initiales page 2 ---
const page2Title = ref(
  "Données prévisionnelles sur les ventes et les conditions de paiement"
);
const prixUnitaire = ref(83); // Prix initial du casque

const page2Body = computed(() => {
  return [
    `Vous avez fait des prévisions et vous travaillez sur les hypothèses suivantes :`,
    `Le prix de vente a été fixé à ${prixUnitaire.value} CHF par casque.`,
    `Il est anticipé qu’en moyenne :`,
    `40% des ventes seront réalisées en vente directe et payées au comptant.`,
    `60% des ventes se feront via des distributeurs avec des conditions de paiement à 10 jours pour une moitié et entre le 31ème et le 60ème jour pour l’autre moitié.`,
    `Les délais sont calculés à compter de l’émission de la facture. Les factures sont établies à la fin de chaque mois, le dernier jour du mois. Par simplification, l’année est composée de 12 mois de 30 jours.`,
  ].join("\n\n");
});
const originalRows = [
  { mois: "Janvier", prevision2022: 0, prevision2023: 625 },
  { mois: "Février", prevision2022: 125, prevision2023: 656 },
  { mois: "Mars", prevision2022: 128, prevision2023: 690 },
  { mois: "Avril", prevision2022: 145, prevision2023: 758 },
  { mois: "Mai", prevision2022: 150, prevision2023: 834 },
  { mois: "Juin", prevision2022: 200, prevision2023: 917 },
  { mois: "Juillet", prevision2022: 140, prevision2023: 1008 },
  { mois: "Août", prevision2022: 140, prevision2023: 1110 },
  { mois: "Septembre", prevision2022: 250, prevision2023: 1220 },
  { mois: "Octobre", prevision2022: 330, prevision2023: 1220 },
  { mois: "Novembre", prevision2022: 450, prevision2023: 1345 },
  { mois: "Décembre", prevision2022: 610, prevision2023: 1345 },
];
const tableData = ref(JSON.parse(JSON.stringify(originalRows)));

// --- Ajout des nouvelles données ---
const rooms = ref([]);
// Chargées depuis Supabase
watch(prixUnitaire, () => updateRoomRiddles());
watch(tableData, () => updateRoomRiddles(), { deep: true });

const encaissements2022 = computed(
  () => Math.round(0.4 * total2022.value) // 40% encaissés en N
);
const solde2022 = computed(
  () => total2022.value - encaissements2022.value // Le reste à encaisser
);

// --- Chargement des données au montage ---
onMounted(async () => {
  try {
    console.log("Chargement des données depuis la base de données...");

    // Charger le contenu de la page 2
    const { data: contentData, error: contentError } = await supabase
      .from("pdf_content")
      .select("title, body, price") // Inclure le champ "price"
      .eq("id", "page2")
      .single();

    if (contentError) {
      console.error("Erreur lors du chargement de pdf_content :", contentError);
    } else {
      console.log("Contenu de la page 2 chargé :", contentData);
      page2Title.value = contentData.title;
      page2Body.value = contentData.body;
      prixUnitaire.value = contentData.price || 83; // Charger le prix ou utiliser 83 par défaut
    }

    // Charger les données du tableau
    const { data: tableDataResult, error: tableError } = await supabase
      .from("pdf_table")
      .select("mois, prevision_2022, prevision_2023")
      .order("month_order", { ascending: true });
    if (tableError) {
      console.error("Erreur lors du chargement de pdf_table :", tableError);
    } else {
      console.log("Données du tableau chargées :", tableDataResult);
      tableData.value = tableDataResult.map((row) => ({
        mois: row.mois,
        prevision2022: row.prevision_2022,
        prevision2023: row.prevision_2023,
      }));
    }

    // Charger les données des rooms
    const { data: roomsData, error: roomsError } = await supabase
      .from("rooms")
      .select("*");

    if (roomsError) {
      console.error("Erreur lors du chargement des rooms :", roomsError);
    } else {
      console.log("Données des rooms chargées :", roomsData);
      rooms.value = roomsData;
    }
  } catch (err) {
    console.error("Erreur inattendue lors du chargement des données :", err);
  }
});

async function saveChanges() {
  try {
    console.log("Enregistrement des modifications dans la base de données...");
    console.log("Titre à mettre à jour :", page2Title.value);
    console.log("Prix à mettre à jour :", prixUnitaire.value);
    console.log("Corps à mettre à jour :", page2Body.value);

    const { error: contentError } = await supabase
      .from("pdf_content")
      .update({
        title: page2Title.value,
        body: page2Body.value,
        price: prixUnitaire.value, // Sauvegarde du prix
      })
      .eq("id", "page2");

    if (contentError) {
      console.error(
        "Erreur lors de la mise à jour de pdf_content :",
        contentError
      );
      return alert(
        "Erreur lors de l'enregistrement des modifications : " +
          contentError.message
      );
    }

    console.log("Modifications enregistrées avec succès !");
  } catch (err) {
    console.error("Erreur inattendue lors de l'enregistrement :", err);
    alert("Une erreur inattendue s'est produite.");
  }
}

async function updateRoomRiddles() {
  // On récupère les totaux calculés
  const CA2022 = total2022.value;
  const encaisses2022 = encaissements2022.value;
  const reste2022 = solde2022.value;

  // room2 – mettre à jour le CA prévisionnel et message de félicitations
  await supabase
    .from("rooms")
    .update({
      riddle: {
        ...rooms.value.find((r) => r.name === "room2").riddle,
        answer: String(CA2022), // Réponse mise à jour
        congratulation: [
          `On prévoit de vendre ${totalUnits2022.value.toLocaleString()} casques sur l'année N à CHF ${
            prixUnitaire.value
          } par pièce.`,
          `Le chiffre d'affaires prévisionnel correspond à ${totalUnits2022.value.toLocaleString()} × ${
            prixUnitaire.value
          } = ${CA2022.toLocaleString()}`,
        ],
      },
    })
    .eq("name", "room2");
}

// --- Génération du PDF et mise à jour des données ---
async function generatePDFAndUpdateRooms() {
  console.log("Début de la génération du PDF...");
  await saveChanges();

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();

  try {
    // 1) Mise à jour des valeurs dans la base de données
    console.log("Mise à jour des valeurs dans la base de données...");
    const { error: contentError } = await supabase
      .from("pdf_content")
      .update({
        title: page2Title.value,
        body: page2Body.value,
      })
      .eq("id", "page2");

    if (contentError) {
      console.error(
        "Erreur lors de la mise à jour de pdf_content :",
        contentError
      );
      return alert(
        "Erreur lors de la mise à jour des données : " + contentError.message
      );
    }

    const updates = tableData.value.map((row) =>
      supabase
        .from("pdf_table")
        .update({
          prevision_2022: row.prevision2022,
          prevision_2023: row.prevision2023,
        })
        .eq("mois", row.mois)
    );

    const results = await Promise.all(updates);
    const tableError = results.find((r) => r.error)?.error;

    if (tableError) {
      console.error("Erreur lors de la mise à jour de pdf_table :", tableError);
      return alert(
        "Erreur lors de la mise à jour des données : " + tableError.message
      );
    }

    console.log("Données mises à jour avec succès dans la base de données.");

    // 2) Génération du PDF
    console.log("Génération du PDF...");
    doc.setFontSize(32);
    doc.text("Escape Game Innokask", W / 2, 60, { align: "center" });

    const res = await fetch(helmetPng);
    const imageBlob = await res.blob();
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(imageBlob);
    });

    const imgWidth = 200;
    const imgHeight = 200 * (imageBlob.height / imageBlob.width || 1);
    doc.addImage(
      base64,
      "PNG",
      (W - imgWidth) / 2,
      (H - imgHeight) / 2 - 20,
      imgWidth,
      imgHeight
    );

    doc.setFontSize(20);
    doc.text("LES DONNÉES POUR VOS CALCULS", W / 2, H - 60, {
      align: "center",
    });
    // --- CONTENU TEXTE SUR PAGE 2 ---
    doc.addPage(); // Ajouter une nouvelle page pour le contenu texte
    doc.setFontSize(20);
    doc.text(page2Title.value, 40, 40); // Ajouter le titre de la page

    doc.setFontSize(12); // Définir une police uniforme pour le contenu
    const textLines = doc.splitTextToSize(page2Body.value, W - 80); // Diviser le texte en lignes adaptées à la largeur de la page
    let cursorY = 80; // Position initiale pour le texte

    textLines.forEach((line) => {
      if (cursorY + 15 > H - 40) {
        // Si le texte dépasse la page
        doc.addPage(); // Ajouter une nouvelle page
        cursorY = 40; // Réinitialiser la position verticale
      }
      doc.text(line, 40, cursorY); // Ajouter la ligne de texte
      cursorY += 15; // Espacement entre les lignes
    });

    // Page 3 : Tableau
    doc.addPage();
    autoTable(doc, {
      startY: 40,
      head: [["Mois", "Prévision 2022", "Prévision 2023"]],
      body: tableData.value.map((r) => [
        r.mois,
        r.prevision2022,
        r.prevision2023,
      ]),
      margin: { left: 40, right: 40 },
      styles: { fontSize: 10 },
    });

    console.log("PDF généré avec succès.");

    // 3) Upload du PDF
    const pdfBlob = doc.output("blob");
    const { error: uploadError } = await supabase.storage
      .from("consignes")
      .upload("innokask_consignes.pdf", pdfBlob, { upsert: true });

    if (uploadError) {
      console.error("Erreur d'upload du PDF :", uploadError);
      return alert("Échec de l’upload du PDF : " + uploadError.message);
    }

    await updateRoomRiddles(); // Met à jour les énigmes des rooms

    console.log("PDF uploadé avec succès.");
    alert("PDF généré et données mises à jour avec succès !");
  } catch (err) {
    console.error("Erreur inattendue :", err);
    alert("Une erreur inattendue s'est produite.");
  }
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
}
input,
textarea {
  font-family: inherit;
}
</style>
