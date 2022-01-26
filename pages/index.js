import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import NavBar from '../components/nav';
import MenuForm from '../components/menu';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  });
  return (
    <div>
      <NavBar></NavBar>
      <h1>Main Screen</h1>
    </div>
  );
}
