import { useState, useRef } from "react";
import { SheetContainer, Handle, Content } from "./SlidingSheet.style";

function SlidingSheet() {
  const [translateX, setTranslateX] = useState(-300); // 기본적으로 닫힌 상태
  const startX = useRef<number | null>(null);

  // 드래그 시작
  const handleDragStart = (clientX: number) => {
    startX.current = clientX;
  };

  // 드래그 중
  const handleDragMove = (clientX: number) => {
    if (startX.current !== null) {
      const deltaX = clientX - startX.current;
      setTranslateX(Math.min(0, Math.max(-300, translateX + deltaX)));
    }
  };

  // 드래그 종료 (자동으로 열기 or 닫기)
  const handleDragEnd = () => {
    if (translateX > -150) {
      setTranslateX(0); // 완전히 열기
    } else {
      setTranslateX(-300); // 완전히 닫기
    }
    startX.current = null;
  };

  return (
    <SheetContainer
      style={{ transform: `translateX(${translateX}px)` }}
      onMouseDown={(e) => handleDragStart(e.clientX)}
      onMouseMove={(e) => e.buttons === 1 && handleDragMove(e.clientX)}
      onMouseUp={handleDragEnd}
      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
      onTouchEnd={handleDragEnd}
    >
      <Handle />
      <Content>드래그해서 패널을 열고 닫을 수 있어요!</Content>
    </SheetContainer>
  );
}

export default SlidingSheet;
