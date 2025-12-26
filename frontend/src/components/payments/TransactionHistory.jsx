import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
 // <-- Adjust this path to your AuthContext file

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, FileDown } from "lucide-react";
import { useAuth } from '@/app/providers/AuthProvider';

// Helper function to render status badges
const getStatusBadge = (status) => {
  switch (status.toLowerCase()) {
    case "success":
    case "completed":
      return <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Completed</span>;
    case "failure":
      return <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Failed</span>;
    case "pending":
      return <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">Pending</span>;
    default:
      return <span className="bg-gray-300 text-black text-xs px-2 py-1 rounded-full font-semibold">{status}</span>;
  }
};


export function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for View Details Modal
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // State for Delete Confirmation
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchHistory();
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token'); 
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/payment/history`, 
        { headers: { 'Authorization': `Bearer ${token}` } }
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

  // Handle search filtering
  useEffect(() => {
    const results = transactions.filter(tx =>
      (tx.transaction_uuid && tx.transaction_uuid.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.plan && tx.plan.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);


  // --- HANDLERS ---

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    const token = localStorage.getItem('token');
    
    try {
       await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/payment/${transactionToDelete.transaction_uuid}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      
      // Update usage state
      const updatedList = transactions.filter(t => t.transaction_uuid !== transactionToDelete.transaction_uuid);
      setTransactions(updatedList);
      setFilteredTransactions(updatedList.filter(tx =>
        (tx.transaction_uuid && tx.transaction_uuid.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tx.plan && tx.plan.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
      
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete transaction. Please try again.");
    } finally {
      setIsDeleteAlertOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleDownloadPDF = (transaction) => {
    try {
      const doc = new jsPDF();

      // --- INVOICE HEADER ---
      // Company Logo/Name
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Trail Sathi", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Connect with Nature", 14, 25);
      doc.text("Kathmandu, Nepal", 14, 29);
      doc.text("support@trailsathi.com", 14, 33);

      // Invoice Label
      doc.setFontSize(30);
      doc.setTextColor(200, 200, 200);
      doc.text("INVOICE", 140, 30);

      // --- INVOICE DETAILS ---
      const startY = 50;
      
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      
      // Billing Info
      doc.text("BILL TO:", 14, startY);
      doc.setFont("helvetica", "bold");
      doc.text("Valued Customer", 14, startY + 5); 
      doc.setFont("helvetica", "normal");
      doc.text(`User ID: ${transaction.userId}`, 14, startY + 10);

      // Invoice Meta
      doc.text("Invoice No:", 140, startY);
      doc.text(transaction.transaction_uuid.substring(0, 8).toUpperCase(), 170, startY);
      
      doc.text("Date:", 140, startY + 5);
      doc.text(new Date(transaction.createdAt).toLocaleDateString(), 170, startY + 5);
      
      doc.text("Status:", 140, startY + 10);
      const statusColor = transaction.status === 'success' ? [0, 128, 0] : [255, 0, 0];
      doc.setTextColor(...statusColor);
      doc.text(transaction.status.toUpperCase(), 170, startY + 10);
      doc.setTextColor(40, 40, 40); // Reset

      // --- LINE ITEMS ---
      const tableColumn = ["Item Description", "Qty", "Rate", "Amount"];
      const tableRows = [
        [
          `${transaction.plan} Membership Plan`,
          "1",
          `Rs ${transaction.amount}`,
          `Rs ${transaction.amount}`
        ]
      ];

      // AutoTable for Line Items
      autoTable(doc, {
        startY: startY + 20,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 90 }, // Description
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 40, halign: 'right' }, // Rate
            3: { cellWidth: 40, halign: 'right' } // Amount
        }
      });

      // --- TOTALS ---
      const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 120;
      
      doc.setFont("helvetica", "bold");
      doc.text("Total:", 140, finalY + 15);
      doc.setFontSize(12);
      doc.text(`Rs ${transaction.amount}`, 170, finalY + 15);
      
      // Footer
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Thank you for choosing Trail Sathi!", 105, 280, { align: "center" });

      doc.save(`Invoice_${transaction.transaction_uuid}.pdf`);
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Failed to generate PDF. Please try again.");
    }
  };


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
    <>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.transaction_uuid}>
                    <TableCell className="font-medium text-xs">{transaction.transaction_uuid}</TableCell>
                    <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{transaction.plan} Plan</TableCell>
                    <TableCell>रु {transaction.amount}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" onClick={() => handleViewDetails(transaction)} title="View Details">
                            <Eye className="h-4 w-4 text-blue-500" />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleDownloadPDF(transaction)} title="Download Receipt">
                            <FileDown className="h-4 w-4 text-green-600" />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(transaction)} title="Delete Transaction">
                            <Trash2 className="h-4 w-4 text-red-500" />
                         </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    You have no transactions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>

    {/* Transaction Details Modal */}
    <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Detailed information about your transaction.
          </DialogDescription>
        </DialogHeader>
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="font-semibold">Transaction ID:</span>
                <span className="break-all">{selectedTransaction.transaction_uuid}</span>
                
                <span className="font-semibold">Plan:</span>
                <span>{selectedTransaction.plan}</span>
                
                <span className="font-semibold">Amount:</span>
                <span>Rs {selectedTransaction.amount}</span>
                 
                <span className="font-semibold">Status:</span>
                <span>{selectedTransaction.status}</span>

                <span className="font-semibold">Date:</span>
                <span>{new Date(selectedTransaction.createdAt).toLocaleString()}</span>
                
                <span className="font-semibold">User ID:</span>
                <span className="break-all">{selectedTransaction.userId}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>

    {/* Delete Confirmation Alert */}
    <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the transaction record from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    </>
  );
}