import {create} from 'zustand';

export interface Place {
    id: number;
    name: string;
    category: string;
    basicAddress: string;
    description: string;
    latitude: string;
    longitude: string;
    imageUrl: string;
    url: string;
    used: boolean;
    sid: string;
  }

  interface PlaceStoreState {
    places: Place[];
    sid: string;
    setPlaces: (places: Place[]) => void;
    setSid: (sid: string) => void;
    removeIds: (ids:number[]) => void;
  }
  
  export const usePlaceStore = create<PlaceStoreState>((set) => ({
    places: [],
    sid: '',
    setPlaces: (places) => set({ places }),
    setSid: (sid: string) => set({sid}),
    removeIds: (ids: number[]) =>
        set((state) => ({
            places: state.places.filter((p)=> !ids.includes(p.id))
        }))
  }));