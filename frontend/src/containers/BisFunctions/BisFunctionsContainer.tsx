import React, { FC, useEffect } from 'react';

import BisFunctionContainer from '../../components/BisFunction/BisFunctionContainer';
import { BisFunctionDto } from '../../store/bis-function.types';

type Props = {
  bisFunctions: BisFunctionDto[]
}

const BisFunctionsContainer: FC<Props> = ({bisFunctions}) => {
  return <>{bisFunctions.map(bisFunction => <BisFunctionContainer mode='edit' bisFunction={bisFunction} key={bisFunction.id} />)}</>;
};

export default BisFunctionsContainer;
