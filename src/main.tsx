import './createPost.js';

import { Devvit, useState, useWebView, useAsync, RichTextBuilder } from '@devvit/public-api';

import type { DevvitMessage } from './message.js';

Devvit.configure({
  redditAPI: true,
  redis: true
});

type WebViewMessage =
  | {
      type: "initialData";
      data: { username: string; currentCounter: number };
    }
  | { type: "setCounter"; data: { newCounter: number } }
  | { type: "changeScreen"; data: { screen: string } }
  | { type: "postNewTrivia"; data: { statement:string, hints: string[], answer: string  } }
  | {type: "fetchLeaderboard"}
  // | { type: "getpostid"; data: { }}

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Who Would Say That?',
  height: 'tall',
  render: (context) => {

    const [currentScreen, setCurrentScreen] = useState("home")

    // useAsync(async () => {
    //   webView.mount()
    //   return 1;
    // }, {depends: []})

    
    const onMessage = async (msg: WebViewMessage) => {
      switch (msg.type) {
        case "postNewTrivia":
          console.log("posting new trivia")
          const subreddit = await context.reddit.getCurrentSubreddit();
          const post_data = {answer: msg.data.answer, statement: msg.data.statement,
            hints: msg.data.hints, 
            author: context.userId, guesses: [], 
            timeStamp: Date.now(), 
            postID: context.postId,
            subredditID: context.subredditId,
            }
            const newPost =     await context.reddit.submitPost({
                title: `Who Would Say That?`,
                subredditName: subreddit.name,
                // The preview appears while the post loads
                preview: (
                  <vstack height="100%" width="100%" alignment="middle center">
                    <text size="large">Loading your trivia...🧑‍🚀</text>
                  </vstack>
                ),
              });
              const redis_output = await context.redis.set(newPost.id, JSON.stringify(post_data));
              console.log("new post posted successfully", newPost, redis_output)
          break;
          case "fetchLeaderboard":
              const leaderboard = await context.redis.get("leaderboard")
              if(leaderboard===null){
                const set_leaderboard = await context.redis.set("leaderboard", JSON.stringify({}))
                console.log("status of setting new leaderboard", set_leaderboard)
                context.ui.webView.postMessage("myWebView", {
                  type: "leaderboard",
                  data: { leaderboard: {}},
                }); 
              }
              else{
                context.ui.webView.postMessage("myWebView", {
                  type: "leaderboard",
                  data: { leaderboard: JSON.parse(leaderboard===undefined?"{}":leaderboard)},
                });
              }

        default:
          throw new Error(`Unknown message type: ${msg}`);
      }
    };

    // Load latest counter from redis with `useAsync` hook
    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    const get_postID = () =>{
        const postid =  context.postId
        return postid
    } 
    // Render the custom post type
    return (
      <webview
          id="newTrivia"
          url="new_trivia.html"
          onMessage={(msg) => onMessage(msg as WebViewMessage)}
          grow
       />



    //    <hstack width="100%" height="100%">
    //    {currentView === "home" && <webview id="home" url="page.html" width="100%" height="100%"/>}
    //  {currentView === "info" && <webview id="info" url="info.html" width="100%" height="100%"/>}
    //  {currentView === "leaderboard" && <webview id="leaderboard" url="leaderboard.html" width="100%" height="100%" />}
    //  {currentView === "new_trivia" && <webview id="new_trivia" url="new_trivia.html" width="100%" height="100%"/>}
    //  {currentView === "" &&      
    //   <vstack>
    //    <button onPress={() => setCurrentView("home")} >Home</button>
    //    <button onPress={() => setCurrentView("info")} >Info</button>
    //    <button onPress={() => setCurrentView("leaderboard")} >Leaderboard</button>
    //    <button onPress={() => setCurrentView("new_trivia")} >New Trivia</button>
    //  </vstack>}
    //  </hstack>
    );
  },
});

export default Devvit;
