import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import MenuForm from '../../components/menuForm';

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
      <MenuForm menuID={menuID as string}></MenuForm>
    </div>
  );
}
