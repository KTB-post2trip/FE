/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import axios from "axios";
import { MapContainer } from "./KakaoMap.style";
import Sidebar from "./SideBar";

import { useRecommendStore } from "../../store/useRecommendStore";
import { usePlaceStore } from "../../store/PlaceStore";

declare global {
  interface Window {
    kakao: any;
  }
}

interface Place {
  place_name: string;
  basicAddress: string;
  description: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  url: string;
  used: boolean;
}


// interface Recommendation {
//   days: number;
//   sort: number;
//   place: Place;
// }

interface Recommendation {
  days: number;
  sort: number;
  place: {
    place_name: string;
    description: string;
    latitude: string;
    longitude: string;
    imageUrl: string;
    url: string;
    used: boolean;
    // 기타 필요한 필드들
  };
}

interface RecommendResponse {
  recommend_places: Recommendation[];
}

function KakaoMap() {
  const mapRef = useRef<HTMLDivElement>(null);

  const { places, setPlaces, days } = useRecommendStore();
  const {sid} = usePlaceStore();

  const mapInstanceRef = useRef<any>(null);

  // // map을 즉시 생성
  useEffect(() => {
    if (window.kakao && window.kakao.maps && mapRef.current) {
      const map = new window.kakao.maps.Map(mapRef.current, {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      });
      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (days < 1) return; // days가 1 미만이면 효과 실행 안 함
    const fetchPlaces = async () => {
      try {
        const response = await axios.get<RecommendResponse>(
          "http://13.124.106.170:8080/api/recommend/place",
          {
            params: { sId: sid, days: days },
          }
        );
        const recommendations = response.data.recommend_places;

        console.log("API 응답 데이터:", recommendations);

        if (window.kakao && window.kakao.maps && mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          const bounds = new window.kakao.maps.LatLngBounds();

          const markers = recommendations
            .map((item) => {
              const { latitude, longitude, url, place_name, description } = item.place;
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

              // CustomOverlay로 장소명 표시
              const overlayContent = document.createElement("div");
              overlayContent.innerHTML = `<div style="
                background-color: white; 
                color: black;
                padding: 2px 8px; 
                border-radius: 4px;
                font-size: 12px; 
                font-weight: bold;
                text-align: center;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
                margin-bottom: 22px;
              ">${place_name}</div>`;

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
            const currentLevel = map.getLevel();
            map.setLevel(currentLevel + 1);
          }
        }
      } catch (error) {
        console.error("API 요청 실패 ❌", error);
      }
    };
  
      fetchPlaces();
    },[days]); // 10초 지연

  // // // 10초 후에 마커 추가
  //     const fetchPlaces = async () => {
  //       try {
  //         const response = await axios.get<RecommendResponse>("http://13.124.106.170:8080/api/recommend/place", {
  //           params: { sId: sid, days: days },
  //         });
  //         const recommendations = response.data.recommend_places;

  //         console.log("API 응답 데이터:", recommendations);

  //         // map 인스턴스가 존재하는지 확인
  //         if (window.kakao && window.kakao.maps && mapInstanceRef.current) {
  //           const map = mapInstanceRef.current;
  //           const bounds = new window.kakao.maps.LatLngBounds();

  //           const markers = recommendations
  //             .map((item) => {
  //               const { latitude, longitude, url, place_name } = item.place;
  //               const { days } = item;
  //               if (!latitude || !longitude || !url) return null;

  //               const markerPosition = new window.kakao.maps.LatLng(
  //                 parseFloat(latitude),
  //                 parseFloat(longitude)
  //               );
  //           // const markers = recommendations
  //           //   .map((item) => {
  //           //     const { latitude, longitude, url, place_name } = item.place;
  //           //     const { days } = item;

  //           //     if (!latitude || !longitude || !url) return null;

  //           //     const markerPosition = new window.kakao.maps.LatLng(
  //           //       parseFloat(latitude),
  //           //       parseFloat(longitude)
  //           //     );

  //               bounds.extend(markerPosition);

  //               const markerImage = new window.kakao.maps.MarkerImage(
  //                 `/public/day${days}-pin.svg`,
  //                 new window.kakao.maps.Size(40, 40),
  //                 { offset: new window.kakao.maps.Point(20, 40) }
  //               );

  //               const marker = new window.kakao.maps.Marker({
  //                 position: markerPosition,
  //                 image: markerImage,
  //                 map,
  //               });

  //               // 마커 위에 장소명 표시 (CustomOverlay)
  //               const overlayContent = document.createElement("div");
  //               overlayContent.innerHTML = `<div style="
  //                 background-color: white; 
  //                 color: black;
  //                 padding: 2px 8px; 
  //                 border-radius: 4px;
  //                 font-size: 12px; 
  //                 font-weight: bold;
  //                 text-align: center;
  //                 box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  //                 margin-bottom: 22px;
  //               ">${name}</div>`;

  //               const overlay = new window.kakao.maps.CustomOverlay({
  //                 content: overlayContent,
  //                 position: markerPosition,
  //                 yAnchor: 1.5,
  //                 zIndex: 3,
  //               });

  //               overlay.setMap(map);

  //               // 마커 클릭 시 URL로 이동
  //               window.kakao.maps.event.addListener(marker, "click", () => {
  //                 window.open(url, "_blank");
  //               });

  //               return marker;
  //             })
  //             .filter((marker) => marker !== null);

  //           if (markers.length > 0) {
  //             map.setBounds(bounds);
  //             const currentLevel = map.getLevel();
  //             map.setLevel(currentLevel + 1);
  //           }
  //         }
  //       } catch (error) {
  //         console.error("API 요청 실패 ❌", error);
  //       }
  //     };

  //     fetchPlaces();
  //   }, [days]);

  // useEffect(() => {
  //   const fetchPlaces = async () => {
  //     console.log(sid);
  //     try {
  //       const response = await axios.get<Recommendation[]>
  //       const places: Place[] = response.data.;

  //       console.log("API 응답 데이터:", places);
        

  //       if (window.kakao && window.kakao.maps) {
  //         if (mapRef.current) {
  //           const map = new window.kakao.maps.Map(mapRef.current, {
  //             center: new window.kakao.maps.LatLng(37.5665, 126.978),
  //             level: 3,
  //           });

  //           const bounds = new window.kakao.maps.LatLngBounds();

  //           const markers = places
  //             .map((item) => {
  //               const { latitude, longitude, url, place_name } = item.place;
  //               const { days } = item;

  //               if (!latitude || !longitude || !url) return null;

  //               const markerPosition = new window.kakao.maps.LatLng(
  //                 parseFloat(latitude),
  //                 parseFloat(longitude)
  //               );

  //               bounds.extend(markerPosition);

  //               const markerImage = new window.kakao.maps.MarkerImage(
  //                 `/public/day${days}-pin.svg`,
  //                 new window.kakao.maps.Size(40, 40),
  //                 { offset: new window.kakao.maps.Point(20, 40) }
  //               );

  //               const marker = new window.kakao.maps.Marker({
  //                 position: markerPosition,
  //                 image: markerImage,
  //                 map,
  //               });

  //               // 마커 위에 장소명 표시 (CustomOverlay)
  //               const overlayContent = document.createElement("div");
  //               overlayContent.innerHTML = `<div style="
  //                 background-color: white; 
  //                 color:black;
  //                 padding: 2px 8px; 
  //                 border-radius: 4px;
  //                 font-size: 12px; 
  //                 font-weight: bold;
  //                 text-align: center;
  //                 box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  //                 margin-bottom: 22px;
  //               ">${place_name}</div>`;

  //               const overlay = new window.kakao.maps.CustomOverlay({
  //                 content: overlayContent,
  //                 position: markerPosition,
  //                 yAnchor: 1.5,
  //                 zIndex: 3,
  //               });

  //               overlay.setMap(map);

  //               // 마커 클릭 시 URL로 이동
  //               window.kakao.maps.event.addListener(marker, "click", () => {
  //                 window.open(url, "_blank");
  //               });

  //               return marker;
  //             })
  //             .filter((marker) => marker !== null);

  //           if (markers.length > 0) {
  //             map.setBounds(bounds);

  //             const currentLevel = map.getLevel();
  //             map.setLevel(currentLevel + 1);
  //           }
  //         }
  //       }
  //     } catch (error) {
  //       console.error("API 요청 실패 ❌", error);
  //     }
  //   };

  //   fetchPlaces();
  // }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const fetchPlaces = async () => {
  //       try {
  //         const response = await axios.get<Recommendation[]>(
  //           "http://13.124.106.170:8080/api/recommend/place"
  //         );
  //         const places = response.data;
  
  //         console.log("API 응답 데이터:", places);
  
  //         if (window.kakao && window.kakao.maps) {
  //           if (mapRef.current) {
  //             const map = new window.kakao.maps.Map(mapRef.current, {
  //               center: new window.kakao.maps.LatLng(37.5665, 126.978),
  //               level: 3,
  //             });
  
  //             const bounds = new window.kakao.maps.LatLngBounds();
  
  //             const markers = places
  //               .map((item) => {
  //                 const { latitude, longitude, url, name } = item.place;
  //                 const { days } = item;
  
  //                 if (!latitude || !longitude || !url) return null;
  
  //                 const markerPosition = new window.kakao.maps.LatLng(
  //                   parseFloat(latitude),
  //                   parseFloat(longitude)
  //                 );
  
  //                 bounds.extend(markerPosition);
  
  //                 const markerImage = new window.kakao.maps.MarkerImage(
  //                   `/public/day${days}-pin.svg`,
  //                   new window.kakao.maps.Size(40, 40),
  //                   { offset: new window.kakao.maps.Point(20, 40) }
  //                 );
  
  //                 const marker = new window.kakao.maps.Marker({
  //                   position: markerPosition,
  //                   image: markerImage,
  //                   map,
  //                 });
  
  //                 // 마커 위에 장소명 표시 (CustomOverlay)
  //                 const overlayContent = document.createElement("div");
  //                 overlayContent.innerHTML = `<div style="
  //                   background-color: white; 
  //                   color: black;
  //                   padding: 2px 8px; 
  //                   border-radius: 4px;
  //                   font-size: 12px; 
  //                   font-weight: bold;
  //                   text-align: center;
  //                   box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  //                   margin-bottom: 22px;
  //                 ">${name}</div>`;
  
  //                 const overlay = new window.kakao.maps.CustomOverlay({
  //                   content: overlayContent,
  //                   position: markerPosition,
  //                   yAnchor: 1.5,
  //                   zIndex: 3,
  //                 });
  
  //                 overlay.setMap(map);
  
  //                 // 마커 클릭 시 URL로 이동
  //                 window.kakao.maps.event.addListener(marker, "click", () => {
  //                   window.open(url, "_blank");
  //                 });
  
  //                 return marker;
  //               })
  //               .filter((marker) => marker !== null);
  
  //             if (markers.length > 0) {
  //               map.setBounds(bounds);
  //               const currentLevel = map.getLevel();
  //               map.setLevel(currentLevel + 1);
  //             }
  //           }
  //         }
  //       } catch (error) {
  //         console.error("API 요청 실패 ❌", error);
  //       }
  //     };
  
  //     fetchPlaces();
  //   }, 10000); // 10000ms = 10초
  
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <>
      <MapContainer ref={mapRef} />
      <Sidebar />
    </>
  );
}

export default KakaoMap;
