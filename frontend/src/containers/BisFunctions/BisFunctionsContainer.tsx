import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { styled } from 'styled-components';

import BisFunctionContainer from '../../components/BisFunction/BisFunctionContainer';
import { BisFunctionDto } from '../../store/bis-function.types';
import { AppState } from '../../store/reducer';

type Props = {
  bisFunctions: BisFunctionDto[]
}

export const VerticalGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(1000px, 1fr));
  gap: 10px;
`;

const BisFunctionsContainer: FC<Props> = ({bisFunctions}) => {
  return <VerticalGrid>
    {bisFunctions.map(bisFunction => <BisFunctionContainer bisFunction={bisFunction} key={bisFunction.id} />)}
  </VerticalGrid>;
};

export default BisFunctionsContainer;
