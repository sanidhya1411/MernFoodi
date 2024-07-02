import React from 'react';
import useAuth from './useAuth';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useAdmin = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { refetch, data: isAdmin, isLoading: isAdminLoading } = useQuery(
        {
            queryKey: [user?.email, 'isAdmin'],
            queryFn: async () => {
                if (!user?.email) {
                    return false; // Return a default value if email is undefined
                }
                const res = await axiosSecure.get(`users/admin/${user.email}`);
                return res.data?.admin;
            },
            enabled: !!user?.email, // Only run the query if user.email is defined
        }
    );

    return [isAdmin, isAdminLoading];
};

export default useAdmin;