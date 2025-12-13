import axios from "../api";

export const getAllPaymentHistory = () => axios.get("payment/all-history")

