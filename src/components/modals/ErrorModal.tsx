import React from 'react';
import styled from 'styled-components';

interface ErrorModalProps {
  onClose: () => boolean;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose }) => {
  const handleClose = (): void => {
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Emotion src='Errorimo.png'/>
        <Message>
          하루에 최소 4개의 장소가 필요합니다
          <p>추가로 선택해주세요!</p>
          </Message>
        <OKBtn onClick={handleClose}>확인</OKBtn>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ErrorModal;

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
  max-width: 700px;
  height: 90%;
  max-height: 360px;
  /* padding: 20px 30px; */
  background: white;
  border-radius: 12px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const Emotion = styled.img`
  width: 45px;
  height: 45px;
  margin-top: 50px;
`;

const Message = styled.div`
  margin: 20px 0;
  color: #000;
  text-align: center;
  font-family: "Pretendard Variable";
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  p{
    color: var(--Grey2, #606060);
    text-align: center;
    font-family: "Pretendard Variable";
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
`;

const OKBtn = styled.button`
  width: 160px;
  height: 64px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;

  border-radius: 12px;
  border: 1.3px solid rgba(215, 226, 255, 0.08);
  background: #3071F2;
  backdrop-filter: blur(10px);
  cursor: pointer;

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
