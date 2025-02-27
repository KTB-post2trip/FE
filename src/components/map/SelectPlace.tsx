import styled from "styled-components";
import MapPlace from "../../components/MapPlace";

export default function SelectPlace() {
  return (
    <Main>
      <Title>장소</Title>
      <MapPlace />
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  width: 92%;
  font-size: 20px;
  font-weight: bold;
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
`;
