import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Parking } from '@prisma/client';

interface BookingModalProps {
  isOpen: boolean;
  userId: string;
  parking: Parking & { pricePerHour: number; address: string } | null;
  onClose: () => void;
  onConfirm: (userId: string, start: string, end: string) => void;
}

export default function BookingModal({ isOpen, userId, parking, onClose, onConfirm }: BookingModalProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (isOpen && parking) {
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      setStartTime(now.toISOString().slice(0, 16));
      setEndTime(oneHourLater.toISOString().slice(0, 16));
    }
  }, [isOpen, parking]);

  useEffect(() => {
    if (!parking || !startTime || !endTime) return;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
    if (hours > 0) {
      setTotalHours(hours);
      setTotalPrice(hours * parking.pricePerHour);
    }
  }, [startTime, endTime, parking]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Parking Space</DialogTitle>
        </DialogHeader>

        {parking ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{parking.title}</h3>
              <p className="text-sm text-muted-foreground">{parking.address}</p>
              <p className="text-sm font-medium text-green-600 mt-1">
                ${parking.pricePerHour}/hour
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span>Duration: {totalHours} hour(s)</span>
                <span className="font-semibold">Total: ${totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={() => onConfirm(userId, startTime, endTime)}
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        ) : (
          <p>No parking selected.</p>
        )}

        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
