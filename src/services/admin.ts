export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: "ADMIN" | "STAFF" | "MANAGER";
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
  username: string;
  fullName: string;
  role: string;
  expiresIn: number;
}
export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  completedBookings: number;
  todayRevenue?: number;
}
export interface AdminBookingDetail {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  timeSlot: string;
  numberOfGuests: number;
  status: "BOOKED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
}
