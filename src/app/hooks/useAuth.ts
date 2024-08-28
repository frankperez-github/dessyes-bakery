'use client'
import { getUser } from '@/supabase/supabaseAuth';
import { UserMetadata } from '@supabase/supabase-js';
import { useState } from 'react';

export default function useAuth ()
{
    const [user, setUser] = useState<UserMetadata>()
    
    if(!user)
    {
        getUser().then(
            data=>{
                setUser({...data.data.user?.user_metadata, id: data.data.user?.id})
            }
        )
    }
    
    return user
}