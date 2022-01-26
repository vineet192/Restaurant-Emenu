import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import NavBar from '../../components/nav';
import MenuForm from '../../components/menu';

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
      <MenuForm></MenuForm>
    </div>
  );
}
