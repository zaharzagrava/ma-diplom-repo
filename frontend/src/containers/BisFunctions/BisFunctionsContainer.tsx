import React, { FC, useEffect } from 'react';

import BisFunction from '../../components/BisFunction/BisFunction';
import { BisFunctionDto } from '../../store/bis-function.types';

type Props = {
  bisFunctions: BisFunctionDto[]
}

const BisFunctionsContainer: FC<Props> = ({bisFunctions}) => {
  return <>{bisFunctions.map(bisFunction => <BisFunction bisFunction={bisFunction} key={bisFunction.id} />)}</>;
};

export default BisFunctionsContainer;
