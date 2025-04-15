'use client';

import { auth } from '@/firebase/client';
import { clearSessionCookie } from '@/lib/actions/auth.action';
// adjust path as needed
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';



export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearSessionCookie()
            router.push('/sign-in'); // Redirect after logout
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return <button onClick={handleLogout} className='rounded-full px-3 hover:bg-red-600 cursor-pointer'>Logout</button>;
} 