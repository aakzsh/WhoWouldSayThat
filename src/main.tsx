import "./createPost.js";
import { Devvit, useState, useAsync, useWebView } from "@devvit/public-api";
import type { DevvitMessage } from "./message.js";

Devvit.configure({
  redditAPI: true,
  redis: true,
});

type WebViewMessage =
  | {
      type: "initialData";
      data: { username: string; currentCounter: number };
    }
  | { type: "setCounter"; data: { newCounter: number } }
  | { type: "changeScreen"; data: { screen: Number } }
  | {
      type: "postNewTrivia";
      data: { statement: string; hints: string[]; answer: string };
    }
  | {
      type: "newPost";
      data: { hints: string[]; triviaAnswer: string; triviaStatement: string };
    }
  | { type: "fetchLeaderboard" }
  | { type: "settingPostData" }
  | { type: "getPostData" }
  | { type: "webViewReady" }
  | { type: "giveUp"; data: { postId: string; answer: string; fulldata: Object } }
  | {type: "leaderboardData", data: {top3: any, userRank: any, userScore: any}}
  | {type: "addComment", data: {comment: string}}

// Add a custom post type to Devvit
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
    const [currentScreen, setCurrentScreen] = useState(0);

    // const [triviaStatement, setTriviaStatement] = useState("Loading...");

    const [triviaStatement] = useState(async () => {
      const data = await context.redis.get(context.postId as string);
      if (data) {
        const parsedData = JSON.parse(data);
        return parsedData.triviaStatement || "No trivia available";
      }
      return "No data found";
    });

    // Using the new useWebView hook instead of the webview component
    const { mount } = useWebView({
      url: `guess.html`,
      onMessage: async (msg: any, webView) => {
        if (msg.type === "changeScreen") {
          console.log(
            "screen will change to ",
            screens[Number(msg.data.screen)]
          );
          if(screens[Number(msg.data.screen)]=="leaderboard"){
            console.log("Fetching leaderboard...");
          const leaderboardData = await context.redis.get("leaderboard");
        
          let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : {};
        
          // Convert object to array and sort by score
          let sortedLeaderboard = Object.entries(leaderboard)
            .map(([username, score]) => ({ username, score }))
            .sort((a, b) => Number(b.score) - Number(a.score)); // Sort in descending order
        
          // Get top 3 users
          const top3 = sortedLeaderboard.slice(0, 3);
          const userrr = await context.reddit.getCurrentUsername();
          // Find current user’s rank
          let userRank =
            sortedLeaderboard.findIndex((entry) => entry.username === userrr) + 1;
          const userid = context.userId
          console.log(top3, userRank)
          // const avatarUrl1 = await context.reddit.getSnoovatarUrl('username');
          // Send leaderboard data to HTML
          // context.reddit.avatar 
          const enhancedTop3 = await Promise.all(
            top3.map(async (user) => {
              // Fetch Snoovatar URL for each username
              const avatarUrl = await context.reddit.getSnoovatarUrl(user.username);
              
              // Return the original user object with the added avatarUrl property
              return {
                ...user,
                avatarUrl: avatarUrl || null // Handle case where user has no Snoovatar
              };
            })
          );
          webView.postMessage({
            type: "leaderboardData",
            data: {
              top: enhancedTop3 as any,
              userRank: userRank > 0 ? userRank : "Unranked",
              userScore: leaderboard.userid || 0,
            },
          });
            // webView.postMessage({
            //   type: "fetchLeaderboard",
            //   // data: { index: msg.data.screen },
            // });
          }
          webView.postMessage({
            type: "triggerScreenChange",
            data: { index: msg.data.screen },
          });
          setCurrentScreen(Number(msg.data.screen));
        } else if (msg.type === "newPost") {
          console.log("user will make a new trivia post now");
          const postInfo = await context.reddit.submitPost({
            title: `Who Would Say That?`,
            subredditName:
              context.subredditName === undefined ? "" : context.subredditName,
            // The preview appears while the post loads
            preview: (
              <vstack height="100%" width="100%" alignment="middle center">
                <text size="large">Loading your trivia...🧑‍🚀</text>
              </vstack>
            ),
          });
          console.log(
            "the id of new post is ",
            postInfo.id,
            " need to add redis data for it"
          );
          const post_data = {
            triviaAnswer: msg.data.triviaAnswer,
            triviaStatement: msg.data.triviaStatement,
            hints: msg.data.hints,
            author: context.userId,
            guesses: [],
            timeStamp: Date.now(),
            postID: postInfo.id,
            subredditID: context.subredditId,
          };
          const redisUpdate = await context.redis.set(
            postInfo.id,
            JSON.stringify(post_data)
          );
          console.log("redis update status: ", redisUpdate);
          context.ui.navigateTo(postInfo);
        } 

        else if (msg.type === "addComment" ){
          try {

            await context.reddit.submitComment({
              id: context.postId===undefined?"":context.postId,
              text: "guessed "
            });
            // await context.reddit.submitComment({
            //   id: context.postId as string,
            //   text: "guessed " + msg.data.comment
            // });
            context.ui.showToast("Comment added successfully!");
          } catch (error) {
            console.error("Error adding comment:", error);
            context.ui.showToast("Failed to add comment");
          }
        }
        else if (msg.type === "fetchLeaderboard") {
          console.log("Fetching leaderboard...");
          const leaderboardData = await context.redis.get("leaderboard");
        
          let leaderboard = leaderboardData ? JSON.parse(leaderboardData) : {};
        
          // Convert object to array and sort by score
          let sortedLeaderboard = Object.entries(leaderboard)
            .map(([username, score]) => ({ username, score }))
            .sort((a, b) => Number(b.score) - Number(a.score)); // Sort in descending order
        
          // Get top 3 users
          const top3 = sortedLeaderboard.slice(0, 3);
        
          const user = await context.reddit.getCurrentUsername();
          // Find current user’s rank
          let userRank =
            sortedLeaderboard.findIndex((entry) => entry.username === user) + 1;
            console.log("chhhh", sortedLeaderboard)
          const userid = context.userId
          console.log(top3, userRank)
          // Send leaderboard data to HTML
          webView.postMessage({
            type: "leaderboardData",
            data: {
              top: top3 as any,
              userRank: userRank > 0 ? userRank : "Unranked",
              userScore: leaderboard[user as any] || 0,
            },
          });
        }
        
        else if (msg.type === "webViewReady") {
          // When web view is ready, send your data
          const triviaData = await context.redis.get(
            context.postId === undefined ? "" : context.postId
          );
          if (triviaData) {
            const parsedTriviaData = JSON.parse(triviaData);

            // Send the trivia data to the web view
            webView.postMessage({
              type: "triviaData",
              data: parsedTriviaData,
            });

            // Check if current user is the author or has made a guess
            const isAuthor = parsedTriviaData.author === context.userId;

            // Check if user is in any of the guess arrays
            let hasGuessed = false;
            if (parsedTriviaData.guesses) {
              // Loop through all guesses to check if current user is in any array
              Object.values(parsedTriviaData.guesses).forEach((usersArray) => {
                if (
                  Array.isArray(usersArray) &&
                  usersArray.includes(context.userId)
                ) {
                  hasGuessed = true;
                }
              });
            }

            // UNCOMMENT IN PROD
            // if (isAuthor || hasGuessed) {
            //   webView.postMessage({
            //     'type': "triggerScreenChange",
            //     'data': {index: 2} // Using 2 as you mentioned in your code
            //   });
            //   setCurrentScreen(2);
            // }
          }
        } else if (msg.type === "giveUp") {
          // Handle give up action
          console.log("User gave up/guessed on trivia");
          const latestData = await context.redis.get(
            context.postId === undefined ? "" : context.postId
          );
          if (latestData) {
            const latestDataJson = JSON.parse(latestData);
            let target = latestDataJson.guesses.find(
              (obj: { hasOwnProperty: (arg0: string) => any }) =>
                obj.hasOwnProperty(msg.data.answer)
            );
            const ans = msg.data.answer;
            if (target) {
              target.ans.push(context.userId); // Add "abc" to the array
            }

            await context.redis.set(
              context.postId === undefined ? "" : context.postId,
              JSON.stringify(latestDataJson)
            );

            if(latestDataJson.triviaAnswer === ans){
              console.log("correct ans");
              const leaderboard = await context.redis.get(
                "leaderboard"
              );
              const newData = leaderboard ? JSON.parse(leaderboard) : {};
              const user = await context.reddit.getCurrentUsername();

// Ensure the user exists in the object before incrementing
if (!(user as any in newData)) {
  newData[user as any] = 0; // Initialize user score if not present
}

// Increment the user's score
newData[user as any] += 1;

              const res = await context.redis.set(
                "leaderboard", JSON.stringify(newData)
              );
              console.log(newData, "oldData")
              const leaderboardd = await context.redis.get(
                "leaderboard"
              );
              console.log(leaderboardd, "newData")
            }
          }


          webView.postMessage({
            type: "triggerScreenChange",
            data: { index: 2 },
          });
          setCurrentScreen(2);
          // Add your give up logic here
        }
      },
      onUnmount: () => {
        // Cleanup when web view is closed
        console.log("Web view closed");
      },
    });

    // Render a button to open the web view
    return (
      <vstack height="100%" gap="medium" alignment="middle center" backgroundColor="#C3FFDB">
  {/* <text color="black">Who Would Say That</text> */}
  <image url="logo.png" imageHeight={250} imageWidth={250}/>
  <text size="xxlarge" weight="bold" color="black">{`"${triviaStatement}"` || "Loading trivia..."}</text>
  
  <button onPress={mount}>Guess</button>
</vstack>
    );
  },
});

export default Devvit;
