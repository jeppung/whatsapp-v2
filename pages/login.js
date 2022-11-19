import { Button } from '@material-ui/core';
import { signInWithPopup } from 'firebase/auth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react'
import styled from 'styled-components';
import { auth, provider } from '../firebase';

function login() {

    const router = useRouter();

    const signIn = async () => {
        signInWithPopup(auth,provider).then(router.push('/')).catch(alert);
    }

  return (
    <div>
        <Container>
            <Head>
                <title>Login</title>
            </Head>

            <LoginContainer>
                <Logo src='https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png'/>
                <Button variant='outlined' onClick={signIn}>Sign In with Google</Button>
            </LoginContainer>
        </Container>
    </div>
  )
}

export default login

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;

`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;

`;