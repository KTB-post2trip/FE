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
  setPlaces: (places: Place[]) => void;
}

export const useRecommendStore = create<RecommendStoreState>((set) => ({
  places: [],
  setPlaces: (places) => set({ places }),
}));
