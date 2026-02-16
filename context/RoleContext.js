// context/RoleContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch role ONCE when app starts
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (!user) {
          setRole(null);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setRole(data?.role ?? 'receiver');
      } catch (err) {
        console.log('Role fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, []);

  // Safe role switcher (ONLY way to change role)
  const switchRole = async (newRole) => {
    try {
      setRole(newRole);

      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', user.id);
    } catch (err) {
      console.log('Switch role error:', err.message);
    }
  };

  return (
    <RoleContext.Provider value={{ role, loading, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
};