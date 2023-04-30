import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const PageStyled = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  display: grid;
  background: #f6f8fc;
`;

const Page = ({ children }: Props) => <PageStyled>{children}</PageStyled>;

export default Page;
