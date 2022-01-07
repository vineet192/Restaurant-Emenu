import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import NavBar from '../components/nav';
import MenuForm from '../components/menu';

export default function Home() {
  return (
    <div>
      <NavBar></NavBar>
      <MenuForm></MenuForm>
    </div>
  );
}
