import { emojiData } from "./emojiData.js";

class App {
  constructor() {

    
    this.initializeElements();
    this.setupEventListeners();
    this.setupEmojiPicker();
    this.setupPagination();
    this.setupCacheSystem();
    
    // Initialize state
    this.emojiHints = [];
    this.maxHints = 5;
    // this.emojiArray = ["🔥", "🤖", "🌍", "💣", "😨"]; // Default emoji hints array
    // this.emojiArray = [];
    this.currentIndex = 0;
    this.triviaData = {};
    // this.emojiElements = document.querySelectorAll(".emoji");
    const emojihintsContainer = document.querySelector(".emojihints");
    emojihintsContainer.innerHTML = ""; // Clear existing hints
    this.commentBtn = document.getElementById("commentanswer")

    // Assign emojis to elements

    
    // Assign random pastel colors to covers
    
    function   assignRandomColors() {
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
        "#FCE1E4", // Pale Pink
      ];
  
      // Assign random pastel colors
      const el = document.querySelectorAll(".cove");
      el.forEach((cove) => {
        const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        cove.style.backgroundColor = randomColor;
      });
    }

    function updateEmojiHints(emojiArrayLocal) {
      emojihintsContainer.innerHTML = ""; // Clear previous hints
    
      emojiArrayLocal.forEach((emoji) => {
        const hintDiv = document.createElement("div");
        hintDiv.classList.add("emojihint");
    
        const emojiSpan = document.createElement("span");
        emojiSpan.classList.add("emoji");
        emojiSpan.textContent = emoji;
    
        const coveDiv = document.createElement("div");
        coveDiv.classList.add("cove");
    
        const ribbonImg = document.createElement("img");
        ribbonImg.src = "assets/giftribbon.png";
        ribbonImg.classList.add("ribbon");
        coveDiv.appendChild(ribbonImg);
        hintDiv.appendChild(emojiSpan);
        hintDiv.appendChild(coveDiv);
        emojihintsContainer.appendChild(hintDiv);
      });
      assignRandomColors();
    }

    function showPopup(isCorrect) {
      // const popup = document.createElement("div");
      // popup.classList.add("popup", isCorrect ? "correct" : "incorrect");
  console.log("idhar tak hua")

  const popup = document.createElement("div");
  popup.className = "popup_newtrivia";
  popup.textContent = "message";

  document.body.appendChild(popup);

      // popup.innerHTML = `
      //   <div class="popup-content">
      //     <span class="emoji">lmaoo</span>
      //     <div class="popup-text">
      //       <h2>${isCorrect ? "Correct" : "Incorrect"}</h2>
      //       <p>${isCorrect ? "You da champ <3" : "2/3 tries remaining"}</p>
      //       <button class="submit-comment">Submit as Comment</button>
      //     </div>
      //     <button class="close-popup">✖</button>
      //   </div>
      // `;
  
      // document.body.appendChild(popup);
  
      // // Close popup when the cross button is clicked
      // popup.querySelector(".close-popup").addEventListener("click", () => {
      //   popup.remove();
      // });
    }

    // document.getElementById("submitanswerr").addEventListener("click", () => {
    //   console.log("checkk")
    //   // console.log(isCorrect);
    //   showPopup(false);
    // });
    // if (this.submitButton) {
      
    //   this.submitButton.addEventListener("click", () => {
    //     document.getElementById("correctanswer").innerHTML = `Your Answer: ${this.triviaData.triviaAnswer.toLowerCase()}`
    //   document.getElementById("youranswer").innerHTML = `Your Answer: ${this.guessinput.value.toLowerCase()}`
    //     console.log("checkk")
    //     // console.log(isCorrect);
    //     if(this.guessinput.value.toLowerCase() === this.triviaData.triviaAnswer.toLowerCase()){
    //       this.showPopup_NewTrivia("Correct Answer!");
    //       this.handleGiveUp(true, this.guessinput.value.toLowerCase())
    //     }
    //     else{
          
    //       this.showPopup_NewTrivia("Incorrect Answer!");
    //       this.handleGiveUp(false, this.guessinput.value.toLowerCase())
    //     }
    //     // showPopup(false);
    //   });
    // }


