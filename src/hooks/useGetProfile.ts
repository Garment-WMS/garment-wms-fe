import { toast } from "./use-toast";

export const useGetProfile = ()=>{
    const user = localStorage.getItem('userData');
    if (user === null) {
        window.location.href = '/login';
        toast({
            title: 'Out of Session',
            variant: 'destructive',
            description: 'Please login again'
        })
    }
    return user ? JSON.parse(user) : null;
}