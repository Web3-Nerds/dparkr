'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Pencil, MapPin, DollarSign, ParkingCircle, Edit, Trash2 } from 'lucide-react'
import ParkingModal from './components/ParkingModal'
import { useGetAllParkings } from './hooks/getAllParking'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export default function Page() {
  const { parkings, loading, error } = useGetAllParkings()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingParking, setEditingParking] = useState<Parking | null>(null)
  const [formData, setFormData] = useState<ParkingFormData>({
    title: '',
    description: '',
    longitude: 77.5946,
    latitude: 12.9716,
    address: '',
    pricePerHour: 100,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [localParkings, setLocalParkings] = useState<any>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      longitude: 77.5946,
      latitude: 12.9716,
      address: '',
      pricePerHour: 100,
    })
    setEditingParking(null)
  }

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (parking: Parking) => {
    setFormData({
      title: parking.title,
      description: parking.description,
      longitude: parking.longitude,
      latitude: parking.latitude,
      address: parking.address,
      pricePerHour: parking.pricePerHour,
    })
    setEditingParking(parking)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingParking) {
        const response = await fetch(`/api/owner/parking?id=${editingParking.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const updatedParking = await response.json()
          setLocalParkings((prev: any) =>
            prev.map((p: any) => (p.id === updatedParking.id ? updatedParking : p))
          )
        }
      } else {
        const response = await fetch('/api/owner/parking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const newParking = await response.json()
          setLocalParkings((prev: any) => [...prev, newParking])
        }
      }

      setIsModalOpen(false)
      resetForm()
    } catch (fetchError) {
      console.error('Error saving parking:', fetchError)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (parkingId: string) => {
    setDeletingId(parkingId)
    try {
      const response = await fetch(`/api/owner/parking?id=${parkingId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLocalParkings((prev: any) => prev.filter((p: any) => p.id !== parkingId))
      }
    } catch (error) {
      console.error('Error deleting parking:', error)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (parkings) {
      setLocalParkings(parkings)
    }
  }, [parkings])

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const EmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <ParkingCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No parking spaces yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Start earning by listing your first parking space. It's quick and easy to get started.
        </p>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Parking Space
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Parking Spaces</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your listed parking spaces
          </p>
        </div>
        {localParkings.length > 0 && (
          <Button onClick={openCreateModal} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Add New Parking
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      {!loading && localParkings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ParkingCircle className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spaces</p>
                  <p className="text-2xl font-bold">{localParkings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Price/Hour</p>
                  <p className="text-2xl font-bold">
                    ₹{Math.round(localParkings.reduce((sum: number, p: any) => sum + p.pricePerHour, 0) / localParkings.length)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Locations</p>
                  <p className="text-2xl font-bold">
                    {new Set(localParkings.map((p: any) => p.address.split(',').pop()?.trim())).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <ParkingModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        editingParking={editingParking}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isLoading={isSaving}
      />

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Error loading parking spaces: {error.message}
          </AlertDescription>
        </Alert>
      ) : localParkings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localParkings.map((parking: any) => (
            <Card key={parking.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-1">{parking.title}</CardTitle>
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                {parking.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {parking.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {parking.address}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      ₹{parking.pricePerHour}
                    </span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>

                  {/* Coordinates */}
                  <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">
                    📍 {parking.latitude.toFixed(4)}, {parking.longitude.toFixed(4)}
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(parking)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingId === parking.id}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Parking Space</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{parking.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(parking.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
