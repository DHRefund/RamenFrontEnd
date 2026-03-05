// src/services/bookingService.ts
import { apiClient } from "@/lib/axios";
import type { DailySchedule, BookingRequest, BookingResponse, BookingDetail } from "@/types/booking";
import type {
  BookingDetailResponse,
  BookingSearchResult,
  CancelBookingRequest,
  CancelBookingResponse,
} from "../types/booking";

export const bookingService = {
  // Lấy lịch đặt chỗ theo ngày
  getSchedule: async (date: string): Promise<DailySchedule> => {
    const { data } = await apiClient.get(`/schedule?date=${date}`);
    return data;
  },

  // Đặt chỗ mới
  createBooking: async (payload: BookingRequest): Promise<BookingResponse> => {
    const { data } = await apiClient.post("/reservations", payload);
    return data;
  },

  // Lấy danh sách đặt chỗ (Admin)
  getAllReservations: async (): Promise<BookingDetail[]> => {
    const { data } = await apiClient.get("/admin/reservations");
    return data;
  },
  // Lấy danh sách đặt chỗ (Admin)
  getAllReservationsByDate: async (date: string): Promise<BookingDetail[]> => {
    const url = `/admin/reservations/${date}`;
    const { data } = await apiClient.get(url);
    return data;
  },

  // Hủy đặt chỗ (Admin)
  cancelReservation: async (id: string): Promise<void> => {
    await apiClient.patch(`/admin/reservations/${id}/cancel`);
  },

  searchByPhone: async (phone: string): Promise<BookingSearchResult[]> => {
    const { data } = await apiClient.get(`/reservations/search?phone=${phone}`);
    //console.log("Search results:", data);
    return data;
  },
  getBookingById: async (id: string): Promise<BookingSearchResult> => {
    const { data } = await apiClient.get(`/reservations/${id}`);
    return data;
  },
  cancelBooking: async (payload: CancelBookingRequest): Promise<CancelBookingResponse> => {
    const { data } = await apiClient.post("/reservations/cancel", payload);
    return data;
  },
};
