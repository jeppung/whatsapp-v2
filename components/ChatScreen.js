import { Avatar, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import getRecipientEmail from '../utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import Message from './Message';
import  InsertEmoticonIcon  from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
// import Moment from 'react-moment';
import Moment from 'react-moment';


function ChatScreen({chat, messages}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const [lastSeen, setLastSeen] = useState(null);
    const router = useRouter();
    const [messageSnapshot] = useCollection(query(collection(db, 'chats', router.query.id, 'messages'), orderBy('timestamp', 'asc')));
    const recipientEmail = getRecipientEmail(chat.users, user);
    const [recipientSnapshot]= useCollection(query(collection(db, 'users'), where('email','==',recipientEmail)));
    
    const recipient = recipientSnapshot?.docs?.[0].data()

    const showMessages = () => {
        if(messageSnapshot){
            return messageSnapshot.docs.map(message => (
                <Message key={message.id} user={message.data().user} message={{...message.data(),timestamp: message.data().timestamp?.toDate().getTime()}}/>
            ))
        }else{
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message}/>
            ))
        }
    }


    const sendMessage = async (e) => {
        e.preventDefault();
        
        const msg = input;
        setInput('');

        // Update lastSeen of user
        await setDoc(doc(db, 'users', user.uid), {
            lastSeen: serverTimestamp()
        }, {merge: true});

        // Add message
        await addDoc(collection(db, 'chats', router.query.id, 'messages'),{
            timestamp: serverTimestamp(),
            message: msg,
            user: user.email,
            photoURL: user.photoURL
        })

        
    }

  return (
    <Container>
        <Header>
            {
                recipient ? (
                    <Avatar src={recipient?.photoURL}/>
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )
            }
            <HeaderInformation>
                <h3>{recipientEmail}</h3>
                <div>
                Last Seen<span> </span>
                <Moment fromNow>
                    {recipient?.lastSeen.toDate().getTime()}
                </Moment>
                </div>
            </HeaderInformation>
            <HeaderIcons>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </HeaderIcons>
        </Header>

        <MessageContainer>
            {
                showMessages()
            }
            <EndOfMessage />
        </MessageContainer>

        <InputContainer>
            <InsertEmoticonIcon />
            <Input value={input} onChange={e => setInput(e.target.value)}/>
            <button disabled={!input} type='submit' hidden onClick={sendMessage}>Send Message</button>
            <MicIcon />
        </InputContainer>
    </Container>
  )
}

export default ChatScreen

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: 0;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const Container = styled.div`
    
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;

`;
const HeaderInformation = styled.div`
    margin-left: 15px;
    /* background-color: red; */
    flex: 1;
    display: flex;
    flex-direction: column;
    /* align-items: center; */

    > h3 {
        padding: 0;
        margin-top: 0;
        /* background-color:white; */
        margin-bottom: 3px;
    }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    background-color: #e5ded8;
    min-height: 90vh;
`;
const EndOfMessage = styled.div``;