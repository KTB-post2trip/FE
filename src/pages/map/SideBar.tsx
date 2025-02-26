import { useRef, useEffect, useState } from "react";
import { SidebarWrapper, Edge } from "./KakaoMap.style";

const MIN_WIDTH = 200;
const MAX_WIDTH = 800;
const INITIAL_WIDTH = 400;

const Sidebar = () => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INITIAL_WIDTH);

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
      const newWidth = Math.max(
        MIN_WIDTH,
        Math.min(MAX_WIDTH, startWidth + deltaX)
      ); // 최대값 제한
      setWidth(newWidth);
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
    <SidebarWrapper ref={sidebarRef} style={{ width: `${width}px` }}>
      <Edge onMouseDown={dragHandler} />
      <div className="p-4">Sidebar Content</div>
    </SidebarWrapper>
  );
};

export default Sidebar;
