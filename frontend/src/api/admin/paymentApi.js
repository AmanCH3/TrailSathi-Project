import axios from "../api";

export const getAllPaymentHistory = (params = {}) => axios.get("payment/all-history", { params })

