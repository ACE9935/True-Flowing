"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/firebase/firebase';
import { getUserById } from '@/firebase/getUserById';
import { User } from '@/types';
import {usePathname, useSearchParams} from 'next/navigation'
import { useRouter } from 'next/navigation';
import { isValidUser } from '@/firebase/isValidUser';


interface UserContextType {
  user: User | null;
  updateUser: () => Promise<void>;
  loading: boolean;
}

const initialContext: UserContextType = {
  user: null,
  updateUser: async () => {},
  loading: true,
};

// Create a context with initial values
const UserContext = createContext<UserContextType>(initialContext);

export const useUser = (): UserContextType => useContext(UserContext);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router=useRouter()

  const fetchUser = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        const userData = await getUserById(userId);
        setUser(userData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error('Error getting user document:', error);
    }
  };

  useEffect(() => {
    fetchUser()
 }, [pathname, searchParams])

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser && isValidUser(authUser)) {
        fetchUser();
      } else {
        setUser(null);
        setLoading(false)
        router.push("/login")
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  },[])

  const updateUser = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error('No user is logged in');
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

