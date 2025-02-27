/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import PlaceList from "./PlaceList";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

interface Place {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  days: number;
}

export default function SelectDays() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [uniqueDays, setUniqueDays] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get("/api/recommend");
        const transformedData: Place[] = response.data.map((item: any) => ({
          id: item.place.id,
          name: item.place.name,
          description: item.place.description,
          imageUrl:
            item.place.imageUrl ||
            "https://via.placeholder.com/80?text=No+Image",
          days: item.days,
        }));

        setPlaces(transformedData);
        setUniqueDays(
          [...new Set(transformedData.map((place) => place.days))].sort(
            (a, b) => a - b
          )
        );
        setCurrentPage(
          transformedData.length > 0 ? transformedData[0].days : 1
        );
      } catch (error) {
        console.error("API 요청 실패 ❌", error);
      }
    };

    fetchPlaces();
  }, []);

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
