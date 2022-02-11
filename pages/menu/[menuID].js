import { useRouter } from 'next/router';
import { useEffect } from 'react';
import NavBar from '../../components/nav';
import { useAuth } from '../../contexts/AuthContext';

export default function () {
  const router = useRouter();
  const menuID = router.query.menuID;
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
      return;
    }
    console.log(`get user ${currentUser.uid}'s menu ${menuID}`);
  });

  if (currentUser === null) {
    return null;
  }

  return (
    <div className='mt-36'>
      <h1>Menu preview</h1>
    </div>
  );
}
