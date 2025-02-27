/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Box, CircularProgress } from "@mui/material";
import styled from "styled-components";
import { BsAirplaneFill } from "react-icons/bs";
import axios from "axios";
import { usePlaceStore } from "../../store/PlaceStore";
import { useRecommendStore } from "../../store/useRecommendStore";

interface CountDaysProps {
  onCreate: () => void;
}

export default function CountDays({ onCreate }: CountDaysProps) {
  const [days, setDays] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { sid } = usePlaceStore();
  const { setPlaces } = useRecommendStore();

  const handleCreateTrip = async () => {
    if (!sid) {
      console.error("❌ sid 값이 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `/api/recommend/place?sId=${sid}&days=${days}`
      );

      const result = response.data;
      console.log("✅ API 응답:", result);

      if (result.recommend_places) {
        const formattedPlaces = result.recommend_places.map((item: any) => ({
          id: item.sort,
          name: item.place.place_name,
          description: item.place.description,
          imageUrl: item.place.imageUrl || "/public/default-image.png",
          days: item.days,
        }));

        setPlaces(formattedPlaces);
      }

      setTimeout(() => {
        setIsLoading(false);
        onCreate();
      }, 500);
    } catch (error) {
      console.error("❌ API 요청 실패", error);
      setIsLoading(false);
    }
  };

  return (
    <Main>
      <Box textAlign="center">
        {isLoading && <CircularProgress sx={{ marginTop: 2 }} />}
        <TitleText>
          여행 기간을 선택하세요
          <AirplaneIcon />
        </TitleText>
        <MiniText>날짜에 맞는 일정을 AI가 생성해드릴게요!</MiniText>
        <CountWrapper>
          <CircleButton
            variant="contained"
            onClick={() => setDays((prev) => Math.max(1, prev - 1))}
            disabled={days === 1}
          >
            -
          </CircleButton>
          <SubText>{days}일</SubText>
          <CircleButton
            variant="contained"
            onClick={() => setDays((prev) => prev + 1)}
          >
            +
          </CircleButton>
        </CountWrapper>

        <CreateButton onClick={handleCreateTrip} disabled={isLoading}>
          생성하기
        </CreateButton>
      </Box>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  justify-content: center;
  align-items: center;
`;

const CircleButton = styled(Button)`
  && {
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 50%;
    min-width: 20px;
    padding: 0;
    background-color: #bcbcbc;
  }
`;

const CreateButton = styled(Button)`
  && {
    width: 180px;
    border-radius: 20px;
    margin-top: 15px;
    font-weight: 600;
    margin-top: 30px;
    background-color: #3478f5;
    color: white;
    &:hover {
      background-color: #0050e3;
    }
  }
`;

const TitleText = styled.p`
  font-size: 18px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 3px;
`;

const SubText = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

const AirplaneIcon = styled(BsAirplaneFill)`
  width: 12px;
`;

const MiniText = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: gray;
`;
