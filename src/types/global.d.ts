export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => kakao.maps.LatLng;
        Map: new (
          container: HTMLElement,
          options: kakao.maps.MapOptions
        ) => kakao.maps.Map;
        Marker: new (options: kakao.maps.MarkerOptions) => kakao.maps.Marker;
      };
    };
  }
}

// 카카오맵 API 인터페이스 정의
declare namespace kakao.maps {
  interface LatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface MapOptions {
    center: LatLng;
    level: number;
  }

  interface Map {
    setCenter: (latlng: LatLng) => void;
    setLevel: (level: number) => void;
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
  }

  interface Marker {
    setMap: (map: Map | null) => void;
  }
}
