import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { usePlaceStore, Place } from "../store/PlaceStore";

export default function MapPlace() {
  const { places } = usePlaceStore();

  // 그리드 컨테이너 참조
  const containerRef = useRef<HTMLDivElement>(null);

  // 열 개수를 저장할 상태
  const [cols, setCols] = useState<number>(2);

  useEffect(() => {
    // ResizeObserver 콜백
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;

      // 부모 컨테이너 너비가 350px 미만이면 1열, 아니면 2열
      setCols(width < 350 ? 1 : 2);
    };

    // 초기 한 번 실행
    handleResize();

    // ResizeObserver 인스턴스 생성
    const observer = new ResizeObserver(() => handleResize());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 클린업
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <ContentWrapper ref={containerRef} cols={cols}>
      {places.map((place: Place) => {
        return (
          <PlaceWrapper key={place.id}>
            <PlaceImage src={place.imageUrl} alt="장소" />
            <Title>{place.name}</Title>
            <Description>{place.description}</Description>
          </PlaceWrapper>
        );
      })}
    </ContentWrapper>
  );
}

interface ContentWrapperProps {
  cols: number;
}

const ContentWrapper = styled.div<ContentWrapperProps>`
  /* 컨테이너는 부모의 여유 공간에 맞게 100% 너비, 높이 */
  /* position: relative; */
  width: 100%;
  max-height: 80%;
  overflow-y: hidden;
  /* 최대 크기는 원하는 값으로 설정 */
  row-gap: 20px;
  display: grid;
  justify-items: center;
  /* gap: 25px; */
  /* 화면이 넓으면 2개씩, 좁으면 1개씩 자동 배치 */
  /* grid-template-columns: repeat(2fr, 1fr); */
  grid-template-columns: repeat(${(props) => props.cols}, 2fr);

  /* 너비가 350px 이하이면 1열로 전환 */
  @media (width: 350px) {
    grid-template-columns: 1fr;
  }
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: white;
  }
`;

const PlaceWrapper = styled.div`
  height: 130px;
  border-radius: 20px;
  border: 2px dashed #676767;
  /* justify-content: center; */
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const PlaceImage = styled.img`
  border-radius: 20px;
  width: 80px;
  height: 80px;
`;

const Title = styled.div`
  width: 110px;
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  margin-top: 6px;
`;

const Description = styled.div`
  color: #676767;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-top: 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //2줄까지만만
  overflow: hidden;
  text-overflow: ellipsis;

  margin-top: 3px;
  width: 130px;
`;
