import { useState, useEffect } from 'react';
import styled, {keyframes} from 'styled-components'
import YouTube from 'react-youtube';
import axios from 'axios';

import { usePlaceStore, Place } from '../../store/PlaceStore';

import ErrorModal from '../../components/modals/ErrorModal';
import SelectModal from '../../components/modals/SelectModal';

const Home = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [selectedPlace, setSelectedPlace] = useState<string>('서울');
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");

  const { setPlaces, setSid } = usePlaceStore();

  const handleErrorModalClose = (): boolean => {
    setShowErrorModal(false);
    return true;
  };

  const extractVideoId = (url: string): string => {
    const vParamIndex = url.indexOf("v=");
    if (vParamIndex === -1) return "";
    let id = url.substring(vParamIndex + 2);
    const ampIndex = id.indexOf("&");
    if (ampIndex !== -1) {
      id = id.substring(0, ampIndex);
    }
    // console.log(id);
    return id;
  };

  useEffect(() => {
    if (!showVideo) return;
    const startTime = Date.now();
    const duration = 12000;  // 12초
    const maxProgressBeforeApi:number = 97;

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
      setProgress(prev => Math.max(prev, nextValue));

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

//api 호출
  const fetchPlaceData = async (): Promise<void> => {
    try {
      const response = await axios.get<Place[]>('/api/place', {
        params: {
          url: youtubeUrl,
          placeName: selectedPlace,
        }
      });

      setPlaces(response.data);
      setSid(response.data[0].sid);

      console.log(response.data);
      console.log(response.data[0].sid);

      // 응답이 성공적으로 도착하면 진행률을 100%로 설정
      setProgress(100);
      setShowErrorModal(true);

      // 필요하다면 100%가 된 후 잠시 뒤에 페이지 이동
      // setTimeout(() => { navigate('/next-page'); }, 500);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FieldWrapper>
      <LogoWrapper isHidden={showVideo}>
        <Logo src='L2T_Logo.png' alt='Logo'/>
      </LogoWrapper>
      <SearchWrapper isHidden={showVideo}>
        <BoxWrapper>
          <SelectBox
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
          >
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="제주">제주</option>
            <option value="부산">부산</option>
            <option value="강원">강원</option>
            <option value="경상">경상</option>
            <option value="전남">전남</option>
          </SelectBox>
          (으)로 떠나볼까요?
        </BoxWrapper>
        <SelectUrl
          placeholder="ex)https://www.youtube.com/" 
          value={youtubeUrl} 
          onChange={(e) => setYoutubeUrl(e.target.value)} 
        />
        <StartBtn onClick={() => {
          {
            if (youtubeUrl.trim() === "") {
              alert("YouTube URL을 입력하세요.");
              return;
            }}
          setShowVideo(true); fetchPlaceData();}}>일정 만들기</StartBtn>
      </SearchWrapper>

      <VideoWrapper Hidden={showVideo}>
        <Header>
          <img src='Col_Logo.png' alt='Logo'/>
        </Header>
        <YouTube
          videoId={extractVideoId(youtubeUrl)}
          opts={{
            width: "760px",
            height: "360px",
            playerVars: {
              autoplay: 1,
              rel: 0,
              modestbranding: 1,
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
                height: '100%',
                backgroundColor: '#3071f2',
                transition: 'width 0.2s ease',
                borderRadius: '15px',
                fontSize: '17px',
                color: 'white'
              }}
            >
              {progress}%
            </div>
          </ProgressBar>
        </CheckMessage>
      </VideoWrapper>
      {showErrorModal && <SelectModal onClose={handleErrorModalClose} />}
    </FieldWrapper>
  )
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
`
const LogoWrapper = styled.div<{ isHidden: boolean }>`
  width: 45.83vw;
  height: 100vh;
  flex-shrink: 0;
  background-color: #3071F2;
  border-radius: 0 20px 20px 0;
  justify-content: center;
  display: flex;
  align-items: center;
  /* filter: drop-shadow(3px 0px 5px rgba(0, 0, 0, 0.25)); */
  animation: ${({ isHidden }) => isHidden ? fadeOutLeft : 'none'} 1s forwards;
`

const Logo = styled.img`
  width: 400px;
  height: 390px;
  /* flex-shrink: 0; */
`

const SearchWrapper = styled.div<{ isHidden: boolean }>`
  width: 52.17vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
  animation: ${({ isHidden }) => isHidden ? fadeOutRight : 'none'} 1s forwards;
`

const BoxWrapper = styled.div`
  width: 755px;
  height: 120px;
  color: #0D0D0D;
  font-family: "Noto Sans";
  font-size: 64px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  
  margin-top: 275px;
`

const SelectBox = styled.select`
  background-color: #3071F2;
  color: white;
  border-radius: 10px;
  text-align: center;
  width: 174px;
  height: 76px;
  font-family: "Noto Sans";
  font-size: 55px;
  font-style: normal;
  font-weight: 700;

  option{
    color: white;
    text-align: center;
    width: 80;
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
`

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
`

const StartBtn = styled.div`
  display: flex;
  width: 317px;
  padding: 15px 35px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: #3e76e5;

  color: #FFF;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 21px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  cursor: pointer;
  margin-top: 150px;

  &:active{
    scale: 0.97;
    background-color: #648fe6;
    transition: cubic-bezier(0.15, 1, 0.5, 1);
    transition-duration: 0.1s;
  }
`

/*---------------------여기서 부터 로딩--------------------------*/

const VideoWrapper = styled.div<{ Hidden: boolean }>`
  display: ${({ Hidden }) => ( Hidden ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;

  position: absolute; 
  top: 0; 
  left: 0; 
  width: 100vw;
  height: 100vh;
  /* justify-content: center; */
  animation: ${({ Hidden }) => ( Hidden ? fadeIn : 'none')} 1s forwards;
`
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

  margin-bottom: 150px;

  img{
    width: 220px;
    height: 47px;
    margin-top: 65px;
    margin-left: 65px;
  }
`
const CheckMessage = styled.div`
  margin-top: 68px;

  color: #3071F2;
  text-align: center;
  font-family: "Noto Emoji";
  font-size: 40px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  p{
    margin-top: 19px;

    color: #606060;
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
`

const ProgressBar = styled.div`
  width: 587px;
  height: 27px;
  
  border-radius: 15px;
  border: 2px solid var(--Grays-Gray-4, #D1D1D6);
  background: var(--semi-white, #F4F4F4);
`