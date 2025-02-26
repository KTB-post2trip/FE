import styled from "styled-components";

export default function SelectPlace() {
  return (
    <Main>
      <Title>장소</Title>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.p`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
`;
