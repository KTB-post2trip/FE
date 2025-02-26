import styled from "styled-components";

export default function SelectDays() {
  return (
    <Main>
      <Title>1일차</Title>
    </Main>
  );
}

const Main = styled.div`
  width: 100%;
  height: 100%;
  background-color: blue;
`;

const Title = styled.p`
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  padding: 20px;
`;
