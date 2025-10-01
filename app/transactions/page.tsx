"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, User, Building2, Hash } from "lucide-react"

// Transaction type definition
interface Transaction {
  id: number
  asset_id: number
  asset_name?: string
  buyer: string
  quantity: number
  timestamp: string
  total_price?: number
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch transactions from backend API
  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions")
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Format timestamp to readable date
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <span className="font-sans text-xl font-bold text-accent-foreground">R</span>
            </div>
            <span className="font-sans text-xl font-bold">Ryzer</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <Button variant="ghost">Assets</Button>
            </Link>
            <Link href="/transactions">
              <Button variant="default">Transactions</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 font-sans text-4xl font-bold">Transaction History</h1>
          <p className="text-lg text-muted-foreground">View all completed asset purchases on the platform</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex animate-pulse items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-1/3 rounded bg-muted" />
                      <div className="h-3 w-1/2 rounded bg-muted" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : transactions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Building2 className="mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 font-sans text-xl font-bold">No transactions yet</h3>
              <p className="mb-6 text-muted-foreground">
                Start trading tokenized assets to see your transaction history
              </p>
              <Link href="/assets">
                <Button>Browse Assets</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2 flex items-center gap-2 font-sans text-xl">
                        <Building2 className="h-5 w-5 text-accent" />
                        {transaction.asset_name || `Asset #${transaction.asset_id}`}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Buyer: {transaction.buyer}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(transaction.timestamp)}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="mb-2 gap-1">
                        <Hash className="h-3 w-3" />
                        {transaction.quantity} tokens
                      </Badge>
                      {transaction.total_price && (
                        <div className="font-sans text-2xl font-bold">${transaction.total_price.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
