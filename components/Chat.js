import { Avatar } from '@material-ui/core';
import { getAuth } from 'firebase/auth';
import { collection, getDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import styled from 'styled-components'
import { auth, db } from '../firebase';
import getRecipientEmail from '../utils/getRecipientEmail';

function Chat({id, users}) {
    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(users, user))))
    const recipient = recipientSnapshot?.docs?.[0];

    const recipientEmail = getRecipientEmail(users, user);

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }


  return (
    <Container onClick={enterChat}>
        {recipient ? (
            <UserAvatar src={recipient?.data().photoURL}/>
        ):(
            <UserAvatar>{recipientEmail[0]}</UserAvatar>
        )}
        <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }
`;

const UserAvatar = styled(Avatar)`

    margin:5px;
    margin-right: 15px;
`;