    let retryCount = 0; // Initialize retry counter
const maxRetries = 3; // Maximum allowed retries

if (this.submitButton) {
  this.submitButton.addEventListener("click", () => {
    document.getElementById("correctanswer").innerHTML = `Correct Answer: ${this.triviaData.triviaAnswer.toLowerCase()}`;
    document.getElementById("youranswer").innerHTML = `Your Answer: ${this.guessinput.value.toLowerCase()}`;
    
    console.log("checkk");

    if (this.guessinput.value.toLowerCase() === this.triviaData.triviaAnswer.toLowerCase()) {
      this.showPopup_NewTrivia("Correct Answer!");
      this.handleGiveUp(true, this.guessinput.value.toLowerCase());
      retryCount = 0; // Reset retry count on correct answer
    } else {
      retryCount++; // Increment retry count
      let remainingRetries = maxRetries - retryCount;

      if (remainingRetries > 0) {
        this.showPopup_NewTrivia(`Incorrect Answer! ${remainingRetries} retries remaining.`);
      } else {
        this.showPopup_NewTrivia("Incorrect Answer! Redirecting...");
        setTimeout(() => {
          this.handleGiveUp(false, this.guessinput.value.toLowerCase())
        }, 500); // Delay for user to read message
      }

      // this.handleGiveUp(false, this.guessinput.value.toLowerCase());
    }
  });
}
    
    // Add this to your script.js file
addEventListener('message', (event) => {
  // Check if the message is from Devvit
  console.log("trigger receiveddd")
  const message = event.data.data.message;
  // Handle the triggerScreenChange message
  if (message.type === 'triggerScreenChange') {
    console.log('Received screen change trigger:', message.data.index);
    
    // Execute your screen change logic here
    const screenIndex = message.data.index;
    
    // Example: Hide all screens first
    const allScreens = [
      document.getElementById('guessparent'),
      document.getElementById('newtriviaparent'),
      document.getElementById('finalanswersparent'),
      document.getElementById('leaderboardparent'),
      document.getElementById('infoparent')
    ];
    
    allScreens.forEach(screen => {
      if (screen) screen.style.display = 'none';
    });
    
    // Show the selected screen
    if (allScreens[screenIndex]) {
      allScreens[screenIndex].style.display = 'flex';
    }
    
    // You can also update UI elements based on the current screen
    // updateUIForScreen(screenIndex);
  }
  if (message.type === "leaderboardData") {
    console.log("Leaderboard received:", message.data);

    // const { top3, userRank, userScore } = message.data;
    const top3 = message.data["top"];
    console.log("top 3 is ", top3)
    const userRank = message.data.userRank;
    const userScore = message.data.userScore
    // Update the leaderboard UI
    document.getElementById("top1").innerHTML = top3[0] ? `@${top3[0].username} <br/> ${top3[0].score} guesses` : "N/A";
    document.getElementById("top2").innerHTML = top3[1] ? `@${top3[1].username} <br/> ${top3[1].score} guesses` : "N/A";
    document.getElementById("top3").innerHTML = top3[2] ? `@${top3[2].username} <br/> ${top3[2].score} guesses` : "N/A";
    document.getElementById("top3url").src = top3[2].avatarUrl
    document.getElementById("top2url").src = top3[1].avatarUrl
    document.getElementById("top2url").src = top3[0].avatarUrl

    // Display user rank and score
    document.getElementById("userRank").innerText = `Your Rank: ${userRank}`;
    document.getElementById("userScore").innerText = `Your Score: ${userScore}`;
  }
  else if (message.type === "triviaData") {
  console.log(message.data);
  this.showTriviaStatement.innerHTML = message.data.triviaStatement;
  this.emojiArray = message.data.hints;
  updateEmojiHints(message.data.hints); // Update hints dynamically
  this.triviaData = message.data
}
});

// Helper function to update UI elements based on current screen
function updateUIForScreen(screenIndex) {
  // Example: Update active state of navigation buttons
  const navButtons = [
    document.getElementById('home_button'),
    document.getElementById('newtrivia_button'),
    document.getElementById('finalanswers_button'),
    document.getElementById('leaderboard_button'),
    document.getElementById('info_button')
  ];
  
  navButtons.forEach((button, index) => {
    if (button) {
      if (index === screenIndex) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
  });
  
  // You can add more screen-specific logic here
  switch (screenIndex) {
    case 0: // guess screen
      console.log('Initializing guess screen');
      // Reset game state, etc.
      break;
    case 1: // new trivia screen
      console.log('Initializing new trivia screen');
      // Clear form fields, etc.
      break;
    // Add cases for other screens
  }
}

  }
  
  initializeElements() {
    this.revealButton = document.getElementById("reveal");
    this.giveupButton = document.getElementById("giveup");
    this.submitButton = document.getElementById("submitanswerr");
    this.addHintButton = document.getElementById("addhint");
    this.container = document.querySelector(".emojihintss");
    this.addtriviaButton = document.getElementById("addtriviabtn");
    this.triviaInput = document.getElementById("triviaInput");
    this.newtrivia_input = document.getElementById("newtrivia_input");
    this.newtrivia_button = document.getElementById("newtrivia_button");
    this.info_button = document.getElementById("info_button");
    this.leaderboard_button = document.getElementById("leaderboard_button");
    this.home_button = document.getElementById("home_button");
    this.guessbody = document.getElementById("guessbody");
    this.showTriviaStatement = document.getElementById("showTriviaStatement");
    this.loadingIndicator = document.getElementById("loading");
    this.covers = document.querySelectorAll(".cove");
    this.guessinput = document.getElementById("guessinput");
  }
  
