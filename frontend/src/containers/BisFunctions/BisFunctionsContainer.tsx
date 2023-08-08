import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';

import BisFunctionContainer from '../../components/BisFunction/BisFunctionContainer';
import { VerticalGrid } from '../../components/Utils/VerticalGrid';
import { BisFunctionDto } from '../../store/bis-function.types';
import { AppState } from '../../store/reducer';

type Props = {
  bisFunctions: BisFunctionDto[]
}

const BisFunctionsContainer: FC<Props> = ({bisFunctions}) => {
  return <VerticalGrid>
    {bisFunctions.map(bisFunction => <BisFunctionContainer bisFunction={bisFunction} key={bisFunction.id} />)}
  </VerticalGrid>;
};

export default BisFunctionsContainer;
