import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import PaginatedMenus from '../components/paginatedMenus';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
      return
    }

    if (!currentUser.emailVerified && !currentUser.isAnonymous) {
      router.push({ pathname: '/login', query: { err: "unverified" } })
    }
  });

  return (
    <div className="h-screen p-5">
      {/* {currentUser && <ProfileCard></ProfileCard>} */}
      {currentUser && <PaginatedMenus></PaginatedMenus>}
      <ToastContainer/>
    </div>
  );
}
