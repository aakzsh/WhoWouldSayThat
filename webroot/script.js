class App {
  constructor() {
    const revealButton = document.getElementById("reveal");
    const giveupButton = document.getElementById("giveup");
    const submitButton = document.getElementById("submitanswer");
    const addHintButton = document.getElementById("addhint");
    const container = document.querySelector(".emojihintss");
    const addtriviaButton = document.getElementById("addtriviabtn");
    const triviaInput = document.getElementById("triviaInput")
    const newtrivia_input = document.getElementById("newtrivia_input")
    
    
    const emojiHints = [];
const maxHints = 5;

    const emojiArray = ["🔥", "🤖", "🌍", "💣", "😨"]; // Emoji hints array
    let currentIndex = 0;
    const emojiElements = document.querySelectorAll(".emoji");

    if (submitButton) {
      submitButton.addEventListener("click", () => {
        console.log("isCorrect")
          showPopup(true);
      });
  }


  if(addtriviaButton){
    addtriviaButton.addEventListener("click", () => {
      if (emojiHints.length === 0) {
          showPopup_NewTrivia("At least 1 emoji hint is required!");
          return;
      }
  
      if (!triviaInput.value.trim()) {
          showPopup_NewTrivia("Trivia answer cannot be empty!");
          return;
      }
  
      if (!newtrivia_input.value.trim()) {
        showPopup_NewTrivia("Trivia statement cannot be empty!");
        return;
    }
  
  
      else{
        console.log("doing a new post")
        // showPopup("none");
        window.parent?.postMessage(
          {
            type: "newPost",
            data: { },
          },
          '*'
        );
        return;
      }
  
      console.log("Success");
  });
  
  }

// Full Emoji List (Add more if needed)
const emojiData = [
  { symbol: "🔥", name: "fire", keywords: ["hot", "burn", "flame"] },
  { symbol: "😂", name: "face with tears of joy", keywords: ["laugh", "funny", "joy"] },
  { symbol: "❤️", name: "red heart", keywords: ["love", "heart", "affection"] },
  { symbol: "🎯", name: "direct hit", keywords: ["target", "bullseye", "goal", "dart"] },
  { symbol: "💯", name: "hundred points", keywords: ["100", "perfect", "score"] },
  { symbol: "😍", name: "smiling face with heart-eyes", keywords: ["love", "heart", "crush"] },
  { symbol: "🙌", name: "raising hands", keywords: ["celebrate", "praise", "hooray"] },
  { symbol: "😊", name: "smiling face with smiling eyes", keywords: ["happy", "joy", "smile"] },
  { symbol: "👍", name: "thumbs up", keywords: ["approval", "like", "good"] },
  { symbol: "💀", name: "skull", keywords: ["dead", "funny", "LOL"] },
  { symbol: "🤔", name: "thinking face", keywords: ["hmm", "thoughtful", "question"] },
  { symbol: "🙏", name: "folded hands", keywords: ["please", "thank you", "pray"] },
  { symbol: "🎉", name: "party popper", keywords: ["celebration", "party", "fun"] },
  { symbol: "😎", name: "smiling face with sunglasses", keywords: ["cool", "chill", "confident"] },
  { symbol: "😢", name: "crying face", keywords: ["sad", "tears", "upset"] },
  { symbol: "🤯", name: "exploding head", keywords: ["mind blown", "shock", "wow"] },
  { symbol: "🥺", name: "pleading face", keywords: ["please", "cute", "sad"] },
  { symbol: "🎶", name: "musical notes", keywords: ["music", "song", "melody"] },
  { symbol: "🤩", name: "star-struck", keywords: ["excited", "amazed", "impressed"] },
  { symbol: "🚀", name: "rocket", keywords: ["space", "launch", "fast"] },
  { symbol: "🐶", name: "dog face", keywords: ["animal", "pet", "puppy"] },
  { symbol: "🌍", name: "globe with meridians", keywords: ["world", "earth", "global"] },
  { symbol: "📚", name: "books", keywords: ["library", "reading", "study"] },
  { symbol: "🏆", name: "trophy", keywords: ["award", "win", "champion"] },
  { symbol: "💪", name: "flexed biceps", keywords: ["strong", "fitness", "workout"] },
  { symbol: "👀", name: "eyes", keywords: ["look", "watch", "see"] },
  { symbol: "🍕", name: "pizza", keywords: ["food", "cheese", "yum"] },
  { symbol: "⚡", name: "high voltage", keywords: ["electric", "energy", "lightning"] },
  { symbol: "🌟", name: "glowing star", keywords: ["bright", "special", "shine"] },
  { symbol: "🎵", name: "musical note", keywords: ["music", "song", "melody"] },
  { symbol: "👑", name: "crown", keywords: ["royalty", "king", "queen"] },
  { symbol: "💔", name: "broken heart", keywords: ["sad", "love", "hurt"] },
  { symbol: "💡", name: "light bulb", keywords: ["idea", "innovation", "inspiration"] },
  { symbol: "🎤", name: "microphone", keywords: ["sing", "karaoke", "music"] },
  { symbol: "🏀", name: "basketball", keywords: ["sports", "game", "hoops"] },
  { symbol: "🚗", name: "car", keywords: ["vehicle", "drive", "road"] },
  { symbol: "✈️", name: "airplane", keywords: ["travel", "flight", "trip"] },
  { symbol: "🧠", name: "brain", keywords: ["smart", "intelligence", "mind"] },
  { symbol: "🕹️", name: "joystick", keywords: ["game", "play", "controller"] },
  { symbol: "📅", name: "calendar", keywords: ["date", "schedule", "event"] },
  { symbol: "🎭", name: "performing arts", keywords: ["drama", "theater", "acting"] },
  { symbol: "🥇", name: "1st place medal", keywords: ["win", "gold", "champion"] },
  { symbol: "📝", name: "memo", keywords: ["note", "writing", "document"] },
  { symbol: "🌈", name: "rainbow", keywords: ["color", "pride", "beautiful"] },
  { symbol: "🛒", name: "shopping cart", keywords: ["store", "buy", "grocery"] },
  { symbol: "🏡", name: "house", keywords: ["home", "building", "living"] },
  { symbol: "🍎", name: "red apple", keywords: ["fruit", "healthy", "food"] },
  { symbol: "🚦", name: "vertical traffic light", keywords: ["stop", "go", "road"] },
  { symbol: "🌺", name: "hibiscus", keywords: ["flower", "nature", "beautiful"] },
  { symbol: "🎂", name: "birthday cake", keywords: ["celebration", "party", "cake"] },
  { symbol: "📸", name: "camera", keywords: ["photo", "picture", "snapshot"] },
];

// Add the rest of your emojis here, with names and keywords.

const emojiPopup = document.createElement("div");
emojiPopup.id = "emojiPopup";
emojiPopup.className = "popup";
emojiPopup.innerHTML = `
    <div class="popup-content">
        <input type="text" id="emojiSearch" placeholder="Search for an emoji...">
        <div id="emojiList" class="emoji-grid scrollable-emoji-list"></div>
    </div>
`;
document.body.appendChild(emojiPopup);

const emojiList = document.getElementById("emojiList");

function loadEmojis(filteredEmojis) {
    emojiList.innerHTML = "";
    const maxEmojis = 10;
    const emojisToDisplay = filteredEmojis.slice(0, maxEmojis); // Limit to 10

    emojisToDisplay.forEach(emoji => {
        const emojiItem = document.createElement("span");
        emojiItem.className = "emoji-option";
        emojiItem.textContent = emoji.symbol; // Use the symbol
        emojiItem.addEventListener("click", () => selectEmoji(emoji.symbol)); // Pass the symbol
        emojiList.appendChild(emojiItem);
    });
}
// Filter Emojis
emojiSearch.addEventListener("input", () => {
  const query = emojiSearch.value.toLowerCase();
  const filtered = emojiData.filter(emoji => {
      return (
          emoji.symbol.includes(query) ||
          emoji.name.includes(query) ||
          emoji.keywords.some(keyword => keyword.includes(query))
      );
  });
  loadEmojis(filtered);
});
// Select and Add Emoji
function selectEmoji(selectedEmoji) {
    emojiHints.push(selectedEmoji);
    
    const emojiHintDiv = document.createElement("div");
    emojiHintDiv.className = "emojihint fade-in"; 

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "emoji";
    emojiSpan.textContent = selectedEmoji;

    emojiHintDiv.appendChild(emojiSpan);
    container.appendChild(emojiHintDiv);

    emojiPopup.style.display = "none"; // Close popup
}
  


// Show Popup
if(addHintButton){
  addHintButton.addEventListener("click", () => {
    if (emojiHints.length >= maxHints) {
        showPopup_NewTrivia("Max emoji hints limit is 5!");
        return;
    }
    emojiPopup.style.display = "flex"; // Show popup
    loadEmojis(allEmojis); // Load all emojis initially
  });
    
}
  function showPopup_NewTrivia(message) {
      const popup = document.createElement("div");
      popup.className = "popup_newtrivia";
      popup.textContent = message;
  
      document.body.appendChild(popup);
  
      setTimeout(() => {
          popup.remove();
      }, 2000); // Auto-remove after 2 seconds
  }

    const pastelColors = [
      "#FFD1DC", // Light Pink
      "#FFDFBA", // Peach
      "#FFECB3", // Pale Yellow
      "#FAE1DD", // Soft Coral
      "#F8D7DA", // Blush Pink
      "#F5E1FD", // Lavender
      "#E1D5E7", // Mauve
      "#D7C4E8", // Lilac
      "#C5CAE9", // Periwinkle
      "#BBDEFB", // Baby Blue
      "#D6E2F0", // Ice Blue
      "#E0BBE4", // Soft Purple
      "#FAD1D1", // Light Rose
      "#F4C2C2", // Salmon Pink
      "#FCE1E4"  // Pale Pink
    ];
  
    const covers = document.querySelectorAll(".cove");
  
    // Assign random pastel colors
    covers.forEach(cove => {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      cove.style.backgroundColor = randomColor;
    });


    // Assign emojis to elements
    emojiElements.forEach((el, index) => {
      el.textContent = emojiArray[index];
    });
  
    if(revealButton){
      revealButton.addEventListener("click", () => {
        console.log("reveal");
        revealNextEmoji();
      });
    }
  
    function revealNextEmoji() {
      if (currentIndex < covers.length) {
        covers[currentIndex].classList.add("fall"); // Remove cover for current emoji
        currentIndex++; // Move to the next one
      }
  
      // If all emojis are revealed, disable revealButton and enable giveupButton
      if (currentIndex === covers.length) {
        revealButton.classList.remove("enabled");
        revealButton.classList.add("disabled");
        giveupButton.classList.remove("disabled");
        giveupButton.classList.add("enabled");
      }
    }

    function showPopup(isCorrect) {
      const popup = document.createElement("div");
      popup.classList.add("popup", isCorrect ? "correct" : "incorrect");
  
      popup.innerHTML = `
        <div class="popup-content">
          <span class="emoji">${isCorrect ? "🎉" : "😵‍💫"}</span>
          <div class="popup-text">
            <h2>${isCorrect ? "Correct" : "Incorrect"}</h2>
            <p>${isCorrect ? "You da champ <3" : "2/3 tries remaining"}</p>
            <button class="submit-comment">Submit as Comment</button>
          </div>
          <button class="close-popup">✖</button>
        </div>
      `;
  
      document.body.appendChild(popup);
  
      // Close popup when the cross button is clicked
      popup.querySelector(".close-popup").addEventListener("click", () => {
        popup.remove();
      });
    }



   if(giveupButton){
    giveupButton.addEventListener("click", () => {
      if (giveupButton.classList.contains("enabled")) {
        showGiveUpPopup();
      }
    });
   }
  
    function showGiveUpPopup() {
      const popup = document.createElement("div");
      popup.classList.add("giveup-popup");
  
      popup.innerHTML = `
        <div class="popup-content">
          <p>Are you sure you wanna give up?</p>
          <div class="popup-buttons">
            <button id="confirmGiveUp">Yes :(</button>
            <button id="cancelGiveUp">Nah not yet :)</button>
          </div>
        </div>
      `;
  
      document.body.appendChild(popup);
  
      // Cancel button closes popup
      document.getElementById("cancelGiveUp").addEventListener("click", () => {
        popup.remove();
      });
  
      // Confirm button triggers dummy function
      document.getElementById("confirmGiveUp").addEventListener("click", () => {
        dummyGiveUpFunction();
        popup.remove();
      });
    }
  
    function dummyGiveUpFunction() {
      console.log("Give up confirmed!");
      // Add actual give-up logic here
    }



    const statsData = [
      "Trump - 2 Guesses",
      "Donald - 1 Guess",
      "Donald - 1 Guess",
      "Biden - 3 Guesses",
      "Obama - 1 Guess",
      "Elon - 4 Guesses",
      "Steve - 2 Guesses",
      "Mark - 5 Guesses",
      "Jeff - 2 Guesses",
      "Bill - 3 Guesses",
      "Larry - 1 Guess",
      "Sergey - 2 Guesses",
      "Tim - 4 Guesses",
      "Sundar - 2 Guesses",
      "Satya - 3 Guesses",
    ];
    
    const statsContainer = document.getElementById("stats-container");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    const pageIndicator = document.getElementById("pageIndicator");
    
    const itemsPerPage = 10;
    let currentPage = 1;
    
    function renderStats() {
      statsContainer.innerHTML = "";
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const visibleStats = statsData.slice(start, end);
    
      visibleStats.forEach((stat) => {
        const div = document.createElement("div");
        div.classList.add("stat-item");
        div.textContent = stat;
        statsContainer.appendChild(div);
      });
    
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = end >= statsData.length;
      pageIndicator.textContent = currentPage;
    }
    
    if(prevBtn){
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderStats();
        }
      });
    }
    
    if(nextBtn){
      nextBtn.addEventListener("click", () => {
        if (currentPage * itemsPerPage < statsData.length) {
          currentPage++;
          renderStats();
        }
      });
    }


    // Initial render
    if(statsContainer){
      renderStats();
    }

  }
}

new App();