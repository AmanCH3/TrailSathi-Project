import axios from "axios";
import { getAllPaymentHistory } from "../../api/admin/paymentApi";

export const getAllPaymentHistoryService = async (params = {}) => {

    try {
        const response = await getAllPaymentHistory(params)
        return response.data
    }
    catch (err){
        throw err.response?.data || {message : "Failed to fetch payments"}
    }
}