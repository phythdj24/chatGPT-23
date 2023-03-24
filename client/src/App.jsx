import send from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";
import React, { useEffect, useState } from "react";
import axios from "axios";



function App() {

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);


  useEffect(()=> {
         document.querySelector(".layout").scrollTop = document.querySelector(".layout").scrollHeight;
  }, [posts])

  const fetchBotResponse = async () => {
        const {data } = await axios.post("http://localhost:4000", {input}, {
          headers:{
            "Content-Type": "application/json",
          }
        })
        return data;
  }

  const onSubmit = () => {
          if(input.trim() === "") return;
          updatePosts(input)
          updatePosts("loading...", false, true)
          setInput("")
          fetchBotResponse().then((res) => {
            console.log(res)
            updatePosts(res.bot.trim(), true)
          });
  };


  const autoTypingBotResponse = (text) => {
     let index = 0;
     let interval = setInterval(()=> { 
      if(index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if(lastItem.type !== "bot" ) {
              prevState.push({
                type: "bot",
                post: text.charAt(index-1)
              })
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index-1)
            })
          }
          return [...prevState];
          
        })
        index++;
      }
         else {
        clearInterval(interval);
      }
     })
  }

  const updatePosts = (post, isBot, isLoading) => {
    if(isBot) {
      autoTypingBotResponse(post)
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? "loading" : "user", post} ]
        
      })
    }
    
  }
  
  const onKeyUp = (e) => {
    if(e.key === "Enter" || e.which === 13) {
      onSubmit()
    }
  };

  return (
    <main className="chatGPT-app">

      <section className="chat-container">
        <div className="layout">

        {posts.map((post, index) => (
  <div
    key={index}
    className={`chat-bubble ${
      post.type === "bot" || post.type === "loading" ? "bot" : ""
    }`}
  >
    <div className="avatar">
      <img src={post.type === "bot" || post.type === "loading" ? bot : user} />
    </div>

    {post.type === "loading" ? (
      <div className="loader">
        <img src={loadingIcon} />
      </div>
    ) : (
      <div className="post">{post.post}</div>
    )}
  </div>
))}

         
          

          
        </div>
      </section>
         <footer>
            <input value={input} type="text" className="composebar" autoFocus placeholder= "Welcome 🙏 To Atharv Dalal's Chat GPT.. Ask Anything!" onChange={(e) => setInput(e.target.value) } onKeyUp={onKeyUp} />
            {/* <div className="send-button " onClick={onSubmit}>
              <img src={send} />
            </div> */}
             <button onClick={onSubmit}>
  <div class="svg-wrapper-1">
    <div class="svg-wrapper">
      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
      </svg>
    </div>
  </div>
  <span>Send</span>
</button>

         </footer>
    </main>
  )
}

export default App
