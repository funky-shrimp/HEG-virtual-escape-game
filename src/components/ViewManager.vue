<script>
export default {
  //Déclaration de la vue passée par GameView dans le template du component
  props: {
    view: Object,
    inventory: Array,
  },

  data() {
    return {
      viewComputedStyle: {}, //Style calculé de l'image de la salle
      viewAreas: [], //Tableau des zones de la salle
    };
  },

  //Déclaration des événements
  emits: ["press"],

  watch: {
    //Charge la vue lorsque l'image est complétement chargée
    view() {
      this.loadAreas();
    },
    //Permet de mettre à jour la vue lorsqu'on ajoute ou enleve un item de l'inventaire
    inventory: {
      handler() {
        this.refreshAreas();
      },
      /**
       * Enables deep watching of the object for changes.
       * This allows Vue to track changes within the object's properties
       * and trigger the watcher when any nested property changes.
       */
      deep: true,
    },
  },

  methods: {
    /**
     * Loads the areas from the current view, sets the computed CSS style
     * of the view image, and calculates the exact positions for each area
     * once the image has fully loaded. This function clones the areas array
     * to prevent modification of the original data, ensuring proper display
     * of each area.
     */
    loadAreas() {
      this.$refs.viewImage.onload = () => {
        /*
        this.setRoomComputedSize();
        //Effacement de l'ancienne zone
        //Clone du tableau d'objet, si on ne le faisait pas, le tableau original serait modifié
        // et les zones ne seraient pas correctement affichées.
        this.viewAreas = this.view.areas.map((area) => ({ ...area }));
        //Affiche chaque zone à l'emplacement exacte après que l'image ait été chargée.
        for (let area in this.viewAreas) {
          this.calcAreaPosition(this.viewAreas[area]);
        }
          */
        this.refreshAreas();
      };
    },

    /**
     * Refreshes the areas of the current view after the inventory has changed.
     * This function first sets the computed CSS style of the view image, and
     * then clones the areas array to prevent modification of the original data.
     * It then filters out the areas that are in the inventory, and recalculates
     * the positions of all the areas to ensure proper display.
     */
    refreshAreas() {
      this.setRoomComputedSize();
      //Clone du tableau d'objet, si on ne le faisait pas, le tableau original serait modifié
      // et les zones ne seraient pas correctement affichées.
      //Affiche que les items qui ne sont pas dans l'inventaire
      
        this.viewAreas = this.view.areas
          .map((area) => ({ ...area }))
          .filter(
            (area) => !this.inventory.some((item) => item.name === area.name)
          );

        for (let area in this.viewAreas) {
          this.calcAreaPosition(this.viewAreas[area]);
        }
      
    },

    /**
     * Get the computed CSS style of the view image, and save it to
     * this.viewComputedStyle
     */
    setRoomComputedSize() {
      const viewImage = this.$refs.viewImage;
      this.viewComputedStyle = window.getComputedStyle(viewImage);
    },

    /**
     * Calculates the absolute pixel position and size of an area
     * given its relative percentage coordinates and sizes.
     * Modifies the original area object.
     * @param {Object} area - The area object to be modified.
     * @returns {Object} The modified area object.
     */
    calcAreaPosition(area) {
      let x = +this.viewComputedStyle.marginLeft.replace("px", "");
      let imgWidth = +this.viewComputedStyle.width.replace("px", "");
      let imgHeight = +this.viewComputedStyle.height.replace("px", "");

      x += (area.x / 100) * imgWidth;
      let y = (imgHeight * area.y) / 100;

      let width = (area.width / 100) * imgWidth;
      let height = (area.height / 100) * imgHeight;

      area.x = x;
      area.y = y;
      area.width = width;
      area.height = height;

      return area;
    },
  },

  mounted() {

  },
};
</script>

<template>
  <div id="view" v-if="view" @click="$emit('press', $event)">
    <img ref="viewImage" :src="view.background" alt="background" />

    <div
      v-for="area in viewAreas"
      :id="area.name"
      class="area-overlay"
      :class="area.class"
      :style="{
        position: 'absolute',
        display: area.class.includes('hidden') ? 'none' : 'block',
        top: area.y + 'px',
        left: area.x + 'px',
        width: area.width + 'px',
        height: area.height + 'px',
        backgroundImage: area.image ? 'url(' + area.image + ')' : 'none',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }"
      @mouseover="highlightArea = true"
      @mouseleave="highlightArea = false"
    ></div>
  </div>
</template>

<style scoped>
#view {
  position: relative;
  width: 100%;
  height: 100%;
}

#view img {
  height: 100%;
  object-fit: contain;
  margin: auto;
}

/* Styles pour les zones simulées */
.area-overlay {
  background-color: transparent; /* Couleur de base transparente */
  border: 1px solid transparent; /* Délimitation invisible au départ */
  transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
  
}

.area-overlay:hover {
  cursor: pointer;
}

.area-overlay.zone:hover {
  background-color: #00ff0d5f; 
  box-shadow: 0 0 5px 10px #00ff0d5f;
}

.area-overlay.item:hover {
  background-color: rgba(0, 0, 255, 0.5); 
  box-shadow: 0 0 5px 10px rgba(0, 0, 255, 0.5);
}

</style>
