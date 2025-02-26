import { useRef, useEffect } from "react";
import styled from "styled-components";

const MIN_WIDTH = 200;
const INITIAL_WIDTH = 400;

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.width = `${INITIAL_WIDTH}px`;
    }
  }, []);

  const dragHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sidebarRef.current) return;

    const target = sidebarRef.current;
    const startX = e.clientX;
    const startWidth = target.offsetWidth;

    const resize = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(MIN_WIDTH, startWidth + deltaX);
      target.style.width = `${newWidth}px`;
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", resize);
      },
      { once: true }
    );

    e.preventDefault();
  };

  return (
    <SidebarWrapper ref={sidebarRef}>
      <Edge onMouseDown={dragHandler} />
      <div className="p-4">Sidebar Content</div>
    </SidebarWrapper>
  );
};

const MapContainer = () => {
  return (
    <Main>
      <MapArea>Map Here</MapArea>
      <Sidebar />
    </Main>
  );
};

export default MapContainer;

const Main = styled.div`
  position: relative;
  width: 400px;
  height: 100vh;
  z-index: 100;
`;

const MapArea = styled.div`
  width: 100%;
  height: 100%;
`;

const SidebarWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: pink;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

const Edge = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 100%;
  width: 5px;
  cursor: col-resize;
  background-color: gray;
`;
