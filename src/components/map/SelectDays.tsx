import { useState } from "react";
import styled from "styled-components";
import PlaceList from "./PlaceList";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

const mockData = [
  {
    id: 1,
    name: "경복궁",
    description: "풍경이 예쁜 제주도",
    imageUrl: "https://ui-avatars.com/api/?name=HI",
    page: 4,
  },
  {
    id: 2,
    name: "경복궁 경회루",
    description: "풍경이 예쁜 제주도 대표 산",
    imageUrl: "https://ui-avatars.com/api/?name=dfs",
    page: 1,
  },
  {
    id: 2,
    name: "경복궁 경회루",
    description: "풍경이 예쁜 제주도 대표 산",
    imageUrl: "https://ui-avatars.com/api/?name=HI",
    page: 3,
  },
  {
    id: 5,
    name: "경복궁 경회루",
    description: "풍경이 예쁜 제주도 대표 산",
    imageUrl: "https://ui-avatars.com/api/?name=HI",
    page: 3,
  },
  {
    id: 3,
    name: "창덕궁",
    description: "조선 시대 궁궐",
    imageUrl: "https://ui-avatars.com/api/?name=CDG",
    page: 2,
  },
];

export default function SelectDays() {
  const uniquePages = [...new Set(mockData.map((item) => item.page))].sort(
    (a, b) => a - b
  );
  const [currentPage, setCurrentPage] = useState(uniquePages[0]);

  const handlePrev = () => {
    const currentIndex = uniquePages.indexOf(currentPage);
    if (currentIndex > 0) setCurrentPage(uniquePages[currentIndex - 1]);
  };

  const handleNext = () => {
    const currentIndex = uniquePages.indexOf(currentPage);
    if (currentIndex < uniquePages.length - 1)
      setCurrentPage(uniquePages[currentIndex + 1]);
  };

  return (
    <Main>
      <Header>
        <Arrow onClick={handlePrev} disabled={currentPage === uniquePages[0]}>
          <FaLongArrowAltLeft />
        </Arrow>
        <Title>{currentPage}일차</Title>
        <Arrow
          onClick={handleNext}
          disabled={currentPage === uniquePages[uniquePages.length - 1]}
        >
          <FaLongArrowAltRight />
        </Arrow>
      </Header>
      <SlideContainer>
        <PlaceList data={mockData} currentPage={currentPage} />
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
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }
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
