import React, {useEffect, useState} from 'react'
import styled from 'styled-components';
import axios from 'axios';
import { usePlaceStore, Place } from '../../store/PlaceStore';

import ErrorModal from './ErrorModal';

interface SelectModalProps {
  onClose: () => boolean;
}

const SelectModal: React.FC<SelectModalProps> = ({ onClose }) => {
  // const handleClose = (): boolean => {
  //   onClose();
  //   return false;
  // };


  
  const { places, removeIds, setPlaces } = usePlaceStore();
  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  const handleToggleExclude = (id: number) => {
    setExcludedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id) // 이미 있으면 제거
        : [...prev, id]               // 없으면 추가
    );
  };
  //저장하기 event
  const handleSave = async () => {
    try {
      //전역 상태에서 제외
      removeIds(excludedIds);

      //최종적으로 남아 있는 places의 id 목록
      const remainingIds = places
        .filter((p) => !excludedIds.includes(p.id))
        .map((p) => p.id);

      // 실제 API 엔드포인트/형식에 맞게 수정
      await axios.put('http://13.124.106.170:8080/api/place', { ids: remainingIds }, );
      console.log('저장 성공');
      console.log(usePlaceStore.getState().places);
      setPlaces(usePlaceStore.getState().places);
      console.log(places);
      window.location.href = '/map';
    } catch (error) {
      console.error(error);
    }
  };

  const getImageUrl = (place: Place): string => {
    // imageUrl이 없거나 공백이면 기본 이미지 선택
    if (!place.imageUrl || place.imageUrl.trim() === "") {
      if (place.category === "카페" || place.category === "디저트") {
        return "N_cafe.png";
      } else if (place.category === "음식점") {
        return "N_food.png";
      } else if (place.category === "관광지") {
        return "N_place.png";
      }
      return "default.png"; // 기타 기본값(원하는 경우)
    }
    return place.imageUrl;
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Message>제외할 장소를 선택해주세요</Message>
        <PlaceContainer>
          {Array.isArray(places) && places.length > 0 ? (
            places.map((place: Place) => {
              const isExcluded = excludedIds.includes(place.id);
              
              return (
                <PlaceWrapper
                  key={place.id}
                  onClick={() => handleToggleExclude(place.id)}
                  style={{
                    opacity: isExcluded ? 0.5 : 1,
                    backgroundColor: isExcluded ? '#a1a5ae' : 'white',
                    scale: isExcluded ? 0.97 : 1,
                  }}
                >
                  <PlaceImage 
                    src={getImageUrl(place)} 
                    alt='장소'
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (place.category === "카페/디저트") {
                        target.src = "N_cafe.png";
                      } else if (place.category === "음식점") {
                        target.src = "N_food.png";
                      } else if (place.category === "관광지") {
                        target.src = "N_place.png";
                      }
                    }}
                  />
                  <Title>{place.name}</Title>
                  <Description>{place.description}</Description>
                </PlaceWrapper>
              );
            })
          ) : (
            <p>장소 데이터가 없습니다.</p>
          )}
        </PlaceContainer>
        <SelectButton onClick={handleSave}>저장하기</SelectButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SelectModal

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: 90%;
  max-width: 1150px;
  height: 90%;
  max-height: 790px;
  /* padding: 20px 30px; */

  align-items: center;
  display: flex;
  flex-direction: column;

  background: white;
  border-radius: 38px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Message = styled.div`
  margin-top: 50px;
  margin-bottom: 50px;
  color: #0D0D0D;

  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 30px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const SelectButton = styled.button`
  width: 100%;
  max-width: 430px;
  padding: 16px 0 16px 0;
  background: lightGray;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;

  border-radius: 20px;
  border: 1.3px solid rgba(215, 226, 255, 0.08);
  background: #3071F2;
  backdrop-filter: blur(10px);
  margin-top: 75px;


  color: #FFF;
  font-family: "Pretendard Variable";
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px; /* 116.667% */
  &:hover {
    background: #457ce9;
  }

  &:active{
    scale: 0.97;
    background-color: #648fe6;
    transition: cubic-bezier(0.15, 1, 0.5, 1);
    transition-duration: 0.1s;
  }
`;

const PlaceContainer = styled.div`
  width: 1050px;
  height: 480px;
  display: grid;
  gap: 25px;
  grid-template-columns: repeat(4, 1fr);
  
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: black;
  }
`

const PlaceWrapper = styled.div`
  width: 220px;
  height: 220px;

  border-radius: 20px;
  border: 3px dashed #676767;
  /* justify-content: center; */
  align-items: center;
  display: flex;
  flex-direction: column;

  cursor: pointer;
`

const PlaceImage = styled.img`
  margin-top: 25px;
  border-radius: 10px;
  width: 100px;
  height: 100px;
`

const Title = styled.div`
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  margin-top: 15px;
`

const Description = styled.div`
  color: #676767;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; //2줄까지만만
  overflow: hidden;
  text-overflow: ellipsis;

  margin-top: 6px;
  width: 200px;
`