"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { DollarSign, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  created_at: string;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({ title: "", amount: "" });

  // Mock data for initial development
  const mockTransactions = [
    { id: "1", title: "Design tools subscription", amount: 120, created_at: "2024-03-15" },
    { id: "2", title: "Cloud hosting", amount: 250, created_at: "2024-03-10" },
    { id: "3", title: "Team training", amount: 500, created_at: "2024-03-05" }
  ];

  useState(() => {
    // TODO: Replace with actual API call
    setTransactions(mockTransactions);
  });

  const totalBudget = 10000;
  const totalSpent = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const remainingBudget = totalBudget - totalSpent;

  const handleAddTransaction = async () => {
    if (!newTransaction.title || !newTransaction.amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const amount = parseFloat(newTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      // TODO: Replace with actual API call
      const newTransactionData = {
        id: Date.now().toString(),
        title: newTransaction.title,
        amount: amount,
        created_at: new Date().toISOString()
      };

      setTransactions([newTransactionData, ...transactions]);
      setNewTransaction({ title: "", amount: "" });
      setIsAddDialogOpen(false);
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Failed to add transaction");
    }
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      // TODO: Replace with actual API call
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Project Finance</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Budget</CardTitle>
            <CardDescription>Project's total allocated budget</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalBudget.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
            <CardDescription>Amount spent so far</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSpent.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Remaining Budget</CardTitle>
            <CardDescription>Available funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${remainingBudget.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>List of all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                <div>
                  <div className="font-medium">{transaction.title}</div>
                  <div className="text-sm text-muted-foreground">{new Date(transaction.created_at).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-semibold">${transaction.amount.toLocaleString()}</div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedTransaction(transaction);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newTransaction.title}
                onChange={(e) => setNewTransaction({ ...newTransaction, title: e.target.value })}
                placeholder="Enter transaction title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTransaction}>Add Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the transaction.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTransaction} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
