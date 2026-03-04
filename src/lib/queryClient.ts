// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Dữ liệu mới trong 5 phút
      retry: 1, // Thử lại 1 lần nếu lỗi
      refetchOnWindowFocus: false, // Không tự refetch khi click lại tab
    },
  },
});
