<script>
export default {
  data() {
    return {
      currentRoom: {},
      roomComputedStyle: {},
      roomAreas : [],
    };
  },

  methods: {
    /**
     * Load the room data from the json file, and set the roomComputedStyle
     * when the image is loaded
     */
    loadRoom() {
      fetch(`/src/assets/rooms/room1.json`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          this.currentRoom = data;
          this.$refs.roomImage.onload = () => {
            this.setRoomComputedSize();
            for(let area in this.currentRoom.areas) {
              this.roomAreas.push(this.calcAreaPosition(this.currentRoom.areas[area]));
            }
          }
        });
    },

    /**
     * Get the computed CSS style of the room image, and save it to
     * this.roomComputedStyle
     */
    setRoomComputedSize() {
      const roomImage = this.$refs.roomImage;
      this.roomComputedStyle = window.getComputedStyle(roomImage);
    },

    calcAreaPosition(area) {
      let x = +this.roomComputedStyle.marginLeft.replace("px", "");
      let imgWidth = +this.roomComputedStyle.width.replace("px", "");
      let imgHeight = +this.roomComputedStyle.height.replace("px", "");

      x += area.x/100*imgWidth;
      let y = imgHeight*area.y/100;

      let width = area.width/100*imgWidth;
      let height = area.height/100*imgHeight;

      area.x = x;
      area.y = y;
      area.width = width;
      area.height = height;

      return area; 
    }
  },

  mounted() {
    this.loadRoom()
  },
};
</script>

<template>
  <header>
    <h1>Escape Game Finance</h1>
    <button>Retour au menu</button>
  </header>

  <main>
    <div id="room" v-if="currentRoom">
      <img ref="roomImage" :src="currentRoom.background" alt="background" />

      <div v-for="area in roomAreas"
        class="area-overlay"
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
  </main>

  <footer>
    <p>Inventaire</p>
  </footer>
</template>

<style>
html,
body {
  height: 100vh;
  margin: 0;
}

footer,
header {
  display: flex;
  align-items: center;
  background-color: #212529;
  color: white;
}

header {
  justify-content: space-between;
  height: 10vh;
  padding: 10px 20px;
  position: relative;
}

header h1 {
  margin: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

header button {
  position: absolute;
  right: 20px;
  background-color: #6c757d;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

header button:hover {
  background-color: #565e64;
}

footer {
  height: 15vh;
  justify-content: center;
}

main {
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}

#room {
  position: relative;
  width: 100%;
  height: 100%;
}

#room img {
  height: 100%;
  object-fit: contain;
  margin: auto;
}

/* Styles pour les zones simulées */
.area-overlay {
  background-color: transparent; /* Couleur de base transparente */
  border: 1px solid transparent; /* Délimitation invisible au départ */
  transition: background-color 0.3s, border-color 0.3s;
}

.area-overlay:hover {
  background-color: rgba(0, 0, 255, 0.5); /* Couleur bleue translucide */
  cursor: pointer;
}
</style>
