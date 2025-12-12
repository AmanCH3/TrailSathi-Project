import { toast } from "react-toastify";
import { loginUserService } from "../services/authService";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useAuth } from '@app/providers/AuthProvider';
 const useLoginUser = () => {
    const { login } = useAuth();

    return useMutation(
        {
            mutationFn: loginUserService,
            mutationKey: ['login-key'],
            onSuccess: (data) => { 
                login(data?.user, data?.token)
                toast.success(data?.message || "Login Success")
            },
            onError: (err) => {
                toast.error(err?.message || "Login Failed")
            }
        }
    )
}



export default useLoginUser ;