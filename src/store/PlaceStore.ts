import {create} from 'zustand';
import { persist } from 'zustand/middleware';

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
  
  // export const usePlaceStore = create<PlaceStoreState>((set) => ({
  //   places: [],
  //   sid: '',
  //   setPlaces: (places) => set({ places }),
  //   setSid: (sid: string) => set({sid}),
  //   removeIds: (ids: number[]) =>
  //       set((state) => ({
  //           places: state.places.filter((p)=> !ids.includes(p.id))
  //       }))
  // }));

  export const usePlaceStore = create<PlaceStoreState, [['zustand/persist', PlaceStoreState]]>(
    persist(
      (set) => ({
        places: [],
        sid: '',
        setPlaces: (places) => set({ places }),
        setSid: (sid: string) => set({ sid }),
        removeIds: (ids: number[]) =>
          set((state) => ({
            places: state.places.filter((p) => !ids.includes(p.id)),
          })),
      }),
      {
        name: 'place-store', // localStorage key
        // 추가 옵션을 통해 상태 직렬화/역직렬화 방식을 설정할 수 있습니다.
      }
    )
  );