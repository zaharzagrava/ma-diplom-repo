import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface Props {
  value: string;
}

const Container = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: auto 1fr;
  grid-auto-flow: row;

  align-items: center;
  margin: 5px 0px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
`;

const FormStringMock: FunctionComponent<Props> = ({
  value
}: Props) => {
  return (
    <Container>
      <InputContainer>
        <p
          style={{
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            paddingBottom: 5,
            fontSize: 16,
          }}
        >{value}</p>
      </InputContainer>
    </Container>
  );
};

FormStringMock.defaultProps = {
};

export default FormStringMock;
