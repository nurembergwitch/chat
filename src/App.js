import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


firebase.initializeApp({
  //go to firebase -> create project, create this shit
  //then authentication -> enable google sign-in
  //then cloud firestore -> make a database
  //then gear icon -> project settings -> </> icon (web app) -> copy the given code and paste it here
  apiKey: "AIzaSyAUyr8V6t-TPxwKkLwCPxO-fCuoVPkjWJs",
  authDomain: "totally-not-a-chat.firebaseapp.com",
  projectId: "totally-not-a-chat",
  storageBucket: "totally-not-a-chat.appspot.com",
  messagingSenderId: "683642528549",
  appId: "1:683642528549:web:e59cbc78fc94a08c2730cc",
  measurementId: "G-3BS8XGZCNQ"

})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


//-----------------------------------------main app component
function App() {
  const [user] = useAuthState(auth);

  //password for rendering the frontpage
  const [password, setPassword] = useState('')
  const handlePasswordChange = (event) =>{
    setPassword(event.target.value)
  }

  const [entered, setEntered] = useState(false)
  const enterPassword = (event) =>{
    event.preventDefault()
    //CHANGE PASSWORD HERE
    if (password === 'lidy') {
      setEntered(true)
      console.log('WELCOME, MY LIGHT')
    } else{
      setEntered(false)
      console.log('YOU SHALL NOT PASS')
    }
  }

  
  return (
    <div className="App">
      <div className='passwordinput'>
      <form onSubmit={enterPassword}>
        <input value={password} onChange={handlePasswordChange} />
        <button type='submit'>ENTER PASSWORD</button>
      </form>
    </div>
    {entered ? <section>
      {user ? <><div><SignOut /></div><div><Chatroom /></div></> : <SignIn /> }
    </section> : <div className='snailgif'><img src="https://64.media.tumblr.com/20bd6f0fe49c1130424dea13e12001b4/tumblr_mgk3f0KlTq1rfjowdo1_1280.gif" /></div>}

    </div>
  );
}


//-------------------------------this is a component
const SignIn = () =>{
  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  } 

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

//------------------------------------another component
const SignOut = () =>{
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

//------------------------------component for the chat itself
const Chatroom = () =>{
  //using a created firestore collection
  const messagesRef = firestore.collection('messages')
  //query for a subset of documents in the collection, ordered by timestamp (added it in the cloud firestore table)
  const query=  messagesRef.orderBy('createdAt').limit(25)
  //listening to data updates with a firebase hook. It's an array of objects where each obj is a chat message in the db
  const [messages] = useCollectionData(query, {idField: 'id'})

  //handling the input value change
  const [msgText, setMsgText] = useState('')
  const handleMsgTextChange = (event) =>{
    setMsgText(event.target.value)
  }

  //handling message submission
  const sendMessage = async(event) =>{
    event.preventDefault()
    const {uid, photoURL} = auth.currentUser
    //takes a js
    await messagesRef.add({
      text: msgText,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setMsgText('')
  }


  return (
    <>
    <div className='pagearea'>
      <div className='chat'>
        <div>
          {messages && messages.map(m => <ChatMessage key={m.id} message={m}/>)}
        </div>
        <form onSubmit={sendMessage}>
          <input value={msgText} onChange={handleMsgTextChange} />
          <button type='submit'>SEND</button>
        </form>
      </div>

      <div className='snailgif'>
        <img src="https://64.media.tumblr.com/tumblr_m9ygs7Uvxd1rfjowdo1_500.gifv" />
      </div>
    </div>
    </>
  )
}

//-----------------------------------component for chat messages
const ChatMessage = (props) =>{
  const {text, uid, photoURL} = props.message
  //adding diff styles depending on whether youre the logged in user
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  )
}

export default App;
