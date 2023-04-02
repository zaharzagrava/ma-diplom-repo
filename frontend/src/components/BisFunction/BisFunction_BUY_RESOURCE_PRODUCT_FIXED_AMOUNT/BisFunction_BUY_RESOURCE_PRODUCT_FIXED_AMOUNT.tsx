import React, { FC } from 'react';
import { BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT } from '../../../store/bis-function.types';

type Props = {
  bisFunction: BisFunctionDto_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT;
}

const BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT: FC<Props> = ({bisFunction}) => {
  return (
    <div>BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT</div>
  );
};

export default BisFunction_BUY_RESOURCE_PRODUCT_FIXED_AMOUNT;
