import { useEffect, useRef } from "react";
import { Main, MapContainer } from "./KakaoMap.style";

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };

      if (mapRef.current) {
        const map = new window.kakao.maps.Map(mapRef.current, mapOption);
        new window.kakao.maps.Marker({
          position: mapOption.center,
          map,
        });
      }
    }
  }, []);

  return (
    <Main>
      <MapContainer ref={mapRef} />
    </Main>
  );
};

export default KakaoMap;
