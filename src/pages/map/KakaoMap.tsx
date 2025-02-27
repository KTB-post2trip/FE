/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer } from "./KakaoMap.style";
import Sidebar from "./SideBar";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  id: number;
  sid: number;
  name: string;
  category: string;
  basicAddress: string;
  description: string;
  latitude: string;
  longitude: string;
  url: string;
  imageUrl: string;
  used: boolean;
}

interface Recommendation {
  id: number;
  days: number;
  sort: number;
  place: Place;
}

function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get<Recommendation[]>("/api/recommend");
        const places = response.data;

        console.log("API 응답 데이터:", places);

        if (window.kakao && window.kakao.maps) {
          if (mapRef.current) {
            const map = new window.kakao.maps.Map(mapRef.current, {
              center: new window.kakao.maps.LatLng(37.5665, 126.978),
              level: 3,
            });

            const bounds = new window.kakao.maps.LatLngBounds();

            places.forEach((item) => {
              const { latitude, longitude, sid } = item.place;
              const { days } = item;

              if (latitude && longitude) {
                // days 값에 따라 마커 이미지 동적 설정
                const markerImageSrc = `/public/day${days}-pin.svg`;

                const markerImage = new window.kakao.maps.MarkerImage(
                  markerImageSrc,
                  new window.kakao.maps.Size(40, 40),
                  { offset: new window.kakao.maps.Point(20, 40) }
                );

                const markerPosition = new window.kakao.maps.LatLng(
                  parseFloat(latitude),
                  parseFloat(longitude)
                );

                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
                  map,
                });

                window.kakao.maps.event.addListener(marker, "click", () => {
                  window.open(
                    `https://map.kakao.com/link/map/${sid}`,
                    "_blank"
                  );
                });

                bounds.extend(markerPosition);
              }
            });

            if (places.length > 0) {
              map.setBounds(bounds);
            }
          }
        }
      } catch (error) {
        console.error("API 요청 실패 ❌", error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <>
      <MapContainer ref={mapRef} />
      <Sidebar />
    </>
  );
}

export default KakaoMap;
