/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PlaceList from "./PlaceList";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { usePlaceStore } from "../../store/PlaceStore";
import { useRecommendStore } from "../../store/useRecommendStore";

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

interface PlaceData {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  days: number;
}

export default function SelectDays() {
  const { sid } = usePlaceStore();
  const { places, setPlaces, days } = useRecommendStore();
  const [uniqueDays, setUniqueDays] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // useEffect(() => {
  //   const fetchPlaces = async () => {
  //     if (!sid) {
  //       console.error("❌ sid 값이 없습니다.");
  //       return;
  //     }
  //     try {
  //       const response = await axios.get("http://13.124.106.170:8080/api/recommend/place", {
  //         params: { sId: sid, days },
  //       });
  //       // 응답 객체에서 recommend_places 배열 추출
  //       const recommendPlaces: Recommendation[] = response.data.recommend_places;
  //       console.log("API 응답 데이터:", recommendPlaces);

  //       // recommendPlaces 배열을 PlaceData 타입에 맞게 변환
  //       const transformedData: PlaceData[] = recommendPlaces.map((item: any) => ({
  //         id: item.sort, // sort 값을 id로 사용 (필요하면 다른 필드로 변경)
  //         name: item.place.place_name, // 새로운 API에서는 place_name 사용
  //         description: item.place.description,
  //         imageUrl: item.place.imageUrl && item.place.imageUrl.trim() !== ""
  //           ? item.place.imageUrl
  //           : "N_else.png",
  //         days: item.days,
  //       }));

  //       setPlaces(transformedData);

  //       const extractedDays = [
  //         ...new Set(transformedData.map((place) => place.days)),
  //       ].sort((a, b) => a - b);
  //       setUniqueDays(extractedDays);
  //       setCurrentPage(extractedDays.length > 0 ? extractedDays[0] : 1);
  //     } catch (error) {
  //       console.error("❌ API 요청 실패", error);
  //     }
  //   };

  //   fetchPlaces();
  // }, [sid, days]);

  useEffect(() => {
    const fetchPlaces = async () => {
      if (!sid) {
        console.error("❌ sid 값이 없습니다.");
        return;
      }

      try {
        const response = await axios.get("http://13.124.106.170:8080/api/recommend/place", {
          params: { sId: sid, days: days },
        });
        // API 응답은 { recommend_places: Recommendation[] } 형태입니다.
        const recommendPlaces: Recommendation[] = response.data.recommend_places;
        console.log("API 응답 데이터:", recommendPlaces);

        // recommendPlaces 배열을 PlaceData 배열로 변환
        const transformedData: PlaceData[] = recommendPlaces.map((item: any) => ({
          id: item.sort, // sort 값을 id로 사용 (필요에 따라 수정)
          name: item.place.place_name, // API에서는 place_name을 사용합니다.
          description: item.place.description,
          imageUrl:
            item.place.imageUrl && item.place.imageUrl.trim() !== ""
              ? item.place.imageUrl
              : "N_else.png",
          days: item.days,
        }));

        // Store에 변환된 데이터를 저장합니다.
        setPlaces(transformedData);

        // 각 Place의 days 값을 추출하여 고유 일차 배열을 만듭니다.
        const extractedDays = [
          ...new Set(transformedData.map((place) => place.days)),
        ].sort((a, b) => a - b);
        setUniqueDays(extractedDays);
        setCurrentPage(extractedDays.length > 0 ? extractedDays[0] : 1);
      } catch (error) {
        console.error("❌ API 요청 실패", error);
      }
    };

    fetchPlaces();
  }, [sid, days, setPlaces]);

  const handlePrev = () => {
    const currentIndex = uniqueDays.indexOf(currentPage);
    if (currentIndex > 0) setCurrentPage(uniqueDays[currentIndex - 1]);
  };

  const handleNext = () => {
    const currentIndex = uniqueDays.indexOf(currentPage);
    if (currentIndex < uniqueDays.length - 1)
      setCurrentPage(uniqueDays[currentIndex + 1]);
  };

  return (
    <Main>
      <Header>
        <Arrow onClick={handlePrev} disabled={currentPage === uniqueDays[0]}>
          <FaLongArrowAltLeft />
        </Arrow>
        <Title>{currentPage}일차</Title>
        <Arrow
          onClick={handleNext}
          disabled={currentPage === uniqueDays[uniqueDays.length - 1]}
        >
          <FaLongArrowAltRight />
        </Arrow>
      </Header>
      <SlideContainer>
        <PlaceList data={places} currentPage={currentPage} />
      </SlideContainer>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 10px;
`;

const Arrow = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${(props) => (props.disabled ? "#ccc" : "#000")};
  outline: none;
`;

const Title = styled.p`
  font-size: 20px;
  font-weight: bold;
`;

const SlideContainer = styled.div`
  width: 80%;
  height: 100%;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;
