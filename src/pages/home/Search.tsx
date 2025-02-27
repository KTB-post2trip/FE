import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import YouTube from "react-youtube";
import axios from "axios";
import { Place } from "../../types/Place";

import ErrorModal from "../../components/modals/ErrorModal";
import SelectModal from "../../components/modals/SelectModal";

const Home = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(true);

  const handleErrorModalClose = (): boolean => {
    setShowErrorModal(false);
    return true;
  };

  useEffect(() => {
    if (!showVideo) return;
    const startTime = Date.now();
    const duration = 12000; // 10초
    const maxProgressBeforeApi: number = 97;

    let animationFrameId: number | null = null;

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const fraction = elapsed / duration; // 0 ~ 1
      let nextValue = Math.floor(fraction * maxProgressBeforeApi);

      // 97%를 넘지 않도록 처리
      if (nextValue > maxProgressBeforeApi) {
        nextValue = maxProgressBeforeApi;
      }

      // 기존 progress보다 작게 내려가지 않도록
      setProgress((prev) => Math.max(prev, nextValue));

      // 아직 97% 미만이라면 계속 업데이트
      if (nextValue < maxProgressBeforeApi) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [showVideo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://example.com/api/summary", {
          params: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          },
        });
        console.log(response.data);

        // 응답이 성공적으로 도착하면 진행률을 100%로 설정
        setProgress(100);

        // 필요하다면 100%가 된 후 잠시 뒤에 페이지 이동
        // setTimeout(() => { navigate('/next-page'); }, 500);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <FieldWrapper>
      <LogoWrapper isHidden={showVideo}>
        <LogoWrapper src="" alt="로고" />
      </LogoWrapper>
      <SearchWrapper isHidden={showVideo}>
        <BoxWrapper>
          <SelectBox>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="제주">제주</option>
            <option value="부산">부산</option>
            <option value="강원">강원</option>
            <option value="경상">경상</option>
            <option value="경남">경남</option>
            <option value="전남">전남</option>
            <option value="전북">전북</option>
            <option value="대구">대구</option>
            <option value="충청">충청</option>
          </SelectBox>
          (으)로 떠나볼까요?
        </BoxWrapper>
        <SelectUrl />
        <StartBtn onClick={() => setShowVideo(true)}>일정 만들기</StartBtn>
      </SearchWrapper>

      <VideoWrapper isVisible={showVideo}>
        <Header>Link2Trip</Header>
        <YouTube
          videoId={"R4AlFMAgDz0"}
          opts={{
            width: "760px",
            height: "360px",
            playerVars: {
              autoplay: 1, //자동재생 O
              rel: 0, //관련 동영상 표시하지 않음 (근데 별로 쓸모 없는듯..)
              modestbranding: 1, // 컨트롤 바에 youtube 로고를 표시하지 않음
            },
          }}
        />
        <CheckMessage>
          장소를 확인중입니다!
          <p>잠시만 기다려주세요</p>
          <ProgressBar>
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#3071f2",
                transition: "width 0.2s ease",
                borderRadius: "15px",
                fontSize: "17px",
                color: "white",
              }}
            >
              {progress}%
            </div>
          </ProgressBar>
        </CheckMessage>
      </VideoWrapper>
      {showErrorModal && <SelectModal onClose={handleErrorModalClose} />}
    </FieldWrapper>
  );
};

export default Home;

// 왼쪽으로 이동하며 페이드 아웃
const fadeOutLeft = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  90% {
    opacity: 0;
    transform: translateX(-200px);
  }
  100%{
    opacity: 0;
  }
`;

// 오른쪽으로 이동하며 페이드 아웃
const fadeOutRight = keyframes`
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  90% {
    opacity: 0;
    transform: translateX(200px);
  }
  100%{
    opacity: 0;
  }
`;

// 페이드 인 (스케일 살짝 키우는 예시)
const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;
/*----------------여기까지 애니메이션 가볍게---------------------*/

const FieldWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: white;
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
`;
const LogoWrapper = styled.div<{ isHidden: boolean }>`
  width: 45.83vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: #3071f2;
  border-radius: 0 20px 20px 0;
  justify-content: center;
  display: flex;
  align-items: center;
  /* filter: drop-shadow(3px 0px 5px rgba(0, 0, 0, 0.25)); */
  animation: ${({ isHidden }) => (isHidden ? fadeOutLeft : "none")} 1s forwards;
`;

const Logo = styled.img`
  width: 346px;
  height: 127px;
  /* flex-shrink: 0; */
`;

const SearchWrapper = styled.div<{ isHidden: boolean }>`
  width: 52.17vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  animation: ${({ isHidden }) => (isHidden ? fadeOutRight : "none")} 1s forwards;
`;

const BoxWrapper = styled.div`
  width: 755px;
  height: 120px;
  color: #0d0d0d;
  font-family: "Noto Sans";
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  margin-top: 275px;
`;

const SelectBox = styled.select`
  background-color: #3071f2;
  color: white;
  border-radius: 10px;
  text-align: center;
  width: 174px;
  height: 76px;
  font-family: "Noto Sans";
  font-size: 55px;
  font-style: normal;
  font-weight: 700;

  option {
    color: white;
    text-align: center;
    width: 160px;
    font-family: "Noto Sans";
    font-size: 55px;
    font-style: normal;
    font-weight: 700;
  }

  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: white;
  }
`;

const SelectUrl = styled.input`
  margin-top: 151px;
  width: 700px;
  height: 50px;
  background-color: white;

  color: #666;
  font-family: "Noto Sans";
  font-size: 36px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: -0.072px;
  border: none;
  border-bottom: 3px solid #000;

  padding-bottom: 20px;

  &:focus {
    outline: none;
    border-bottom-color: #000;
  }
  &::placeholder {
    color: #999;
  }
`;

const StartBtn = styled.div`
  display: flex;
  width: 317px;
  padding: 15px 35px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: #3e76e5;

  color: #fff;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  cursor: pointer;
  margin-top: 150px;

  &:active {
    scale: 0.97;
    background-color: #648fe6;
    transition: cubic-bezier(0.15, 1, 0.5, 1);
    transition-duration: 0.1s;
  }
`;

/*---------------------여기서 부터 로딩--------------------------*/

const VideoWrapper = styled.div<{ isVisible: boolean }>`
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  flex-direction: column;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* justify-content: center; */
  animation: ${({ isVisible }) => (isVisible ? fadeIn : "none")} 1s forwards;
`;
const Header = styled.div`
  width: 100vw;
  /* height: 50px; */

  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  text-align: left;

  margin-bottom: 230px;
`;
const CheckMessage = styled.div`
  margin-top: 68px;

  color: #3071f2;
  text-align: center;
  font-family: "Noto Emoji";
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  p {
    margin-top: 19px;

    color: #606060;
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`;

const ProgressBar = styled.div`
  width: 587px;
  height: 27px;

  border-radius: 15px;
  border: 2px solid var(--Grays-Gray-4, #d1d1d6);
  background: var(--semi-white, #f4f4f4);
`;
