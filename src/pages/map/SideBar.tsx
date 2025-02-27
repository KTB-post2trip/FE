import { useRef, useEffect, useState } from "react";
import { SidebarWrapper, Edge, Content, Days } from "./KakaoMap.style";
import EdgeBar from "../../components/map/EdgeBar";
import SelectPlace from "../../components/map/SelectPlace";
import SelectDays from "../../components/map/SelectDays";
import CountDays from "../../components/map/CountDays";
import styled from "styled-components";

const MIN_WIDTH = 200;
const MAX_WIDTH = 800;
const INITIAL_WIDTH = 600;

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INITIAL_WIDTH);
  const resizingRef = useRef(false);
  const [showSelectDays, setShowSelectDays] = useState(false);

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
      if (!resizingRef.current) return;

      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startWidth + deltaX)
      );

      requestAnimationFrame(() => {
        setWidth(newWidth);
        target.style.width = `${newWidth}px`;
      });
    };

    const stopResize = () => {
      resizingRef.current = false;
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    resizingRef.current = true;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize, { once: true });

    e.preventDefault();
  };

  return (
    <SidebarWrapper
      ref={sidebarRef}
      style={{ width: `${width}px`, maxWidth: `${MAX_WIDTH}px` }}
    >
      <Edge onMouseDown={dragHandler}>
        <EdgeBar />
      </Edge>
      <Content>
        <SelectPlace />
        <SectionDivider />
        <Days>
          {!showSelectDays ? (
            <CountDays onCreate={() => setShowSelectDays(true)} />
          ) : (
            <SelectDays />
          )}
        </Days>
      </Content>
    </SidebarWrapper>
  );
};

export default Sidebar;

const SectionDivider = styled.div`
  width: 1px;
  height: 100%;
  border-left: 2px dashed gray;
  margin: 0 10px;
`;
