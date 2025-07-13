"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import type { Member } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

interface MemberFormProps {
  member?: Member | null
  onClose: () => void
  onSave: () => void
}

export function MemberForm({ member, onClose, onSave }: MemberFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    membershipId: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name,
        membershipId: member.membershipId,
        email: member.email,
        phone: member.phone,
      })
    } else {
      // Generate membership ID for new members
      setFormData((prev) => ({
        ...prev,
        membershipId: `MEM${Date.now().toString().slice(-6)}`,
      }))
    }
  }, [member])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (member) {
        await api.updateMember(member.id, formData)
        toast({
          title: "Success",
          description: "Member updated successfully",
        })
      } else {
        await api.createMember(formData)
        toast({
          title: "Success",
          description: "Member created successfully",
        })
      }
      onSave()
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${member ? "update" : "create"} member`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{member ? "Edit Member" : "Add New Member"}</CardTitle>
              <CardDescription>{member ? "Update member information" : "Enter member details"}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipId">Membership ID</Label>
              <Input
                id="membershipId"
                name="membershipId"
                value={formData.membershipId}
                onChange={handleChange}
                required
                placeholder="Enter membership ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Saving..." : member ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
