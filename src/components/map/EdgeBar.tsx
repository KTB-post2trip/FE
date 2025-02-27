import { FaGripLinesVertical } from "react-icons/fa6";
import styled from "styled-components";

export default function EdgeBar() {
  return (
    <Main>
      <LineIcon />
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LineIcon = styled(FaGripLinesVertical)`
  width: 10px;
  height: 30px;
  color: gray;
  margin: 0 8px;
`;
