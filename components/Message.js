import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import Moment from 'react-moment';
import styled from 'styled-components';
import { auth } from '../firebase';

function Message({user, message}) {
    // console.log(message);
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver

  return (
    <Container>
        <TypeOfMessage>
            {message.message}
            <div>
                <Moment format="HH:mm">
                    {message?.timestamp}
                </Moment>
            </div>
        </TypeOfMessage>
    </Container>
  )
}

export default Message

const Container = styled.div`
    
`;

const MessageElement = styled.p`
    width: fit-content;
    padding: 10px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    /* padding-bottom: 26px; */
    position: relative;
    text-align: right;
`

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
    border-top-right-radius: 0%;

    > div {
        padding-top: 5px;
        /* padding: 0; */
        /* background-color: red; */
        font-size: 11px;
        text-align: right;
    }
`;

const Receiver = styled(MessageElement)`
    text-align: left;
    background-color: whitesmoke;
    border-top-left-radius: 0;

    > div {
        padding-top: 5px;
        /* padding: 0; */
        /* background-color: red; */
        font-size: 11px;
        text-align: right;
    }
`;