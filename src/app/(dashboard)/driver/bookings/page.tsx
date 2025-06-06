export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <p className="text-muted-foreground">
          Manage all your parking space bookings.
        </p>
      </div>
      
      {/* Bookings content */}
      <div className="rounded-lg border p-4">
        <p>You currently do not have any bookings</p>
      </div>
    </div>
  )
}
