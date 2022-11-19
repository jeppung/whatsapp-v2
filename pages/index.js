import Head from 'next/head'
import Image from 'next/image'
import { useAuthState } from 'react-firebase-hooks/auth'
import Loading from '../components/Loading';
import Sidebar from '../components/Sidebar'
import { auth } from '../firebase';


export default function Home() {

  const [user, loading] = useAuthState(auth);

  return (
    <div>
      <Head>
        <title>Whatsapp@v2</title>
      </Head>

      <Sidebar />
      
    </div>
  )
}
