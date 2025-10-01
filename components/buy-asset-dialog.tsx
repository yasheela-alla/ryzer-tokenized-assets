"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Hash, DollarSign } from "lucide-react"

interface Asset {
  id: number
  name: string
  price: number
  supply: number
}

interface BuyAssetDialogProps {
  asset: Asset
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BuyAssetDialog({ asset, open, onClose, onSuccess }: BuyAssetDialogProps) {
  const [buyerName, setBuyerName] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Calculate total price based on quantity
  const totalPrice = asset.price * quantity

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!buyerName.trim()) {
      setError("Please enter your name")
      return
    }

    if (quantity < 1 || quantity > asset.supply) {
      setError(`Quantity must be between 1 and ${asset.supply}`)
      return
    }

    setLoading(true)

    try {
      // Send purchase request to backend
      const response = await fetch("/api/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assetId: asset.id,
          quantity,
          buyerName: buyerName.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Purchase failed")
      }

      // Success! Reset form and notify parent
      setBuyerName("")
      setQuantity(1)
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-sans text-2xl">
            <Building2 className="h-6 w-6 text-accent" />
            Purchase Tokens
          </DialogTitle>
          <DialogDescription>Buy fractional ownership tokens for {asset.name}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Asset Info */}
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Asset</span>
                <Badge variant="secondary">{asset.supply} available</Badge>
              </div>
              <div className="font-sans text-xl font-bold">{asset.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">${asset.price.toLocaleString()} per token</div>
            </div>

            {/* Buyer Name Input */}
            <div className="space-y-2">
              <Label htmlFor="buyerName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name
              </Label>
              <Input
                id="buyerName"
                placeholder="Enter your full name"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="quantity" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={asset.supply}
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Maximum: {asset.supply} tokens available</p>
            </div>

            {/* Total Price Display */}
            <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="h-4 w-4" />
                  Total Price
                </span>
                <span className="font-sans text-2xl font-bold">${totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Confirm Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
