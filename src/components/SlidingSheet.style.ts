import styled from "styled-components";

export const SheetContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100vh;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-out;
  z-index: 100;
`;

export const Handle = styled.div`
  width: 40px;
  height: 60px;
  background: #4285f4;
  border-radius: 20px;
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const Button = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 15px;
  background: #4285f4;
  /* color: white; */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 101;
`;

export const Content = styled.div`
  padding: 20px;
  font-size: 16px;
  color: black;
`;
