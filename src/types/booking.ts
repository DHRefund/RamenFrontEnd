// src/types/booking.ts

// Trạng thái đặt chỗ
export type ReservationStatus = "BOOKED" | "CANCELLED" | "COMPLETED";

// Thông tin một khung giờ (Time Slot)
export interface TimeSlot {
  id: string;
  time: string; // Ví dụ: "18:00"
  maxCapacity: number; // Số ghế tối đa
  bookedCount: number; // Số ghế đã đặt
  available: boolean; // Còn chỗ hay không (derived field)
}

// Thông tin một ngày để đặt chỗ
export interface DailySchedule {
  date: string; // ISO Date string: "2024-10-25"
  slots: TimeSlot[];
}

// Request khi khách đặt chỗ
export interface BookingRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  timeSlotId: string;
  numberOfGuests: number;
}

// Response khi đặt chỗ thành công
export interface BookingResponse {
  bookingId: string;
  status: ReservationStatus;
  createdAt: string;
  message?: string;
}

// Response lấy danh sách đặt chỗ (Dành cho Admin)
export interface BookingDetail extends BookingRequest {
  id: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
}
export interface BookingSearchResult {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  numberOfGuests: number;
  status: ReservationStatus;
  createdAt: string;
}
export interface BookingSearchRequest {
  phone: string;
}
export interface CancelBookingRequest {
  bookingId: string;
  customerPhone: string;
  cancelReason?: string;
}
export interface CancelBookingResponse {
  bookingId: string;
  status: string;
  message: string;
  cancelledAt: string;
  refundEligible: boolean;
}
export interface BookingDetailResponse {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  bookingDate: string;
  timeSlot: string;
  numberOfGuests: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
}
