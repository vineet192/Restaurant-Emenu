import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function () {
  const router = useRouter();
  const menuID = router.query.menuID;
  const { currentUser } = useAuth();
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

  const [menuCard, setMenuCard] = useState({});

  useEffect(() => {
    if (currentUser === null) {
      router.push('/login');
      return;
    }
    console.log(`get user ${currentUser.uid}'s menu ${menuID}`);
  });

  useEffect(async () => {
    let res = await fetch(
      `${SERVER_URL}/menu/${currentUser.uid}?menuID=${menuID}`
    );
    let data = await res.json();
    setMenuCard((prevState) => data.menu);
  }, []);

  if (currentUser === null || Object.keys(menuCard).length == 0) {
    return null;
  }

  return (
    <div className=" h-screen">
      {menuCard.categories.map((category, index) => (
        <div className="w-full flex justify-center p-2 m-2" key={index}>
          <h1>{category.title}</h1>
        </div>
      ))}

      <button className="absolute bottom-0 right-1/2 m-5 p-2 flex bg-blue-500 rounded w-fit">
        <h1>Menu</h1>
      </button>
    </div>
  );
}
