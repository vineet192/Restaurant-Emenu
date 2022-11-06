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

  if (currentUser === null) {
    return null;
  }

  return (
    <div className="h-screen">
      <ProfileCard></ProfileCard>
    </div>
  );
}
