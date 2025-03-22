import './createPost.js';
import { Devvit, useState, useAsync, Subreddit} from '@devvit/public-api';
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
  | { type: "changeScreen"; data: { screen: Number } }
  | { type: "postNewTrivia"; data: { statement:string, hints: string[], answer: string  } }
  | { type: "newPost"; data: {hints: string[], triviaAnswer: string, triviaStatement: string}}
  | {type: "fetchLeaderboard"}
  | {type: "settingPostData"}
  | {type: "getPostData"}
  | {type: "webViewReady"}  


// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Who Would Say That?',
  height: 'tall',
  render: (context) => {

    const screens = ["guess", "newtrivia", "finalanswers", "leaderboard", "info"]
    const [currentScreen, setCurrentScreen] = useState(0)
    // add conditions for different messages here 
    const onMessage = async (msg: WebViewMessage) => {
      if (msg.type=="changeScreen"){
        console.log("screen will change to ", screens[Number(msg.data.screen)])
        setCurrentScreen(Number(msg.data.screen))
      }
      else if (msg.type=="newPost"){
        console.log("user will make a new trivia post now")
        const postInfo =  await context.reddit.submitPost({
                    title: `Who Would Say That?`,
                    subredditName: context.subredditName===undefined?"":context.subredditName,
                    // The preview appears while the post loads
                    preview: (
                      <vstack height="100%" width="100%" alignment="middle center">
                        <text size="large">Loading your trivia...🧑‍🚀</text>
                      </vstack>
                    ),
          });
        console.log("the id of new post is ", postInfo.id, " need to add redis data for it")
        const post_data = {triviaAnswer: msg.data.triviaAnswer, triviaStatement: msg.data.triviaStatement,
                hints: msg.data.hints, 
                author: context.userId, guesses: [], 
                timeStamp: Date.now(), 
                postID: postInfo.id,
                subredditID: context.subredditId,
        }
        const redisUpdate = await context.redis.set(postInfo.id, JSON.stringify(post_data))
        console.log("redis update status: ", redisUpdate)
        context.ui.navigateTo(postInfo)
      }
      else if (msg.type === 'webViewReady') {
        // When web view is ready, send your data
        const triviaData = await context.redis.get(context.postId===undefined?"":context.postId)
        const triviaDataToPass = triviaData??""
        // postMessage({ 
        //   type: 'triviaData', 
        //   data: JSON.parse(triviaDataToPass) 
        // });
      }
      // switch (msg.type) {
      //   case "postNewTrivia":
      //     console.log("posting new trivia")
      //     const subreddit = await context.reddit.getCurrentSubreddit();
      //     const post_data = {answer: msg.data.answer, statement: msg.data.statement,
      //       hints: msg.data.hints, 
      //       author: context.userId, guesses: [], 
      //       timeStamp: Date.now(), 
      //       postID: context.postId,
      //       subredditID: context.subredditId,
      //       }
      //       const newPost =     await context.reddit.submitPost({
      //           title: `Who Would Say That?`,
      //           subredditName: subreddit.name,
      //           // The preview appears while the post loads
      //           preview: (
      //             <vstack height="100%" width="100%" alignment="middle center">
      //               <text size="large">Loading your trivia...🧑‍🚀</text>
      //             </vstack>
      //           ),
      //         });
      //         const redis_output = await context.redis.set(newPost.id, JSON.stringify(post_data));
      //         console.log("new post posted successfully", newPost, redis_output)
      //     break;
      //     case "fetchLeaderboard":
      //         const leaderboard = await context.redis.get("leaderboard")
      //         if(leaderboard===null){
      //           const set_leaderboard = await context.redis.set("leaderboard", JSON.stringify({}))
      //           console.log("status of setting new leaderboard", set_leaderboard)
      //           context.ui.webView.postMessage("myWebView", {
      //             type: "leaderboard",
      //             data: { leaderboard: {}},
      //           }); 
      //         }
      //         else{
      //           context.ui.webView.postMessage("myWebView", {
      //             type: "leaderboard",
      //             data: { leaderboard: JSON.parse(leaderboard===undefined?"{}":leaderboard)},
      //           });
      //         }
      //     break
      //     case "changeScreen":
      //         console.log(msg.data)
      //         setCurrentScreen(Number.parseInt(msg.data.screen.toString()))
      //         console.log("changing screen")
      //     case "getPostData":
      //         const post_data_ = await set_post_data()
      //         // dont return, instead save state in usestate 
      //         // return post_data_
      //   default:
      //     throw new Error(`Unknown message type: ${msg}`);
      // }
    };

    // Render the custom post type
    return (
      <webview
          id={screens[currentScreen]}
          url={`${screens[currentScreen]}.html`}
          onMessage={(msg) => onMessage(msg as WebViewMessage)}
          grow
       />
    );
  },
});

export default Devvit;