  setupEventListeners() {
    // Navigation buttons
    if (this.home_button) {
      this.home_button.addEventListener('click', () => {
        console.log("screen change to home: triggered from html");
        window.parent.postMessage({ type: 'changeScreen', data: {screen: 0}}, '*');
      });
    }
    
    if (this.newtrivia_button) {
      this.newtrivia_button.addEventListener('click', () => {
        console.log("screen change to new trivia: triggered from html");
        window.parent.postMessage({ type: 'changeScreen', data: {screen: 1}}, '*');
      });
    }
    
    if (this.info_button) {
      this.info_button.addEventListener('click', () => {
        console.log("screen change to info screen: triggered from html");
        window.parent.postMessage({ type: 'changeScreen', data: {screen: 4}}, '*');
      });
    }
    
    if (this.leaderboard_button) {
      this.leaderboard_button.addEventListener('click', () => {
        console.log("screen change to leaderboard: triggered from html");
        window.parent.postMessage({ type: 'changeScreen', data: {screen: 3}}, '*');
      });
    }
    
    // Game buttons

    if (this.revealButton) {
      this.revealButton.addEventListener("click", () => {
        console.log("reveal");
        this.revealNextEmoji();
      });
    }
    
    if (this.giveupButton) {
      this.giveupButton.addEventListener("click", () => {
        if (this.giveupButton.classList.contains("enabled")) {
          this.showGiveUpPopup();
        }
      });
    }
    
    // New trivia buttons
    if (this.addtriviaButton) {
      this.addtriviaButton.addEventListener("click", () => {
        if (this.emojiHints.length === 0) {
          this.showPopup_NewTrivia("At least 1 emoji hint is required!");
          return;
        }

        if (!this.triviaInput.value.trim()) {
          this.showPopup_NewTrivia("Trivia answer cannot be empty!");
          return;
        }

        if (!this.newtrivia_input.value.trim()) {
          this.showPopup_NewTrivia("Trivia statement cannot be empty!");
          return;
        } else {
          console.log("doing a new post");
          window.parent.postMessage(
            {
              type: "newPost",
              data: {
                hints: this.emojiHints, 
                triviaAnswer: this.triviaInput.value, 
                triviaStatement: this.newtrivia_input.value
              },
            },
            "*"
          );
          return;
        }
      });
    }
    
    // Page visibility handling
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // The page is now visible, resume any paused activities
        console.log('Web view is visible');
        // Request fresh data when becoming visible again
        window.parent.postMessage({ type: 'webViewReady' }, '*');
      } else {
        // The page is now hidden, pause any background activities
        console.log('Web view is hidden');
      }
    });
    
  }

  
  
  setupEmojiPicker() {
    // Full Emoji List (Add more if needed)
   this.emojiData = emojiData
    // Create emoji popup
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
    this.emojiPopup = emojiPopup;
    this.emojiList = document.getElementById("emojiList");
    this.emojiSearch = document.getElementById("emojiSearch");
    
    // Filter Emojis
    if (this.emojiSearch) {
      this.emojiSearch.addEventListener("input", () => {
        const query = this.emojiSearch.value.toLowerCase();
        const filtered = this.emojiData.filter((emoji) => {
          return (
            emoji.symbol.includes(query) ||
            emoji.name.includes(query) ||
            emoji.keywords.some((keyword) => keyword.includes(query))
          );
        });
        this.loadEmojis(filtered);
      });
    }
    
    // Show Emoji Picker
    if (this.addHintButton) {
      this.addHintButton.addEventListener("click", () => {
        if (this.emojiHints.length >= this.maxHints) {
          this.showPopup_NewTrivia("Max emoji hints limit is 5!");
          return;
        }
        this.emojiPopup.style.display = "flex"; // Show popup
        this.loadEmojis(this.emojiData); // Load all emojis initially
      });
    }

    document.getElementById("commentanswer").addEventListener("click", () => {
      console.log("commment triggered debug 1")
      window.parent.postMessage({ type: 'addComment', data: {comment: this.guessinput.value.toLowerCase()}}, '*');
    });

    // if(this.commentBtn){
    
      
    // }
  }
  
  

  loadEmojis(filteredEmojis) {
    this.emojiList.innerHTML = "";
    const maxEmojis = 10;
    const emojisToDisplay = filteredEmojis.slice(0, maxEmojis); // Limit to 10

    emojisToDisplay.forEach((emoji) => {
      const emojiItem = document.createElement("span");
      emojiItem.className = "emoji-option";
      emojiItem.textContent = emoji.symbol; // Use the symbol
      emojiItem.addEventListener("click", () => this.selectEmoji(emoji.symbol)); // Pass the symbol
      this.emojiList.appendChild(emojiItem);
    });
  }
  
  selectEmoji(selectedEmoji) {
    this.emojiHints.push(selectedEmoji);

    const emojiHintDiv = document.createElement("div");
    emojiHintDiv.className = "emojihint fade-in";

    const emojiSpan = document.createElement("span");
    emojiSpan.className = "emoji";
    emojiSpan.textContent = selectedEmoji;

    emojiHintDiv.appendChild(emojiSpan);
    this.container.appendChild(emojiHintDiv);

    this.emojiPopup.style.display = "none"; // Close popup
  }
  
  setupPagination() {
    this.statsData = [
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

    this.statsContainer = document.getElementById("stats-container");
    this.prevBtn = document.getElementById("prevPage");
    this.nextBtn = document.getElementById("nextPage");
    this.pageIndicator = document.getElementById("pageIndicator");
    
    this.itemsPerPage = 10;
    this.currentPage = 1;

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.renderStats();
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        if (this.currentPage * this.itemsPerPage < this.statsData.length) {
          this.currentPage++;
          this.renderStats();
        }
      });
    }

    // Initial render
    if (this.statsContainer) {
      this.renderStats();
    }
  }
  
  renderStats() {
    this.statsContainer.innerHTML = "";
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const visibleStats = this.statsData.slice(start, end);

    visibleStats.forEach((stat) => {
      const div = document.createElement("div");
      div.classList.add("stat-item");
      div.textContent = stat;
      this.statsContainer.appendChild(div);
    });

    this.prevBtn.disabled = this.currentPage === 1;
    this.nextBtn.disabled = end >= this.statsData.length;
    this.pageIndicator.textContent = this.currentPage;
  }
  
  setupCacheSystem() {
    // Check for cached data on initialization
    const cachedData = this.getCachedTrivia();
    if (cachedData && this.showTriviaStatement) {
      // Use cached data immediately while requesting fresh data
      this.showTriviaStatement.innerHTML = cachedData.triviaStatement || '"ERROR!!"';
      
      // Update emoji hints if available
      if (cachedData.hints && cachedData.hints.length > 0) {
        this.emojiArray = cachedData.hints;
        this.emojiElements.forEach((el, index) => {
          if (index < cachedData.hints.length) {
            el.textContent = cachedData.hints[index];
          }
        });
      }
    }
  }
  
  cacheTrivia(triviaData) {
    localStorage.setItem('cachedTrivia', JSON.stringify(triviaData));
  }

  getCachedTrivia() {
    const cached = localStorage.getItem('cachedTrivia');
    return cached ? JSON.parse(cached) : null;
  }
  

  
  revealNextEmoji() {
    if (this.currentIndex < document.querySelectorAll(".cove").length) {
      document.querySelectorAll(".cove")[this.currentIndex].classList.add("fall"); // Remove cover for current emoji
      this.currentIndex++; // Move to the next one
    }

    // If all emojis are revealed, disable revealButton and enable giveupButton
    if (this.currentIndex === document.querySelectorAll(".cove").length) {
      this.revealButton.classList.remove("enabled");
      this.revealButton.classList.add("disabled");
      this.giveupButton.classList.remove("disabled");
      this.giveupButton.classList.add("enabled");
    }
  }
  

  
  showGiveUpPopup() {
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

    // Confirm button triggers give up function
    document.getElementById("confirmGiveUp").addEventListener("click", () => {
      this.handleGiveUp();
      popup.remove();
    });
  }
  
  handleGiveUp(correct, guess) {
    if(correct){
      console.log("answer was correct")
    }
    console.log("Give up confirmed!");
    // Send message to Devvit app
    window.parent.postMessage({ 
      type: 'giveUp', 
      data: { postId: this.getPostIdFromUrl(), answer:  guess, fulldata: this.triviaData} 
    }, '*');

  }
  
  getPostIdFromUrl() {
    // Implementation depends on how you're passing the post ID
    // This is a placeholder implementation
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('postId') || '';
  }
  
  showPopup_NewTrivia(message) {
    const popup = document.createElement("div");
    popup.className = "popup_newtrivia";
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 2000); // Auto-remove after 2 seconds
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Tell Devvit that the web view is ready to receive data
  window.parent.postMessage({ type: 'webViewReady' }, '*');
  
  // Initialize the app
  new App();
});