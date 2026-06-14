import { create } from "zustand";
import { paymentApi } from "@/lib/api";

export type Payment = {
  pay_id: number;
  payment_status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  amount: number;
  booking_id: number;
  pay_time: string;
};

type PaymentState = {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchPayments: () => Promise<void>;
  fetchPaymentById: (id: number) => Promise<void>;
  createPayment: (bookingId: number, amount: number) => Promise<Payment>;
  processPayment: (id: number) => Promise<Payment>;
  cancelPayment: (id: number) => Promise<Payment>;
  fetchPaymentByBooking: (bookingId: number) => Promise<Payment>;
  setCurrentPayment: (payment: Payment | null) => void;
  clearError: () => void;
};

export const usePayment = create<PaymentState>((set) => ({
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,

  async fetchPayments() {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.list();
      set({ payments: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async fetchPaymentById(id) {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.get(id);
      set({ currentPayment: res.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  async createPayment(bookingId, amount) {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.create({ booking_id: bookingId, amount });
      set((state) => ({
        payments: [...state.payments, res.data],
        currentPayment: res.data,
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async processPayment(id) {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.process(id);
      set((state) => ({
        payments: state.payments.map((p) => (p.pay_id === id ? res.data : p)),
        currentPayment: res.data,
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async cancelPayment(id) {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.cancel(id);
      set((state) => ({
        payments: state.payments.map((p) => (p.pay_id === id ? res.data : p)),
        currentPayment: res.data,
        loading: false,
      }));
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  async fetchPaymentByBooking(bookingId) {
    set({ loading: true, error: null });
    try {
      const res = await paymentApi.getByBooking(bookingId);
      set({ currentPayment: res.data, loading: false });
      return res.data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setCurrentPayment(payment) {
    set({ currentPayment: payment });
  },

  clearError() {
    set({ error: null });
  },
}));
