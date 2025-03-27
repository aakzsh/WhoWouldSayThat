import "./createPost.js";
import { Devvit, useState, useWebView } from "@devvit/public-api";
import type { DevvitMessage } from "./message.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: "Who Would Say That?",
  height: "tall",
  render: (context) => {
    const screens = [
      "guess",
      "newtrivia",
      "finalanswers",
      "leaderboard",
      "info",
    ];
    const [answered, setAnswered] = useState(false);
    const [isauthor, setAuthor] = useState(false);
    const [currentScreen, setCurrentScreen] = useState(0);
    const [guess, setGuess] = useState("");
    const [topGuesses, setTopGuesses] = useState<[string, number][]>([]);

    const [triviaStatement] = useState(async () => {
      console.log("[Trivia] Fetching trivia data for post:", context.postId);
      const data = await context.redis.get(context.postId as string);
      
      if (data) {
        const parsedTriviaData = JSON.parse(data);
        const isAuthor = parsedTriviaData.author === context.userId;
        
        // Check if user has made a guess
        const guessesKey = `${context.postId}_guesses`;
        const guessesData = await context.redis.get(guessesKey);
        const userGuesses = guessesData ? JSON.parse(guessesData) : {};
        
        if (userGuesses[context.userId as string]) {
          console.log("[Trivia] User has already guessed");
          setGuess(userGuesses[context.userId as string][0]);
          setAnswered(true);
        }
        
        if (isAuthor) {
          console.log("[Trivia] User is the author of this trivia");
          setAuthor(true);
        }

        // Fetch top guesses when loading trivia
        await fetchTopGuesses(context.postId as string);
        
        return parsedTriviaData.triviaStatement || "No trivia available";
      }
      return "No data found";
    });

    async function fetchTopGuesses(postId: string) {
      const guessesKey = `${postId}_guesses`;
      const guessesData = await context.redis.get(guessesKey);
      const guesses = guessesData ? JSON.parse(guessesData) : {};

      // Count all guesses
      const guessCounts: Record<string, number> = {};
      Object.values(guesses).forEach((userGuesses: any) => {
        userGuesses.forEach((guess: string) => {
          const normalizedGuess = guess.toLowerCase().trim();
          guessCounts[normalizedGuess] = (guessCounts[normalizedGuess] || 0) + 1;
        });
      });

      // Sort and get top 3
      const sortedGuesses = Object.entries(guessCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      setTopGuesses(sortedGuesses);
    }

    async function handleComment(author: string, comment: string) {
      try {
        await context.reddit.submitComment({
          id: context.postId || "",
          text: `${author} guessed: ${comment}`,
        });
        console.log("[Comment] Successfully added comment");
        context.ui.showToast("Comment added successfully!");
      } catch (error) {
        console.error("[Comment] Error adding comment:", error);
        context.ui.showToast("Failed to add comment");
      }
    }

    const { mount } = useWebView({
      url: `guess.html`,
      onMessage: async (msg: any, webView) => {
        console.log("[WebView] Received message:", msg.type);
        
        if (msg.type === "changeScreen") {
          const screenName = screens[Number(msg.data.screen)];
          console.log(`[Navigation] Changing to screen: ${screenName}`);
          
          if (screenName === "leaderboard") {
            await handleLeaderboardFetch(webView);
          }
          
          webView.postMessage({
            type: "triggerScreenChange",
            data: { index: msg.data.screen },
          });
          setCurrentScreen(Number(msg.data.screen));
        } 
        else if (msg.type === "newPost") {
          await handleNewPost(msg, context);
        } 
        else if (msg.type === "addComment") {
          await handleComment(context.userId as string, msg.data.comment);
        } 
        else if (msg.type === "fetchLeaderboard") {
          await handleLeaderboardFetch(webView);
        } 
        else if (msg.type === "webViewReady") {
          await handleWebViewReady(webView, context);
        } 
        else if (msg.type === "giveUp") {
          await handleGiveUp(msg, webView, context);
        }
      },
      onUnmount: () => {
        console.log("[WebView] Web view closed");
      },
    });

    async function handleLeaderboardFetch(webView: any) {
      console.log("[Leaderboard] Fetching leaderboard data");
      const leaderboardData = await context.redis.get("leaderboard");
      let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : {};

      let sortedLeaderboard = Object.entries(leaderboard)
        .map(([username, score]) => ({ username, score }))
        .sort((a, b) => Number(b.score) - Number(a.score));

      const top3 = sortedLeaderboard.slice(0, 3);
      const user = await context.reddit.getCurrentUsername();
      let userRank = sortedLeaderboard.findIndex(entry => entry.username === user) + 1;

      const enhancedTop3 = await Promise.all(
        top3.map(async (user) => {
          const avatarUrl = await context.reddit.getSnoovatarUrl(user.username);
          return {
            ...user,
            avatarUrl: avatarUrl || "assets/default-snoovatar.png",
          };
        })
      );

      webView.postMessage({
        type: "leaderboardData",
        data: {
          top: enhancedTop3 as any,
          userRank: userRank > 0 ? userRank : "Unranked",
          userScore: leaderboard[user as any] || 0,
        },
      });
    }

    async function handleNewPost(msg: any, context: any) {
      console.log("[Post] Creating new trivia post");
      const postInfo = await context.reddit.submitPost({
        title: `Who Would Say That?`,
        subredditName: context.subredditName || "",
        preview: (
          <vstack height="100%" width="100%" alignment="middle center">
            <text size="large">Loading your trivia...🧑‍🚀</text>
          </vstack>
        ),
      });

      console.log("[Post] New post created with ID:", postInfo.id);
      
      const post_data = {
        triviaAnswer: msg.data.triviaAnswer,
        triviaStatement: msg.data.triviaStatement,
        hints: msg.data.hints,
        author: context.userId,
        timeStamp: Date.now(),
        postID: postInfo.id,
        subredditID: context.subredditId,
      };

      // Initialize empty guesses object
      const guessesKey = `${postInfo.id}_guesses`;
      await context.redis.set(guessesKey, JSON.stringify({}));
      
      const redisUpdate = await context.redis.set(
        postInfo.id,
        JSON.stringify(post_data)
      );
      
      console.log("[Redis] Post data update status:", redisUpdate);
      context.ui.navigateTo(postInfo);
    }

    async function handleWebViewReady(webView: any, context: any) {
      console.log("[WebView] WebView ready, sending initial data");
      const triviaData = await context.redis.get(context.postId || "");
      
      if (triviaData) {
        const parsedTriviaData = JSON.parse(triviaData);
        webView.postMessage({
          type: "triviaData",
          data: parsedTriviaData,
        });

        const isAuthor = parsedTriviaData.author === context.userId;
        const guessesKey = `${context.postId}_guesses`;
        const guessesData = await context.redis.get(guessesKey);
        const hasGuessed = guessesData && JSON.parse(guessesData)[context.userId as string];
        
        console.log(`[WebView] User status - isAuthor: ${isAuthor}, hasGuessed: ${hasGuessed}`);
        
        // Fetch top guesses when webview is ready
        await fetchTopGuesses(context.postId as string);
      }
    }

    async function handleGiveUp(msg: any, webView: any, context: any) {
      console.log("[Guess] User submitted answer:", msg.data.answer);
      const postId = context.postId || "";
      const guessesKey = `${postId}_guesses`;
      
      // Get current guesses
      const guessesData = await context.redis.get(guessesKey);
      let guesses = guessesData ? JSON.parse(guessesData) : {};
      
      // Get user info
      const user = await context.reddit.getCurrentUsername();
      const userId = context.userId;
      
      // Update guesses
      if (!guesses[userId as string]) {
        guesses[userId as string] = [];
      }
      
      guesses[userId as string].push(msg.data.answer);
      
      // Save updated guesses
      await context.redis.set(guessesKey, JSON.stringify(guesses));
      console.log("[Redis] Updated guesses stored for user:", userId);
      
      // Check if answer is correct
      const triviaData = await context.redis.get(postId);
      if (triviaData) {
        const trivia = JSON.parse(triviaData);
        
        if (trivia.triviaAnswer.toLowerCase() === msg.data.answer.toLowerCase()) {
          console.log("[Guess] Correct answer! Updating leaderboard...");
          await updateLeaderboard(user);
        }
      }
      
      // Refresh top guesses after new guess
      await fetchTopGuesses(postId);
      
      webView.postMessage({
        type: "triggerScreenChange",
        data: { index: 2 },
      });
      setCurrentScreen(2);
    }

    async function updateLeaderboard(username: string) {
      console.log("[Leaderboard] Updating score for user:", username);
      const leaderboardData = await context.redis.get("leaderboard");
      const leaderboard = leaderboardData ? JSON.parse(leaderboardData) : {};
      
      if (!(username in leaderboard)) {
        leaderboard[username] = 0;
      }
      
      leaderboard[username] += 1;
      
      await context.redis.set("leaderboard", JSON.stringify(leaderboard));
      console.log("[Leaderboard] Updated leaderboard stored");
    }

    return (
      <vstack
        height="100%"
        gap="medium"
        alignment="middle center"
        backgroundColor="#C3FFDB"
      >
        {isauthor? (
          <vstack height="100%" gap="medium" alignment="middle center">
            <image url="logo.png" imageHeight={250} imageWidth={250} />
            <text size="xxlarge" weight="bold" color="black">
              {`"${triviaStatement}"` || "Loading trivia..."}
            </text>
            <text color="black">You're the author of this trivia.</text>
            <text size="large" weight="bold" color="black">Top Guesses:</text>
            <vstack gap="medium">
              {topGuesses.map(([guess, count]) => (
                <text  color="#3E614C" key={guess}>{`"${guess}": ${count} ${count === 1 ? 'person' : 'people'} guessed this`}</text>
              ))}
              {topGuesses.length === 0 && <text>No guesses yet</text>}
            </vstack>
          </vstack>
        ) : answered? (
          <vstack height="100%" gap="medium" alignment="middle center">
            <text size="large" weight="bold" color="black">Top Guesses:</text>
            <vstack gap="medium">
              {topGuesses.map(([guess, count]) => (
                <text color="#3E614C" key={guess}>{`"${guess}": ${count} ${count === 1 ? 'person' : 'people'} guessed this`}</text>
              ))}
              {topGuesses.length === 0 && <text>No guesses yet</text>}
            </vstack>
            <image url="logo.png" imageHeight={250} imageWidth={250} />
            <text size="xxlarge" weight="bold" color="black">
              {`"${triviaStatement}"`}
            </text>
            <button onPress={async () => {
              const username = await context.reddit.getCurrentUsername()
              try {
                await context.reddit.submitComment({
                  id: context.postId || "",
                  text: `u/${username} guessed: ${guess}`,
                })
                console.log("[Comment] Successfully added comment");
                context.ui.showToast("Comment added successfully!");
              } catch (error) {
                console.error("[Comment] Error adding comment:", error);
              }
            }}>
              Comment Your Guess
            </button>
          </vstack>
        ) : (
          <vstack height="100%" gap="medium" alignment="middle center">
            <image url="logo.png" imageHeight={250} imageWidth={250} />
            <text size="xxlarge" weight="bold" color="black">
              {`"${triviaStatement}"` || "Loading trivia..."}
            </text>
            <button onPress={mount}>Guess</button>
          </vstack>
        )}
      </vstack>
    );
  },
});

export default Devvit;