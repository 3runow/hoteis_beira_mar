import { createContext, useContext, useState } from 'react'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [pendingBooking, setPendingBooking] = useState(null)

  const createBooking = ({ hotel, room, checkIn, checkOut, guests, userId }) => {
    const nights = Math.max(
      1,
      Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    )
    const booking = {
      id: `BK${Date.now()}`,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelLocation: hotel.location,
      hotelImage: hotel.image,
      roomId: room.id,
      roomName: room.name,
      roomImage: room.image,
      checkIn,
      checkOut,
      nights,
      guests,
      pricePerNight: room.price,
      totalPrice: room.price * nights,
      userId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setPendingBooking(booking)
    return booking
  }

  const confirmBooking = (paymentDetails) => {
    if (!pendingBooking) return null
    const confirmed = { ...pendingBooking, status: 'confirmed', payment: paymentDetails }
    const all = JSON.parse(localStorage.getItem('luxe_bookings') || '[]')
    all.push(confirmed)
    localStorage.setItem('luxe_bookings', JSON.stringify(all))
    setPendingBooking(null)
    return confirmed
  }

  const getUserBookings = (userId) => {
    const all = JSON.parse(localStorage.getItem('luxe_bookings') || '[]')
    return all.filter((b) => b.userId === userId)
  }

  const getAllBookings = () => {
    return JSON.parse(localStorage.getItem('luxe_bookings') || '[]')
  }

  const cancelBooking = (bookingId) => {
    const all = JSON.parse(localStorage.getItem('luxe_bookings') || '[]')
    const updated = all.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    localStorage.setItem('luxe_bookings', JSON.stringify(updated))
  }

  return (
    <BookingContext.Provider
      value={{ pendingBooking, createBooking, confirmBooking, getUserBookings, getAllBookings, cancelBooking }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = () => useContext(BookingContext)
