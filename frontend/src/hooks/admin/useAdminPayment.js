import { useMutation , useQuery , useQueryClient } from "@tanstack/react-query";
import { getAllPaymentHistoryService } from "../../services/admin/paymentService";
import {toast} from 'react-toastify'

export const useAdminGetPayment = () => {
    const query = useQuery (
        {
            queryKey : ['admin_payment'] ,
            queryFn : () => getAllPaymentHistoryService()
        }
    )

    const payments = query.data?.data || []
    return {
        ...query , 
        payments
    }
}