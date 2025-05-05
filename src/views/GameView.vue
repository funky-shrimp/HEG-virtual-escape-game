<script>
import ViewManager from "@/components/ViewManager.vue";
import ItemWindow from "@/components/ItemWindow.vue";
import RiddleWindow from "@/components/RiddleWindow.vue";
import ContextualWindow from "@/components/ContextualWindow.vue";
import TimerWindow from "@/components/TimerWindow.vue";
import GameIntro from "@/components/GameIntro.vue";
import { supabase } from "@/services/supabase.js";

export default {
  components: {
    ViewManager,
    ItemWindow,
    RiddleWindow,
    ContextualWindow,
    TimerWindow,
    GameIntro,
  },

  data() {
    return {
      rooms: ["room1", "room2", "room3", "room4", "room5", "room6"], // List des salles
      currentRoom: {}, //Salle actuelle
      currentView: {}, //Vue actuelle
      selectedItem: null, //Item selectionné
      riddle: null, //Enigme actuelle
      inventory: [], //Inventaire
      contextualInfos: {
        title: "",
        text: [],
      },
      warning: "",
      timeRemaining: 3600,
      timerInterval: null,
      isGameStarted: false,
    };
  },
  provide() {
    return {
      inventory: this.inventory,
    };
  },

  watch: {
    async currentRoom(newRoom) {
      if (newRoom.name == this.rooms[this.rooms.length - 1]) {
        this.clearTimer();

        const time = this.formattedTime(3600 - this.timeRemaining);
        //On attend 5 secondes avant le message final
        await new Promise((resolve) => setTimeout(resolve, 5000));

        this.contextualInfos.title = "Bravo";
        this.contextualInfos.text = newRoom.finish;
        this.contextualInfos.text.push(`Votre temps : ${time}`);

        // Create and wait for the promise to resolve
        const windowClosed = new Promise((resolve) => {
          //Fermeture de la fenêtre contextuelle
          this.onContextualWindowClose = resolve;
        });

        await windowClosed;
        this.clearProgress();
      }
    },
    async timeRemaining(timeRemaining) {
      if (timeRemaining === 0) {
        this.riddle = null;
        this.selectedItem = null;

        this.contextualInfos.title = "Perdu !";
        this.contextualInfos.text =
          "Vous avez perdu ! Les agents de Legranmechan vous ont attrapés !";

        // Create and wait for the promise to resolve
        const windowClosed = new Promise((resolve) => {
          //Fermeture de la fenêtre contextuelle
          this.onContextualWindowClose = resolve;
        });

        await windowClosed;

        this.clearTimer();
        this.clearProgress();

        //Redirige vers la page d'accueil
        this.$router.push("/");
      }
    },
    isGameStarted(value) {
      if (value) {
        this.startTimer();
      }
    },
  },

  computed: {},

  methods: {
    formattedTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = this.timeRemaining % 60;
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    },
    /**
     * Load the room data from the json file, and set the roomComputedStyle
     * when the image is loaded
     */
    async loadRoom(roomName) {
      this.loadingRoom = true;
      this.errorLoadingRoom = null;

      const name = roomName || this.rooms[0];

      try {
        const { data, error } = await supabase.functions.invoke(
          `getRoom?name=${name}`
        );

        if (error) {
          console.error("Erreur Supabase Function:", error.message);
          this.errorLoadingRoom = error.message;
          return;
        }

        this.currentRoom = data;
        this.currentView = JSON.parse(JSON.stringify(data));
        this.saveProgress();
      } catch (e) {
        console.error("Erreur réseau :", e.message);
        this.errorLoadingRoom = "Erreur réseau. Veuillez réessayer.";
      } finally {
        this.loadingRoom = false;
      }
    },
    /**
     * Permet de sauvegarder la progression de l'utilisateur
     */
    saveProgress() {
      const progress = {
        currentRoom: this.currentRoom, // Objet représentant la salle actuelle
        currentView: this.currentView,
        inventory: this.inventory, // Liste des objets de l'inventaire
      };

      // Convertir en chaîne JSON et sauvegarder dans localStorage
      localStorage.setItem("gameProgress", JSON.stringify(progress));
      //console.log("Progress saved:", progress);
    },

    /**
     * Permet de charger la progession de l'utilisateur
     */
    loadProgress() {
      const savedProgress = localStorage.getItem("gameProgress");
      if (savedProgress) {
        this.isGameStarted = true;
        const progress = JSON.parse(savedProgress);
        const currentTimestamp = Date.now();

        if (progress.lastSavedTimestamp) {
          const elapsedTime = Math.floor(
            (currentTimestamp - progress.lastSavedTimestamp) / 1000
          );
          this.timeRemaining = Math.max(
            0,
            progress.timeRemaining - elapsedTime
          ); // Évite que le temps soit négatif
        } else {
          this.timeRemaining = progress.timeRemaining;
        }

        this.currentRoom = progress.currentRoom || {};
        this.currentView = progress.currentView || {};
        this.inventory = progress.inventory || [];

        //console.log("Progress loaded and time adjusted:", this.timeRemaining);
      } else {
        //console.log("No saved progress found. Loading the first room.");

        //Affiche l'introduction du jeu
        this.$watch("isGameStarted", (newValue) => {
          if (newValue) this.loadRoom("");
        });
      }
    },

    clearProgress() {
      localStorage.removeItem("gameProgress");
    },

    /**
     * Démarre le timer pour l'Escape Game
     */
    startTimer() {
      // Supprimez tout ancien intervalle actif
      this.clearTimer();

      // Créez un nouvel intervalle
      this.timerInterval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
          this.saveTimer();
        } else {
          clearInterval(this.timerInterval); // Arrêtez le timer quand il atteint 0
          this.timerInterval = null;
        }
      }, 1000); // Décrémente toutes les secondes
    },

    /**
     * Supprime l'événement timer
     */
    clearTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    /**
     * Met à jour le timer dans progress dans localStorage
     * permet d'éviter la triche dans le cas où l'utilisateur
     * ferme la fenêtre pour gagner du temps
     */
    saveTimer() {
      const savedProgress =
        JSON.parse(localStorage.getItem("gameProgress")) || {};

      // Vérifie que les données nécessaires existent
      if (
        savedProgress.currentRoom &&
        savedProgress.currentView &&
        Array.isArray(savedProgress.inventory)
      ) {
        const currentTimestamp = Date.now();
        const progress = {
          ...savedProgress,
          timeRemaining: this.timeRemaining,
          lastSavedTimestamp: currentTimestamp,
        };
        localStorage.setItem("gameProgress", JSON.stringify(progress));
        //console.log("Timer progress saved:", progress);
      } /*else {
        console.warn(
          "Timer save skipped: Missing required keys in gameProgress",
          savedProgress
        );
      }*/
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
      if (
        this.inventory.includes(this.selectedItem) ||
        this.selectedItem.takeable === false
      )
        return;
      this.inventory.push(this.selectedItem);

      //Sauvegarde de la progression
      this.saveProgress();
      //est enlevé de la variable globale
      this.selectedItem = null;
    },

    /**
     * Removes the selected item from the inventory if it's already there.
     * Sets the selectedItem to null.
     */
    dropItem() {
      if (this.inventory.includes(this.selectedItem)) {
        this.inventory.splice(this.inventory.indexOf(this.selectedItem), 1);
        this.saveProgress();
        this.selectedItem = null;
      }
    },

    /**
     * Permet d'ajouter ou de supprimer une classe à une zone
     * La zone est recherché à partir de son nom sur la vue actuelle ou sur la salle actuelle
     * @param areaName
     * @param state
     */
    changeAreaState(areaName, state) {
      //On récupère la vue possédant la zone
      // C'est redondant mais currentView pourrait être une zone à l'intérieur de currentRoom
      //  tout comme elle pourrait être currentRoom
      const viewWithAreaToUnlock = this.currentView.areas.some(
        (a) => a.name === areaName
      )
        ? this.currentView
        : this.currentRoom;

      if (viewWithAreaToUnlock) {
        //Si la zone n'a pas l'état qu'on souhaite lui donné, on lui donne
        if (
          !viewWithAreaToUnlock.areas
            .find((a) => a.name === areaName)
            .class.includes(state)
        ) {
          viewWithAreaToUnlock.areas.find((a) => a.name === areaName).class +=
            " " + state;
          this.$refs.viewmanager.refreshAreas();
        }
        //Sinon on lui enlève
        else {
          viewWithAreaToUnlock.areas.find((a) => a.name === areaName).class =
            viewWithAreaToUnlock.areas
              .find((a) => a.name === areaName)
              .class.replace(state, "");
          this.$refs.viewmanager.refreshAreas();
        }

        //Le code ci-dessous permet de mettre à jour currentRoom
        // dans le cas où une zone doit changé d'état (hidden ou non)
        // si on ne fait pas ça, et que par exemple on est dans une InnerRoom,
        // currentRoom ne prendra pas en compte la modification d'état
        // et la zone affectée sera toujours visible

        //Si la viewWithAreaToUnlock est la room, on met à jour
        // l'objet currentRoom afin que les propriétés de la salle changent
        if (this.currentRoom.name === viewWithAreaToUnlock.name) {
          this.currentRoom = viewWithAreaToUnlock;
        } else {
          //Sinon la viewWithAreaToUnlock est une vue différente à
          // currentRoom, par exemple InnerRoom, on met à jour cette InnerRoom
          // à l'intérieur de currentRoom
          this.currentRoom.areas.find(
            (area) =>
              area.hasOwnProperty("innerRoom") &&
              area.innerRoom.name === viewWithAreaToUnlock.name
          ).innerRoom = viewWithAreaToUnlock;
        }

        this.saveProgress();
      }
    },

    /**
     * Vérifie si l'énigme est correcte
     * @param userAnswer
     */
    async validateRiddle(userAnswer) {
      //Enlève les accents, espaces et met en minuscule
      userAnswer = this.processString(userAnswer);
      let riddleAnswer = this.processString(this.riddle.answer);
      let currentRoomAnswer = this.processString(
        this.currentRoom.riddle.answer
      );
      /*
      console.log("userAnswer", userAnswer);
      console.log("riddleAnswer", riddleAnswer);
      console.log("currentRoomAnswer", currentRoomAnswer);
*/

      if (userAnswer === riddleAnswer) {
        //console.log("Riddle solved");
        let nextRoom = "";
        //Si l'énigme est celle de la salle, on passe à la suivante
        if (riddleAnswer === currentRoomAnswer) {
          //On récupère le nom de la prochaine salle
          try {
            nextRoom = this.rooms.indexOf(this.currentRoom.name) + 1;
          } catch (e) {
            //On est peut-être arrivé à la dernière salle
            console.log(e);
          }

          this.contextualInfos.title = "Bravo";
          this.contextualInfos.text = this.riddle.congratulation;
          //S'il y a un message pour rendre attentif le joueur
          // (e.g "Attention, les méchants sont derrières vous")
          this.warning = this.riddle.warning ? this.riddle.warning : "";

          this.riddle = null;

          // Create and wait for the promise to resolve
          const windowClosed = new Promise((resolve) => {
            //Fermeture de la fenêtre contextuelle
            this.onContextualWindowClose = resolve;
          });

          await windowClosed;

          if (nextRoom) {
            this.loadRoom(this.rooms[nextRoom]);
            this.saveProgress();
          }
        } //Sinon on regarde si l'énigme déverrouille une zone
        else if (this.riddle.hasOwnProperty("unlock")) {
          //On récupère le nom de la zone à débloquer
          const areasToBeUnlocked = this.riddle.unlock;

          areasToBeUnlocked.forEach((area) => {
            this.changeAreaState(area, "hidden");
          });

          if (this.riddle.hasOwnProperty("hide")) {
            const areasToBeHidden = this.riddle.hide;
            areasToBeHidden.forEach((area) => {
              this.changeAreaState(area, "hidden");
            });
          }

          this.contextualInfos.title = "Bravo";
          this.contextualInfos.text = this.riddle.congratulation;
          this.riddle = null;

          // Create and wait for the promise to resolve
          const windowClosed = new Promise((resolve) => {
            this.onContextualWindowClose = resolve;
          });

          await windowClosed;

          this.riddle = null;
        }
      } else {
        this.$refs.riddlewindow.nope();
      }
    },

    handleContextualClose() {
      // This function is responsible for handling the closure of a contextual window in the game view.
      // It resets the congratulatory text and checks if there is a pending promise related to the
      // contextual window closure. If such a promise exists, it resolves the promise, indicating that
      // the window has been closed, and then sets the onContextualWindowClose function to null to
      // prevent multiple resolutions or memory leaks.
      this.contextualInfos.title = "";
      this.contextualInfos.text = [];
      if (this.onContextualWindowClose) {
        this.onContextualWindowClose();
        this.onContextualWindowClose = null;
      }
    },

    /**
     * Returns a string where all accents have been removed, and all
     * characters are in lower case.
     * @param {String} str - the string to process
     * @returns {String} the processed string
     */
    processString(str) {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(" ")
        .join("");
    },

    manageAreaClick(e) {
      //Si clic sur une zone
      if (e.target.classList.contains("zone")) {
        //On regarde si c'est une zone pour sortir de la vue (class out)
        if (e.target.classList.contains("out")) {
          //Permet de faire sortir de la salle actuelle
          // This line of code creates a deep copy of the currentRoom object and assigns it to currentView.
          // JSON.stringify converts the currentRoom object into a JSON string, and JSON.parse converts
          // that JSON string back into a new JavaScript object, effectively cloning the original object.
          // This is done to ensure that currentView is a separate instance and not a reference to currentRoom.
          this.currentView = JSON.parse(JSON.stringify(this.currentRoom));
          this.saveProgress();
        }
        //Sinon si la zone est une zone demandant une énigme
        else if (e.target.classList.contains("riddle")) {
          this.riddle = this.currentView.riddle;
          this.riddle.header = e.target.id;
        }
        //Sinon si c'est une zone interne à la salle
        else if (e.target.classList.contains("innerRoom")) {
          const view = this.isInnerRoom(e.target);
          if (view) {
            this.currentView = view;
            this.saveProgress();
          }
        }
      }
      //Si clic sur un item
      else if (e.target.classList.contains("item")) {
        this.selectedItem = this.getItem(e.target);
      }
    },

    backToMenu() {
      if (
        confirm(
          "Voulez-vous vraiment quitter la partie ?\nToute progression sera perdue"
        )
      ) {
        if (confirm("Vous êtes vraiment sûr ?!")) {
          this.clearProgress();
          this.clearTimer();
          this.$router.push("/");
        }
      }
    },
  },

  mounted() {
    this.loadProgress();
  },
};
</script>

