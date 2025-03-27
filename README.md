# Who Would Say That? - Reddit Devvit App

![App Logo](logo.png)

A fun Reddit custom post type where users guess which character would say a given statement. Authors can create trivia posts, and other users can guess the character. The app tracks guesses and shows leaderboards.


## Features

- 🎭 Create "Who Would Say That?" trivia posts
- 🔍 Guess the correct character for statements
- 🏆 Leaderboard tracking top guessers
- 📊 View popular guesses (top 3 most guessed characters)
- 💬 Comment your guess directly to the post
- 🕵️‍♂️ Emojis hint system to help with questions

## Installation

### Prerequisites

- Node.js (v16 or higher)
- Devvit CLI installed globally
- Reddit account

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/aakzsh/WhoWouldSayThat.git
   cd WhoWouldSayThat
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install -g devvit
   ```

3. Log in to Devvit:
   ```bash
   devvit login
   ```

## Development

### Running Locally

1. Start the development server:
   ```bash
   devvit playtest r/Subredditname
   ```

2. The CLI will provide a URL to test your app in Reddit

3. To create a test post:
   - Use the "Create Post" button in the test interface
   - Select "Who Would Say That?" as the post type


## Support

For issues or questions, please:
- Open a GitHub issue
- Contact the maintainers

---

**Happy guessing!** 🎉