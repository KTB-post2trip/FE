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

            const markers = places
              .map((item) => {
                const { latitude, longitude, url, name } = item.place;
                const { days } = item;

                if (!latitude || !longitude || !url) return null;

                const markerPosition = new window.kakao.maps.LatLng(
                  parseFloat(latitude),
                  parseFloat(longitude)
                );

                bounds.extend(markerPosition);

                const markerImage = new window.kakao.maps.MarkerImage(
                  `/public/day${days}-pin.svg`,
                  new window.kakao.maps.Size(40, 40),
                  { offset: new window.kakao.maps.Point(20, 40) }
                );

                const marker = new window.kakao.maps.Marker({
                  position: markerPosition,
                  image: markerImage,
                  map,
                });

                // 마커 위에 장소명 표시 (CustomOverlay)
                const overlayContent = document.createElement("div");
                overlayContent.innerHTML = `<div style="
                  background-color: white; 
                  color:black;
                  padding: 2px 8px; 
                  border-radius: 4px;
                  font-size: 12px; 
                  font-weight: bold;
                  text-align: center;
                  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
                  margin-bottom: 22px;
                ">${name}</div>`;

                const overlay = new window.kakao.maps.CustomOverlay({
                  content: overlayContent,
                  position: markerPosition,
                  yAnchor: 1.5,
                  zIndex: 3,
                });

                overlay.setMap(map);

                // 마커 클릭 시 URL로 이동
                window.kakao.maps.event.addListener(marker, "click", () => {
                  window.open(url, "_blank");
                });

                return marker;
              })
              .filter((marker) => marker !== null);

            if (markers.length > 0) {
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
