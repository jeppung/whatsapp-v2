import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components'
import ChatScreen from '../../components/ChatScreen';
import Sidebar from '../../components/Sidebar';
import { auth, db } from '../../firebase';
import getRecipientEmail from '../../utils/getRecipientEmail';

function Chat({messages, chat}) {
    const [user] = useAuthState(auth);
    
  return (
    <Container>
        <Head>
            <title>Chat with {getRecipientEmail(chat.users, user)}</title>
        </Head>
        <Sidebar />
        <ChatContainer>
            <ChatScreen chat={chat} messages={messages}/>
        </ChatContainer>
    </Container>
  )
}

export default Chat

export async function getServerSideProps(context) {
    const id = context.query.id;

    const qchat = query(doc(db,'chats',id));
    // Prep messages on the server
    const qmsg = query(collection(db, 'chats', id, 'messages'), orderBy('timestamp', 'asc'));

    const chatSnapshot = await getDoc(qchat);
    const messageSnapshot = await getDocs(qmsg);

    const messages = messageSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }));

    // Prep the chats
    const chat = {
        id: chatSnapshot.id,
        ...chatSnapshot.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display:flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;
    
    ::-webkit-scrollbar {
        display: none;
    }
`;

