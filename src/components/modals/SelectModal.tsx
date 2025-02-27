import React from 'react'
import styled from 'styled-components';
import { usePlaceStore, Place } from '../../store/PlaceStore';

interface SelectModalProps {
  onClose: () => boolean;
}

const SelectModal: React.FC<SelectModalProps> = ({ onClose }) => {
  const handleClose = (): boolean => {
    onClose();
    return false;
  };

  const { places } = usePlaceStore();

  return (
    <ModalOverlay>
      <ModalContent>
        <Message>제외할 장소를 선택해주세요</Message>
        <PlaceContainer>
          {places.map((place: Place)=>(
            <PlaceWrapper key={place.id}>
              <PlaceImage src={place.imageUrl} alt='장소'/>
              <Title>{place.name}</Title>
              <Description>{place.description}</Description>
            </PlaceWrapper>
          ))}
        </PlaceContainer>
        <SelectButton onClick={handleClose}>저장하기</SelectButton>
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
  padding: 20px 30px;

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
  border: 2px dashed #676767;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;

  cursor: pointer;
`

const PlaceImage = styled.img`
  margin-top: 25px;
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
  text-overflow: ellipsis;

  margin-top: 6px;
  width: 200px;
`