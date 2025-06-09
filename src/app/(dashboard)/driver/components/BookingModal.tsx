'use client'

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Parking } from '@prisma/client';
import { MapPin, Clock, DollarSign, Calendar, Loader2, CheckCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  userId: string;
  parking: Parking & { pricePerHour: number; address: string } | null;
  onClose: () => void;
  onConfirm: (userId: string, start: string, end: string) => Promise<void>;
}

export default function BookingModal({
  isOpen,
  userId,
  parking,
  onClose,
  onConfirm
}: BookingModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && parking) {
      const now = new Date();
      const start = new Date(now.getTime() + 5 * 60 * 1000);
      const end = new Date(now.getTime() + 65 * 60 * 1000);
      setStartTime(start.toISOString().slice(0, 16));
      setEndTime(end.toISOString().slice(0, 16));
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen, parking]);

  useEffect(() => {
    if (!parking || !startTime || !endTime) return;

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      setError('End time must be after start time');
      setTotalHours(0);
      setTotalPrice(0);
      return;
    }

    if (start < new Date()) {
      setError('Start time cannot be in the past');
      setTotalHours(0);
      setTotalPrice(0);
      return;
    }

    setError('');
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    if (hours > 0) {
      setTotalHours(hours);
      setTotalPrice(hours * parking.pricePerHour);
    }
  }, [startTime, endTime, parking]);

  const handleConfirm = async () => {
    if (isSubmitting || !startTime || !endTime || totalHours <= 0) return;
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    try {
      await onConfirm(userId, startTime, endTime);
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) onClose();
      }}
    >
      <DialogContent className="max-w-lg overflow-y-auto max-h-[100vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book Parking Space
          </DialogTitle>
        </DialogHeader>

        {parking ? (
          <div className="space-y-6">
            {/* Parking Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {parking.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{parking.address}</span>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${parking.pricePerHour}/hr
                </Badge>
              </div>
            </div>

            {/* Time Selection */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Select Booking Time
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              {totalHours > 0 && !error && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h5 className="font-medium mb-3 text-gray-900 dark:text-white">
                    Booking Summary
                  </h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">From:</span>
                      <span className="font-medium">{formatDateTime(startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">To:</span>
                      <span className="font-medium">{formatDateTime(endTime)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">
                        {totalHours} hour{totalHours !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                      <span className="font-medium">${parking.pricePerHour}/hour</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Total:
                      </span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <p className="text-red-700 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleConfirm}
                disabled={isSubmitting || totalHours <= 0 || !!error}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              No parking space selected.
            </p>
          </div>
        )}

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
