import { Avatar, Button, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ChatIcon from '@material-ui/icons/Chat'
import SearchIcon from '@material-ui/icons/Search'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import { useRouter } from 'next/router';

function Sidebar() {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const [chats, setChats] = useState([]);
    // const [chatsSnapshot] = useCollection

    const createChat = async () => {
        const input = prompt('Please enter an email address');

        if(!input) return null;

        if(EmailValidator.validate(input) && input != user.email && !chatAlreadyExists(input)) {
            // Add the chat into the db 'chats' collection
            addDoc(collection(db, 'chats'),{
                users: [user.email, input],
            });
        }
    }

    const chatAlreadyExists = (recipientEmail) => 
        !!onSnapshot(query(collection(db, 'chats'), where('users', 'array-contains', user.email)), snapshot => {
            snapshot.docs.find(chat => chat.data().users.find(user => user === recipientEmail).length > 0)
    });

    useEffect(() => 
        onSnapshot(query(collection(db, 'chats'), where('users', 'array-contains', user.email)), snapshot => {
            setChats(snapshot.docs);
        })
    , [db, user]);

  return (
    <Container>
        <Header>
            <UserAvatar src={user?.photoURL} onClick={() => signOut(auth).then(router.push('/login'))}/>
            <IconsContainer>
                <IconButton>
                    <ChatIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>
        <Search>
            <SearchIcon />
            <SearchInput placeholder='Search in chats'/>
        </Search>
        <SidebarButton onClick={createChat}>Start a new Chat</SidebarButton>

        {/* List of Chats */}
        {
            chats.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            ))
        }
    </Container>
  )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid whitesmoke;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const SidebarButton = styled(Button)`
    width: 100%;

    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`

const IconsContainer = styled.div``;
