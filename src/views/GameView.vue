<script>
import ViewManager from "@/components/ViewManager.vue";
import ItemWindow from "@/components/ItemWindow.vue";
import RiddleWindow from "@/components/RiddleWindow.vue";

export default {
  components: {
    ViewManager,
    ItemWindow,
    RiddleWindow,
  },

  data() {
    return {
      rooms: ["room1","room2"],
      currentRoom: {},
      currentView: {},
      selectedItem: null,
      riddle: null,
      inventory: [],
    };
  },
  provide() {
    return {
      inventory: this.inventory,
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
          //Sauvegarde la Room
          this.currentRoom = data;
          //Charge la vue en effectuant un clone de la currentRoom
          this.currentView = JSON.parse(JSON.stringify(this.currentRoom));
        });
    },

    /**
     * Return the innerRoom of the area with the name matching the target id
     * @param {HTMLElement} target - the element on which the user clicked
     * @returns {Object} The inner room object
     */
    isInnerRoom(target) {
      //Clone la vue intérieur de la room
      const innerRoom = JSON.parse(
        JSON.stringify(
          this.currentRoom.areas.find((area) => area.name === target.id)
            .innerRoom
        )
      );
      return innerRoom;
    },

    /**
     * Return the item with the name matching the target id
     * @param {HTMLElement} target - the element on which the user clicked
     * @returns {Object} - the item object from the currentView.areas array
     */
    getItem(target) {
      const item = this.currentView.areas.find(
        (area) => area.name === target.id
      );
      return item;
    },

    /**
     * Adds the selected item to the inventory if it's not already there.
     * Removes the item from the current view, and updates the inventory
     * list in the footer.
     */
    takeItem() {
      //est mis dans l'inventaire si pas déjà présent
      if (this.inventory.includes(this.selectedItem) || this.selectedItem.takeable === false) return;
      this.inventory.push(this.selectedItem);

      //est enlevé de la variable globale
      this.selectedItem = null;

      console.log("inventory", this.inventory);
    },

    /**
     * Removes the selected item from the inventory if it's already there.
     * Sets the selectedItem to null.
     */
    dropItem() {
      if (this.inventory.includes(this.selectedItem)) {
        this.inventory.splice(this.inventory.indexOf(this.selectedItem), 1);
        this.selectedItem = null;
      }
    },

    validateRiddle(userAnswer){
      //Enlève les accents et met en minuscule
      userAnswer = this.processString(userAnswer);
      let riddleAnswer = this.processString(this.riddle.answer);

      if(userAnswer === riddleAnswer){
        console.log("Riddle solved");
        let nextRoom = "";

        //On récupère le nom de la prochaine salle
        try{
          nextRoom = this.rooms.indexOf(this.currentRoom.name) + 1;
        }catch(e){ //On est peut-être arrivé à la dernière salle
          console.log(e);
        }

        
        if(nextRoom){
          this.loadRoom(this.rooms[nextRoom]);
        }
          
        this.riddle = null;
      }

    },

    /**
     * Returns a string where all accents have been removed, and all
     * characters are in lower case.
     * @param {String} str - the string to process
     * @returns {String} the processed string
     */
    processString(str) {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    },

    manageAreaClick(e) {
      //Si clic sur une zone
      if (e.target.classList.contains("zone")) {
        //On regarde si c'est une zone pour sortir de la vue (class out)
        if (e.target.classList.contains("out")) {
          this.currentView = JSON.parse(JSON.stringify(this.currentRoom));
        } 
        //Sinon si la zone est une zone demandant une énigme
        else if (e.target.classList.contains("riddle")) {
          console.log(e.target)
          this.riddle = this.currentView.riddle;
          this.riddle.header = e.target.id;
          console.log(this.riddle)
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
        this.selectedItem = this.getItem(e.target);
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
    <ItemWindow
      v-if="selectedItem != null"
      :item="selectedItem"
      @closeItem="selectedItem = null"
      @take-item="takeItem"
      @drop-item="dropItem"
    />
    <RiddleWindow
      v-if="riddle != null"
      :riddle="riddle"
      @closeRiddle="riddle = null"
      @answerRiddle="validateRiddle"
    />
  </main>

  <footer>
    <p>Inventaire</p>
    <div class="inventory" v-if="inventory.length > 0">
      <div
        @click="selectedItem = item"
        class="item"
        v-for="item in inventory"
        :key="item.name"
        :style="{
          backgroundImage: `url(${item.image})`,
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
        }"
      ></div>
    </div>
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

footer p {
  position: absolute;
}

.inventory {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.inventory .item {
  width: 100px;
  height: 100%;
  border: 1px solid white;
}

main {
  height: 75vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}
</style>
