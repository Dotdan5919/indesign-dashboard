"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Edit, MoreHorizontal, Trash2, Eye, Store } from "lucide-react"

interface Shop {
  id: string
  name: string
  description: string
  domain: string
  status: "active" | "inactive" | "maintenance"
  owner: string
  createdAt: string
  updatedAt: string
  productsCount: number
  revenue: number
}

const mockShops: Shop[] = [
  {
    id: "1",
    name: "Tech Gadgets Store",
    description: "Premium electronics and gadgets",
    domain: "techgadgets.com",
    status: "active",
    owner: "John Smith",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    productsCount: 150,
    revenue: 25000
  },
  {
    id: "2",
    name: "Fashion Boutique",
    description: "Trendy fashion and accessories",
    domain: "fashionboutique.com",
    status: "active",
    owner: "Sarah Johnson",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-18",
    productsCount: 89,
    revenue: 18000
  },
  {
    id: "3",
    name: "Home & Garden",
    description: "Everything for your home and garden",
    domain: "homegarden.com",
    status: "maintenance",
    owner: "Mike Wilson",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    productsCount: 234,
    revenue: 32000
  }
]

export function ShopsTable() {
  const [shops, setShops] = useState<Shop[]>(mockShops)
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setShops(shops.filter(shop => shop.id !== id))
  }

  const handleSave = (updatedShop: Shop) => {
    setShops(shops.map(shop => 
      shop.id === updatedShop.id ? updatedShop : shop
    ))
    setIsEditDialogOpen(false)
    setEditingShop(null)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      maintenance: "bg-yellow-100 text-yellow-800"
    }
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop Name</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    {shop.name}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{shop.domain}</TableCell>
                <TableCell>{getStatusBadge(shop.status)}</TableCell>
                <TableCell>{shop.productsCount}</TableCell>
                <TableCell className="font-medium">{formatCurrency(shop.revenue)}</TableCell>
                <TableCell>{shop.owner}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Shop
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(shop)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(shop.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Shop</DialogTitle>
            <DialogDescription>
              Make changes to your shop here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          {editingShop && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Shop Name</Label>
                <Input
                  id="name"
                  value={editingShop.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingShop({
                    ...editingShop,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={editingShop.domain}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingShop({
                    ...editingShop,
                    domain: e.target.value
                  })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingShop.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditingShop({
                    ...editingShop,
                    description: e.target.value
                  })}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingShop.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditingShop({
                    ...editingShop,
                    status: e.target.value as "active" | "inactive" | "maintenance"
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => editingShop && handleSave(editingShop)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 