<template>
  <header>
    <h1>Escape Game Finance</h1>
    <a
      href="src/assets/misc/innokask_consignes.pdf"
      target="_blank"
      style="color: #0d6efd"
      >Consignes du jeu</a
    >
    <button @click="backToMenu">Quitter la partie</button>
  </header>

  <main>
    <GameIntro v-if="!isGameStarted" @startGame="isGameStarted = true" />

    <ViewManager
      ref="viewmanager"
      :view="currentView"
      :inventory="inventory"
      @press="manageAreaClick"
      :style="{
        display: isGameStarted ? 'block' : 'none',
      }"
    />
    <ContextualWindow
      v-if="contextualInfos.text.length > 0"
      @closeWindow="handleContextualClose"
      :contextualInfos="contextualInfos"
      :warning="warning"
    />
    <ItemWindow
      ref="itemwindow"
      v-if="selectedItem != null"
      :item="selectedItem"
      :inventory="inventory"
      @closeItem="selectedItem = null"
      @take-item="takeItem"
      @drop-item="dropItem"
    />
    <RiddleWindow
      ref="riddlewindow"
      v-if="riddle != null"
      :riddle="riddle"
      @closeRiddle="riddle = null"
      @answerRiddle="validateRiddle"
    />
    <TimerWindow v-if="isGameStarted" :time="formattedTime(timeRemaining)" />
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

<style scoped>
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}
</style>
