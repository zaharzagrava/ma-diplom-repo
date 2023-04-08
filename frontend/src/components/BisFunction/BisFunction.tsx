import React, { FC, useEffect } from 'react';

import BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT from './BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT/BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT';
import { BisFunctionDto, BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT, BisFunctionType } from '../../store/bis-function.types';

type Props = {
  bisFunction: BisFunctionDto;
}

const BisFunction: FC<Props> = ({bisFunction}) => {

  switch (bisFunction.type) {
    case BisFunctionType.BUY_RESOURCE_PRODUCT_FIXED_AMOUNT:
      // eslint-disable-next-line
      return <BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT bisFunction={bisFunction as BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT}/>
  
    default:
      break;
  }

  return (
    <h1>Bis Function</h1>
  );
};

export default BisFunction;
