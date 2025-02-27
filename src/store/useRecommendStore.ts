import { create } from "zustand";

interface Place {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  days: number;
}

interface RecommendStoreState {
  places: Place[];
  days: number;
  setPlaces: (places: Place[]) => void;
  setDays: (days: number) => void;
}

export const useRecommendStore = create<RecommendStoreState>((set) => ({
  places: [],
  setPlaces: (places) => set({ places }),
  days: 1,
  setDays: (days) => set({ days }),
}));
