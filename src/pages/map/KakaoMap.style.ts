import styled from "styled-components";

export const Main = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
`;

export const SidebarWrapper = styled.div`
  position: relative;
  width: 400px;
  background-color: pink;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

export const MapContainer = styled.div`
  flex: 1;
  height: 100%;
  background-color: transparent;
  position: relative;
  z-index: 1;
`;

export const Edge = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 5px;
  cursor: col-resize;
  background-color: gray;
`;
