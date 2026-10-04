"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Plus, Trash2, Edit, Copy, Calendar, TicketPercent } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { useToast } from "@/components/ui/Toaster"

interface Discount {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minOrder: number
  usageLimit: number
  usedCount: number
  startsAt: string
  expiresAt: string
  isActive: boolean
  createdAt: string
}

export default function DiscountsPage() {
  const { toast } = useToast()
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Discount | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    value: "",
    minOrder: "0",
    usageLimit: "",
    expiresAt: "",
    isActive: true,
  })

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/discounts", { credentials: "include" })
      if (res.ok) {
        const data = await res.json()
        setDiscounts(data.discounts || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editing ? `/api/admin/discounts/${editing.id}` : "/api/admin/discounts"
      const method = editing ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          minOrder: parseInt(formData.minOrder) * 100,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
          expiresAt: formData.expiresAt || null,
        }),
      })
      if (!res.ok) throw new Error("Error saving discount")
      toast({ type: "success", title: editing ? "Updated" : "Created" })
      setShowForm(false)
      setEditing(null)
      setFormData({ code: "", type: "percentage", value: "", minOrder: "0", usageLimit: "", expiresAt: "", isActive: true })
      fetchDiscounts()
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = (discount: Discount) => {
    setEditing(discount)
    setFormData({
      code: discount.code,
      type: discount.type,
      value: String(discount.value / 100),
      minOrder: String(discount.minOrder / 100),
      usageLimit: String(discount.usageLimit || ""),
      expiresAt: discount.expiresAt ? discount.expiresAt.split("T")[0] : "",
      isActive: discount.isActive,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this discount?")) return
    try {
      const res = await fetch(`/api/admin/discounts/${id}`, { method: "DELETE", credentials: "include" })
      if (res.ok) {
        toast({ type: "success", title: "Deleted" })
        fetchDiscounts()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({ type: "success", title: "Code copied!" })
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({ code: "", type: "percentage", value: "", minOrder: "0", usageLimit: "", expiresAt: "", isActive: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discount Codes</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage discount codes for checkout</p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" /> New Discount
        </Button>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TicketPercent className="h-5 w-5" />
            Discount Codes ({discounts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {discounts.length === 0 ? (
            <div className="p-8 text-center">
              <TicketPercent className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No discount codes yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first discount code for checkout</p>
              <Button onClick={() => setShowForm(true)} variant="primary" className="gap-2">
                <Plus className="h-4 w-4" /> Create First Discount
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                    <th className="p-4">Code</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Value</th>
                    <th className="p-4 text-right">Min Order</th>
                    <th className="p-4 text-center">Usage</th>
                    <th className="p-4 text-center">Expires</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {discounts.map(discount => (
                    <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{discount.code}</code>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(discount.code)} className="p-1 h-auto">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant={discount.type === "percentage" ? "default" : "secondary"}>
                          {discount.type === "percentage" ? "%" : "€"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right font-medium text-gray-900 dark:text-white">
                        {discount.type === "percentage" ? `${discount.value / 100}%` : formatPrice(discount.value)}
                      </td>
                      <td className="p-4 text-right text-gray-600 dark:text-gray-400">
                        {discount.minOrder > 0 ? formatPrice(discount.minOrder) : "No minimum"}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`font-medium ${discount.usedCount >= discount.usageLimit && discount.usageLimit > 0 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                          {discount.usedCount} / {discount.usageLimit || "∞"}
                        </span>
                      </td>
                      <td className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {discount.expiresAt ? new Date(discount.expiresAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={discount.isActive ? "success" : "secondary"}>
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(discount)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleCopy(discount.code)} title="Copy Code">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(discount.id)} className="text-red-600 hover:text-red-700" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0 shadow-none">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{editing ? "Edit Discount" : "New Discount Code"}</CardTitle>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Code *"
                      value={formData.code}
                      onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="SAVE20"
                      required
                    />
                    <select
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (€)</option>
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label={formData.type === "percentage" ? "Percentage (%) *" : "Amount (€) *"}
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={e => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.type === "percentage" ? "20" : "10.00"}
                      required
                    />
                    <Input
                      label="Min Order (€)"
                      type="number"
                      step="0.01"
                      value={formData.minOrder}
                      onChange={e => setFormData({ ...formData, minOrder: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Usage Limit"
                      type="number"
                      value={formData.usageLimit}
                      onChange={e => setFormData({ ...formData, usageLimit: e.target.value })}
                      placeholder="Unlimited"
                    />
                    <Input
                      label="Expires At"
                      type="date"
                      value={formData.expiresAt}
                      onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
                  </label>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="outline" onClick={cancelForm}>Cancel</Button>
                    <Button type="submit" onClick={(e) => { e.preventDefault(); handleSubmit(e as any) }} variant="primary">
                      {editing ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
  )
}

