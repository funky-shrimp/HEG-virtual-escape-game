<script>
import ViewManager from "@/components/ViewManager.vue";

export default {
  components: {
    ViewManager,
  },

  data() {
    return {
      currentRoom: {},
      currentView: {},
      inventory: [],
    };
  },

  methods: {
    /**
     * Load the room data from the json file, and set the roomComputedStyle
     * when the image is loaded
     */
    loadRoom(room) {
      if (room === "") room = "room1";
      //Récupération du fichier JSON
      fetch(`/src/assets/rooms/${room}.json`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          //Sauvegarde la Room
          this.currentRoom = data;
          //Charge la vue
          this.currentView = this.currentRoom;
        });
    },

    isInnerRoom(target) {
      const innerRoom = this.currentRoom.areas.find(
        (area) => area.name === target.id
      ).innerRoom;
      return innerRoom;
    },

    manageAreaClick(e) {
      console.log(e.target);
      //Si clic sur une zone
      if (e.target.classList.contains("zone")) {
        //On regarde si c'est une zone pour sortir de la vue (class out)
        if (e.target.classList.contains("out")) {
          this.currentView = this.currentRoom;
        } 
        //Sinon c'est une zone interne à la salle
        else {
          const view = this.isInnerRoom(e.target);
          if (view) {
            this.currentView = view;
          }
        }
      }
      //Si clic sur un item
      else if (e.target.classList.contains("item")) {
      }
    },
  },

  mounted() {
    this.loadRoom("");
  },
};
</script>

<template>
  <header>
    <h1>Escape Game Finance</h1>
    <button>Retour au menu</button>
  </header>

  <main>
    <ViewManager :view="currentView" @press="manageAreaClick" />
    <!--
    <div id="room" v-if="currentRoom" @click="manageAreaClick">
      <img ref="roomImage" :src="currentRoom.background" alt="background" />

      <div
        v-for="area in roomAreas"
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
    -->
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
  transition: background-color 0.3s, border-color 0.3s;
}

.area-overlay:hover {
  cursor: pointer;
}

.area-overlay.zone:hover {
  background-color: #00ff0d7a; /* Couleur vertes pour les zones */
}

.area-overlay.item:hover {
  background-color: rgba(0, 0, 255, 0.5); /* Couleur bleue pour les items */
}
</style>
