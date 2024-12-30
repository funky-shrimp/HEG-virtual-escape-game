<script>
export default {

  props: {
    view: Object
  },
  data() {
    return {
      viewComputedStyle: {},
      viewAreas: [],
    };
  },

  watch: {
    view() {
      this.loadAreas();
    }
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
        this.setRoomComputedSize();
        //Effacement de l'ancienne zone
        //Clone du tableau d'objet, si on ne le faisait pas, le tableau original serait modifié
        // et les zones ne seraient pas correctement affichées.
        this.viewAreas = this.view.areas.map(area => ({...area}));
        //Affiche chaque zone à l'emplacement exacte après que l'image ait été chargée.
        for (let area in this.viewAreas) {
            this.calcAreaPosition(this.viewAreas[area]);
        }
      };
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
    this.loadAreas();
  }
};
</script>

<template>
  <div id="view" v-if="view" @click="$emit('press',$event)">
    <img ref="viewImage" :src="view.background" alt="background" />

    <div
      v-for="area in viewAreas"
      :id="area.name"
      class="area-overlay"
      :class="area.class"
      :style="{
        position: 'absolute',
        top: area.y + 'px',
        left: area.x + 'px',
        width: area.width + 'px',
        height: area.height + 'px',
      }"
      @mouseover="highlightArea = true"
      @mouseleave="highlightArea = false"
    ></div>
  </div>
</template>

<style></style>
