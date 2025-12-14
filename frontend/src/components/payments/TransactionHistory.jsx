import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
 // <-- Adjust this path to your AuthContext file

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useAuth } from '@/app/providers/AuthProvider';

// Helper function to render status badges
const getStatusBadge = (status) => {
  // Your backend only returns 'success' for this endpoint, but this is good for future-proofing
  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-semibold">Completed</span>;
    case "failure":
      return <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">Failed</span>;
    case "pending":
      return <span className="bg-yellow-500 text-black text-sm px-3 py-1 rounded-full font-semibold">Pending</span>;
    default:
      return <span className="bg-gray-300 text-black text-sm px-3 py-1 rounded-full font-semibold">{status}</span>;
  }
};


export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Use your AuthContext to check if the user is logged in
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // If the context says the user isn't logged in, we don't need to do anything else.
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      // Get the token from localStorage using the CORRECT key ('token')
      const token = localStorage.getItem('token'); 
      
      try {
        const response = await axios.get(
          // Use Vite's syntax for environment variables
          // The base URL already includes /api, so we just append the endpoint
          `${import.meta.env.VITE_API_BASE_URL}/payment/history`, 
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          setTransactions(response.data.data);
          setFilteredTransactions(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Fetch history error:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
             setError("Your session has expired. Please log in again.");
        } else {
             setError(err.response?.data?.message || "An error occurred while fetching transaction history.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated]); // The effect re-runs if the user logs in or out

  // Handle search filtering
  useEffect(() => {
    const results = transactions.filter(tx =>
      (tx.transaction_uuid && tx.transaction_uuid.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.plan && tx.plan.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-muted-foreground">Loading History...</span>
        </CardContent>
      </Card>
    );
  }

  // If not authenticated, show a login prompt
  if (!isAuthenticated) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-20">
                <p className="mb-4 text-muted-foreground">Please log in to view your transaction history.</p>
                <Button asChild>
                    <Link to="/login">Go to Login Page</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <div className="pt-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID or Plan..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-20 text-red-500 font-medium">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_uuid}>
                    <TableCell className="font-medium">{transaction.transaction_uuid}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.plan} Plan</TableCell>
                    <TableCell>रु {transaction.amount}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    You have no successful transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}