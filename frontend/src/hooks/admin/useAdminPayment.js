import { useMutation , useQuery , useQueryClient } from "@tanstack/react-query";
import { getAllPaymentHistoryService } from "../../services/admin/paymentService";
import {toast} from 'react-toastify'

export const useAdminGetPayment = (params = {}) => {
    const { page = 1, limit = 10, search = '', status = 'all' } = params;
    
    const query = useQuery (
        {
            queryKey : ['admin_payment', page, limit, search, status] ,
            queryFn : () => getAllPaymentHistoryService({ page, limit, search, status }),
            keepPreviousData: true, // Keep previous data while fetching new page
        }
    )

    const payments = query.data?.data || []
    return {
        ...query , 
        payments
    }
}