import React, { FC, useCallback, useEffect } from 'react';
import * as joi from 'joi';

import { BisFunctionDto, BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT, BisFunctionDto_SELL_PRODUCT_FIXED, BisFunctionEditDto, BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT, BisFunctionEditDto_SELL_PRODUCT_FIXED, BisFunctionSettings, BisFunctionToEditTransform, BisFunctionType } from '../../store/bis-function.types';
import BisFunction from './BisFunction';
import { CreateErrorObject } from '../../store/types';
import { useDispatch } from 'react-redux';
import { BisFunctionUpsert } from '../../store/actions';
import { Card } from '../Utils/Card';

export const bisFunctionGeneralSettings = {
  name: {
    label: 'Name',
    validate: joi.string().required(),
  },
  type: {
    label: 'Type',
    validate: joi.string().required(),
  },
  startPeriod: {
    label: 'Start period',
    validate: joi.number().required(),
  },
  endPeriod: {
    label: 'End period',
    validate: joi.number().optional(),
  },
};

export const bisFunctionsSettings: BisFunctionSettings = {
  [BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT]: {
    customValidation: undefined,
    fields: {
      amount: {
        label: 'Payout amount, that will be paid out each period:',
        validate: joi.number().min(1).max(10000).required(),
        default: 10,
      },
      creditId: {
        label: 'The credit to pay out:',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.SELL_PRODUCT_FIXED]: {
    customValidation: undefined,
    fields: {
      amount: {
        label: 'Amount to sell:',
        validate: joi.number().min(1).max(10000).required(),
        default: 0,
      },
      productId: {
        label: 'The product to sell:',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE]: undefined,
  [BisFunctionType.BUY_RESOURCE_PRODUCT_FIXED_AMOUNT]: undefined
};

export const bisFunctionsToEditTransform = (bisFunction: BisFunctionDto) => {
  switch (bisFunction.type) {
    case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
      const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT = bisFunction as BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      return {
        id: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.id,
        name: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.name,
        type: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.type,
        amount: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount,
        creditId: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.credit.id,
        startPeriod: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.startPeriod,
        endPeriod: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.endPeriod,
      } as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
  
      case BisFunctionType.SELL_PRODUCT_FIXED:
        const bisFunction_SELL_PRODUCT_FIXED = bisFunction as BisFunctionDto_SELL_PRODUCT_FIXED;
        return {
          id: bisFunction_SELL_PRODUCT_FIXED.id,
          name: bisFunction_SELL_PRODUCT_FIXED.name,
          type: bisFunction_SELL_PRODUCT_FIXED.type,
          amount: bisFunction_SELL_PRODUCT_FIXED.amount,
          productId: bisFunction_SELL_PRODUCT_FIXED.product.id,
          startPeriod: bisFunction_SELL_PRODUCT_FIXED.startPeriod,
          endPeriod: bisFunction_SELL_PRODUCT_FIXED.endPeriod,
        } as BisFunctionEditDto_SELL_PRODUCT_FIXED;
    
    default:
      break;
  }
}

export const bisFunctionsSubmitPreProcess = (bisFunction: BisFunctionEditDto) => {
  switch (bisFunction.type) {
    case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
      const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT = bisFunction as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount = Number(bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount);
      return bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT;
  
      case BisFunctionType.SELL_PRODUCT_FIXED:
        const bisFunction_SELL_PRODUCT_FIXED = bisFunction as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
        bisFunction_SELL_PRODUCT_FIXED.amount = Number(bisFunction_SELL_PRODUCT_FIXED.amount);
        return bisFunction_SELL_PRODUCT_FIXED;
    
    default:
      break;
  }

  return bisFunction;
}

type Props = {
  mode: 'edit' | 'create';
  bisFunction: BisFunctionDto;
};

const BisFunctionContainer: FC<Props> = (params) => {
  // Convert bisFunction into bisFunctionUpsert
  const dispatch = useDispatch();

  const onBisFunctionValidate = useCallback((values: BisFunctionEditDto) => {
    let formErrors: CreateErrorObject<BisFunctionEditDto> = {};
    const validationSettingsFields = bisFunctionsSettings[values.type]?.fields;

    if(validationSettingsFields) {
      for (const [fieldName, fieldValue] of Object.entries(validationSettingsFields)) {
        const value = values[fieldName as keyof BisFunctionEditDto];
        if(!value) {
          console.warn(`Value for configured ${fieldName} validation is not found, probably some misconfiguration with names in code`);
        }

        const validationResult = fieldValue.validate.validate(value);

        if(validationResult.error) {
          formErrors[fieldName as keyof CreateErrorObject<BisFunctionEditDto>] = validationResult.error?.details.map(x => x.message).join(', ')
        }
      }
    }

    return formErrors;
  }, []);

  const onBisFunctionSubmit = useCallback((values: BisFunctionEditDto) => {
    console.log('@values');
    console.log(JSON.stringify(values, null, 2));
    const preProcessedValues = bisFunctionsSubmitPreProcess(values);

    console.log('@preProcessedValues');
    console.log(JSON.stringify(preProcessedValues, null, 2));

    dispatch<BisFunctionUpsert>({ type: 'BIS_FUNCTION_UPSERT', payload: preProcessedValues });
  }, [dispatch]);

  const bisFunctionEditDto = bisFunctionsToEditTransform(params.bisFunction);

  if(!bisFunctionEditDto) {
    return <Card>No transformer for edit mode for this method is implemented</Card>
  }

  return <BisFunction
    mode={params.mode}
    bisFunction={params.bisFunction}
    bisFunctionEdit={bisFunctionEditDto}
    onValidate={onBisFunctionValidate}
    onSubmit={onBisFunctionSubmit}
  />;
};

export default BisFunctionContainer;
