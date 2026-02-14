// context/RoleContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null); // null until loaded

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data?.role) setRole(data.role);
      } catch (err) {
        console.log('Error fetching role:', err.message);
      }
    };

    fetchRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};