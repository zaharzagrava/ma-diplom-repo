import React, { FC } from 'react';
import { BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT } from '../../../store/bis-function.types';

type Props = {
  bisFunction: BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT;
}

const BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT: FC<Props> = ({bisFunction}) => {
  return (
    <div style={{
      border: '1px black solid',
      padding: '5px',
      margin: '5px',
    }}>
      <h3>{bisFunction.name}: (Payout Credit Fixed Amount)</h3>
      <div>Payout amount (that will be paid out each period): {bisFunction.amount}</div>
      <div>Total sum to be paid out: {bisFunction.credit.sum}</div>
      <div>Rate: {bisFunction.credit.rate}</div>
    </div>
  );
};

export default BisFunction_PAYOUT_CREDIT_FIXED_AMOUNT;


// edit
// amount, startPeriod, endPeriod + checkbox, creditId - editable
// name, type - editable
// create
// amount, startPeriod, endPeriod + checkbox, creditId - editable
// name, type - noneditable