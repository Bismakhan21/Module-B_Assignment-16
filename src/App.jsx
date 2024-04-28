import { useEffect, useState } from "react";
import "./App.css";
import { getDatabase, onChildAdded, push, ref, set, remove } from "firebase/database";
import { app } from "./config/firebase";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FaUserCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { RxAvatar } from "react-icons/rx";

function App() {

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const googleLogin = () =>{
    signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    setUser({name:result.user.displayName, email: result.user.email})
    console.log(token, user);

  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  }
  const [user, setUser] = useState('');
  const [chats, setChats] = useState([]);
  const [msg, setMsg] = useState('');

  const db = getDatabase();
  const chatListRef = ref(db, 'chats');

  const updateHeight=()=>{
    const el = document.getElementById('chat');
    if(el){
      el.scrollTop = el.scrollHeight;
    }
  }

  useEffect(()=>{
    const unsubscribe = onChildAdded(chatListRef, (snapshot) => {
      const newChat = snapshot.val();
      setChats(chats => [...chats, { id: snapshot.key, ...newChat }]);
      setTimeout(()=>{
        updateHeight()
      },100)
    });
    return () => {
      unsubscribe(); 
    };
  },[])

  const sendChat = () => {
    if (msg.trim() !== '') {
      const chatRef = push(chatListRef);
      set(chatRef, {
        user, message: msg 
      });
      setMsg('');
    }
  };

  const deleteChat = (chatId) => {
    remove(ref(db, `chats/${chatId}`))
      .then(() => {
        setChats(chats.filter(chat => chat.id !== chatId));
      })
      .catch(error => {
        console.error("Error deleting message: ", error);
      });
  };
  

  const editChat = (chatId, currentMessage) => {
    const newMessage = prompt("Edit message:", currentMessage);
    if (newMessage !== null) {
      const chatRef = ref(db, `chats/${chatId}`);
      set(chatRef, {
        ...chats.find(chat => chat.id === chatId),
        message: newMessage
      });
      
      setChats(chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, message: newMessage };
        }
        return chat;
      }));
    }
  };
  

  return (
    <div>
      {user.email? null: <div className="main">
        <h1>Message App</h1>
        {/* <input
          type="text"
          placeholder="Enter user to start"
          onBlur={(e) => setUser(e.target.value)}
        ></input> */}
        <button onClick={e=>{googleLogin()}}>Google SignIn</button>
      </div>}
   { user.email? <div>
      <h3>User: {user.name}</h3>
      <div id="chat" className="chat-container">
      {chats.map((c) => (
  <div key={c.id} className={`container ${c.user.email === user.email ? 'me' : ''}`}>
    <p className="chatbox">
    <span className="user-icon"><FaUserCircle /></span>
      <strong>{c.user.name}: </strong>
      <span className="message">{c.message}</span>
      
      {c.user.email === user.email && (
        <div className="button-container">
          <button className="delete-btn" onClick={() => deleteChat(c.id)}><MdDelete /></button>
          <button className="edit-btn" onClick={() => editChat(c.id, c.message)}><MdEdit /></button>
        </div>
      )}
    </p>
  </div>
))}
      </div>
      <div className="btm">
      <span className="user-img"><RxAvatar /></span>
        <input
          type="text"
          onInput={(e) => setMsg(e.target.value)}
          value={msg}
          placeholder="enter your chat"
        ></input>
        <button onClick={(e) => sendChat()}>Send</button>
      </div>
      </div> : null}
      </div>
  );
}

export default App;
