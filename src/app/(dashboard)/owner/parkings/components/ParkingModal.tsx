'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import MapSelectorCard from './MapSelectorCard' 

interface Parking {
  id: string
  title: string
  description: string
  longitude: number
  latitude: number
  address: string
  pricePerHour: number
}

interface ParkingFormData {
  title: string
  description: string
  longitude: number
  latitude: number
  address: string
  pricePerHour: number
}

interface ParkingModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingParking: Parking | null
  formData: ParkingFormData
  setFormData: React.Dispatch<React.SetStateAction<ParkingFormData>>
  handleSubmit: (e: React.FormEvent) => Promise<void> | void
  isLoading: boolean
}

export default function ParkingModal({
  isOpen,
  onOpenChange,
  editingParking,
  formData,
  setFormData,
  handleSubmit,
  isLoading,
}: ParkingModalProps) {
  const titleText = editingParking ? 'Edit Parking' : 'Create New Parking'

  const handleInputChange = (
    field: keyof ParkingFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter parking title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                handleInputChange('description', e.target.value)
              }
              placeholder="Enter parking description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter full address"
              required
            />
          </div>

          <MapSelectorCard 
            setLongitude = {setLongitude}
            setLatitude = {setLatitude}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) =>
                  handleInputChange('latitude', parseFloat(e.target.value))
                }
                placeholder="12.9716"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) =>
                  handleInputChange('longitude', parseFloat(e.target.value))
                }
                placeholder="77.5946"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
            <Input
              id="pricePerHour"
              type="number"
              min="0"
              value={formData.pricePerHour}
              onChange={(e) =>
                handleInputChange('pricePerHour', parseInt(e.target.value))
              }
              placeholder="100"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : editingParking
                ? 'Update Parking'
                : 'Create Parking'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
