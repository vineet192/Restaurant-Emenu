import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import ProfileCard from '../components/profileCard';

export default function Home() {
  const { currentUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
    }
  });

  return (
    <div className="h-screen">
      {currentUser && <ProfileCard></ProfileCard>}
    </div>
  );
}
