import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import NavBar from '../../components/nav';
import MenuForm from '../../components/menu';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { menuID } = router.query;
  useEffect(() => {
    console.log(menuID);
    if (!currentUser) {
      router.push('/login');
    }
  });
  return (
    <div>
      <MenuForm></MenuForm>
    </div>
  );
}
