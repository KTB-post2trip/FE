import { useState } from "react";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import styled from "styled-components";
import SelectPlace from "./SelectPlace";

export default function CountDays() {
  const [days, setDays] = useState<number>(1); // 선택된 날짜
  const [isLoading, setIsLoading] = useState<boolean>(false); // 로딩 상태
  const [showSelectPlace, setShowSelectPlace] = useState<boolean>(false); // API 응답 완료 후 UI 업데이트

  // API 호출 함수
  const handleCreateTrip = async () => {
    setIsLoading(true); // 로딩 시작
    setShowSelectPlace(false); // 기존 UI 숨기기

    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ days }),
        }
      );

      const result = await response.json();
      console.log("API 응답:", result);
      setShowSelectPlace(true); // API 응답 완료 후 UI 표시
    } catch (error) {
      console.error("API 요청 실패 ❌", error);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Main>
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="bold">
          몇 일 여행하시나요? ✈️
        </Typography>
        <CountWrapper>
          <CircleButton
            variant="contained"
            onClick={() => setDays((prev) => Math.max(1, prev - 1))}
            disabled={days === 1}
          >
            -
          </CircleButton>
          <Typography variant="h5">{days}일</Typography>
          <CircleButton
            variant="contained"
            onClick={() => setDays((prev) => prev + 1)}
          >
            +
          </CircleButton>
        </CountWrapper>

        {/* 생성하기 버튼 */}
        <CreateButton
          variant="contained"
          onClick={handleCreateTrip}
          disabled={isLoading}
        >
          생성하기
        </CreateButton>

        {/* API 요청 중이면 Progress Circle 표시 */}
        {isLoading && <CircularProgress sx={{ marginTop: 2 }} />}

        {/* API 요청이 완료되면 SelectPlace 표시 */}
        {showSelectPlace && <SelectPlace />}
      </Box>
    </Main>
  );
}

// 스타일 정의
const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
`;

const CircleButton = styled(Button)`
  && {
    width: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 50%;
    min-width: 30px;
    padding: 0;
    background-color: gray;
  }
`;

const CreateButton = styled(Button)`
  && {
    margin-top: 15px;
    background-color: #4caf50;
    color: white;
    &:hover {
      background-color: #388e3c;
    }
  }
`;
