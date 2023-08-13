import React, { FC, useCallback, useEffect } from "react";
import * as joi from "joi";

import {
  BisFunctionChangeOrderDto,
  BisFunctionDto,
  BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionDto_FIRE_EMPLOYEE,
  BisFunctionDto_HIRE_EMPLOYEE,
  BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunctionDto_PAYOUT_SALARIES,
  BisFunctionDto_PRODUCE_PRODUCTS,
  BisFunctionDto_SELL_PRODUCT_FIXED,
  BisFunctionDto_TAKE_CREDIT,
  BisFunctionEditDto,
  BisFunctionEditDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionEditDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT,
  BisFunctionEditDto_FIRE_EMPLOYEE,
  BisFunctionEditDto_HIRE_EMPLOYEE,
  BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT,
  BisFunctionEditDto_PAYOUT_SALARIES,
  BisFunctionEditDto_PRODUCE_PRODUCTS,
  BisFunctionEditDto_SELL_PRODUCT_FIXED,
  BisFunctionEditDto_TAKE_CREDIT,
  BisFunctionSettings,
  BisFunctionToEditTransform,
  BisFunctionType,
  FormFieldType,
} from "../../store/bis-function.types";
import BisFunction from "./BisFunction";
import { CreateErrorObject } from "../../store/types";
import { useDispatch } from "react-redux";
import { BisFunctionDelete, BisFunctionOrderChange, BisFunctionUpsert } from "../../store/actions";
import { Card } from "../Utils/Card";
import { useSelector } from "react-redux";
import { AppState } from "../../store/reducer";
import { DateTime } from "luxon";
import OrderChanger from "./OrderChanger";

export const bisFunctionGeneralSettings = {
  name: {
    label: "Name",
    validate: joi.string().required(),
  },
  type: {
    label: "Type",
    validate: joi.string().required(),
  },
  startPeriod: {
    label: "Start period",
    validate: joi.number().required(),
  },
  endPeriod: {
    label: "End period",
    validate: joi.number().optional(),
  },
};

export const bisFunctionsSettings: BisFunctionSettings = {
  [BisFunctionType.TAKE_CREDIT]: {
    customValidation: undefined,
    fields: {
      creditId: {
        type: FormFieldType.DROPDOWN,
        label: "The credit to take:",
        placeholder: 'Choose credit',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT]: {
    customValidation: undefined,
    fields: {
      amount: {
        type: FormFieldType.STRING,
        label: "Payout amount, that will be paid out each period:",
        validate: joi.number().min(1).max(10000).required(),
        default: 10,
      },
      creditId: {
        type: FormFieldType.DROPDOWN,
        label: "The credit to pay out:",
        placeholder: 'Choose credit',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.HIRE_EMPLOYEE]: {
    customValidation: undefined,
    fields: {
      userId: {
        type: FormFieldType.DROPDOWN,
        label: "The user to employ:",
        placeholder: 'Choose employee',
        validate: joi.string().required(),
        default: null,
      },
      productionChainId: {
        type: FormFieldType.DROPDOWN,
        label: "On which production chain to employ:",
        placeholder: 'Choose production chain',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.FIRE_EMPLOYEE]: {
    customValidation: undefined,
    fields: {
      userId: {
        type: FormFieldType.DROPDOWN,
        label: "The user to fire:",
        placeholder: 'Choose employee',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.PAYOUT_SALARIES]: {
    customValidation: undefined,
    fields: { },
  },
  [BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT]: {
    customValidation: undefined,
    fields: {
      productionChainId: {
        type: FormFieldType.DROPDOWN,
        label: "The product chain for which to buy resources:",
        placeholder: 'Choose product',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT]: {
    customValidation: undefined,
    fields: {
      productionChainId: {
        type: FormFieldType.DROPDOWN,
        label: "The product chain for which to buy equipment:",
        placeholder: 'Choose product',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.PRODUCE_PRODUCTS]: {
    customValidation: undefined,
    fields: {
      productionChainId: {
        type: FormFieldType.DROPDOWN,
        label: "The production chain which to use to product:",
        placeholder: 'Choose production chain',
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.SELL_PRODUCT_FIXED]: {
    customValidation: undefined,
    fields: {
      amount: {
        type: FormFieldType.STRING,
        label: "Amount to sell:",
        validate: joi.number().min(1).max(10000).required(),
        default: 0,
      },
      productId: {
        type: FormFieldType.DROPDOWN,
        label: "The product to sell:",
        validate: joi.string().required(),
        default: null,
      },
    },
  },
  [BisFunctionType.CHANGE_PRODUCT_RESOURCE_EQUIPMENT_PRICE]: undefined,
};

export const bisFunctionsToEditTransform = (bisFunction: BisFunctionDto | BisFunctionType): BisFunctionEditDto | null => {
  const isEdit = typeof bisFunction === 'object';

  const createParams = {
    id: undefined,
    name: undefined,
    type: bisFunction,
    amount: undefined,
    creditId: undefined,
    startPeriod: Number(DateTime.now().toFormat('yyyyMM')),
    endPeriod: Number(DateTime.now().toFormat('yyyyMM')),
  };

  let editParams;
  if(isEdit) {
    editParams = {
      id: bisFunction.id,
      name: bisFunction.name,
      type: bisFunction.type,
      startPeriod: bisFunction.startPeriod,
      endPeriod: bisFunction.endPeriod,
    }
  }

  switch (typeof bisFunction === 'object' ? bisFunction.type : bisFunction) {
    case BisFunctionType.TAKE_CREDIT:
      if(!isEdit) {
        return {
          ...createParams,
          creditId: undefined
        } as BisFunctionEditDto_TAKE_CREDIT;
      }

      const bisFunction_TAKE_CREDIT =
        bisFunction as BisFunctionDto_TAKE_CREDIT;
      return {
        ...editParams,
        creditId: bisFunction_TAKE_CREDIT.credit.id,
      } as BisFunctionEditDto_TAKE_CREDIT;

    case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
      if(!isEdit) {
        return {
          ...createParams,
        } as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      }

      const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT =
        bisFunction as BisFunctionDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      return {
        id: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.id,
        name: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.name,
        type: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.type,
        amount: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount,
        creditId: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.credit.id,
        startPeriod: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.startPeriod,
        endPeriod: bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.endPeriod,
      } as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;

    case BisFunctionType.HIRE_EMPLOYEE:
      if(!isEdit) {
        return {
          ...createParams,
          userId: undefined
        } as BisFunctionEditDto_HIRE_EMPLOYEE;
      }

      const bisFunction_HIRE_EMPLOYEE =
        bisFunction as BisFunctionDto_HIRE_EMPLOYEE;
      return {
        ...editParams,
        userId: bisFunction_HIRE_EMPLOYEE.user.id,
      } as BisFunctionEditDto_HIRE_EMPLOYEE;

    case BisFunctionType.FIRE_EMPLOYEE:
      if(!isEdit) {
        return {
          ...createParams,
          userId: undefined
        } as BisFunctionEditDto_FIRE_EMPLOYEE;
      }

      const bisFunction_FIRE_EMPLOYEE =
        bisFunction as BisFunctionDto_FIRE_EMPLOYEE;
      return {
        ...editParams,
        userId: bisFunction_FIRE_EMPLOYEE.user.id,
      } as BisFunctionEditDto_FIRE_EMPLOYEE;

    case BisFunctionType.PAYOUT_SALARIES:
      if(!isEdit) {
        return {...createParams} as BisFunctionEditDto_PAYOUT_SALARIES;
      }

      return { ...editParams, } as BisFunctionEditDto_PAYOUT_SALARIES;

    case BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT:
      if(!isEdit) {
        return {
          ...createParams,
          amount: undefined,
          productId: undefined,
        } as BisFunctionEditDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT;
      }

      const bisFunction_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT =
        bisFunction as BisFunctionDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT;

      return {
        ...editParams,
        amount: bisFunction_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT.amount,
        productionChainId: bisFunction_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT.productionChain.id,
      } as BisFunctionEditDto_BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT;

    case BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT:
      if(!isEdit) {
        return {
          ...createParams,
          amount: undefined,
          productId: undefined,
        } as BisFunctionEditDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT;
      }

      const bisFunction_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT =
        bisFunction as BisFunctionDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT;
      return {
        ...editParams,
        amount: bisFunction_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT.amount,
        productionChainId: bisFunction_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT.productionChain.id,
      } as BisFunctionEditDto_BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT;

    case BisFunctionType.PRODUCE_PRODUCTS:
      if(!isEdit) {
        return {
          ...createParams,
          productionChainId: undefined,
        } as BisFunctionEditDto_PRODUCE_PRODUCTS;
      }

      const bisFunction_PRODUCE_PRODUCTS =
        bisFunction as BisFunctionDto_PRODUCE_PRODUCTS;
      return {
        ...editParams,
        productionChainId: bisFunction_PRODUCE_PRODUCTS.productionChain.id,
      } as BisFunctionEditDto_PRODUCE_PRODUCTS;

    case BisFunctionType.SELL_PRODUCT_FIXED:
      if(!isEdit) {
        return {
          ...createParams,
        } as BisFunctionEditDto_SELL_PRODUCT_FIXED;
      }

      const bisFunction_SELL_PRODUCT_FIXED =
        bisFunction as BisFunctionDto_SELL_PRODUCT_FIXED;
      return {
        ...editParams,
        amount: bisFunction_SELL_PRODUCT_FIXED.amount,
        productId: bisFunction_SELL_PRODUCT_FIXED.product.id,
      } as BisFunctionEditDto_SELL_PRODUCT_FIXED;

    default:
      return null;
  }
};

export const bisFunctionsToUpsertTransform = (
  bisFunction: BisFunctionEditDto
) => {
  switch (bisFunction.type) {
    case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
      const bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT =
        bisFunction as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount = Number(
        bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT.amount
      );
      return bisFunction_PAYOUT_CREDIT_FIXED_AMOUNT;

    case BisFunctionType.SELL_PRODUCT_FIXED:
      const bisFunction_SELL_PRODUCT_FIXED =
        bisFunction as BisFunctionEditDto_PAYOUT_CREDIT_FIXED_AMOUNT;
      bisFunction_SELL_PRODUCT_FIXED.amount = Number(
        bisFunction_SELL_PRODUCT_FIXED.amount
      );
      return bisFunction_SELL_PRODUCT_FIXED;

    default:
      break;
  }

  return bisFunction;
};

type Props = {
  bisFunction: BisFunctionDto | BisFunctionType;
  onSubmitCallback?: () => void
};

const BisFunctionContainer: FC<Props> = ({
  bisFunction,
  onSubmitCallback
}) => {
  // Convert bisFunction into bisFunctionUpsert
  const dispatch = useDispatch();
  const entities = useSelector((state: AppState) => state.entites);

  const onBisFunctionValidate = useCallback((values: BisFunctionEditDto) => {
    let formErrors: CreateErrorObject<BisFunctionEditDto> = {};
    const validationSettingsFields = bisFunctionsSettings[values.type]?.fields;

    if (validationSettingsFields) {
      for (const [fieldName, fieldValue] of Object.entries(
        validationSettingsFields
      )) {
        const value = values[fieldName as keyof BisFunctionEditDto];
        if (!value) {
          console.warn(
            `Value for configured ${fieldName} validation is not found, probably some misconfiguration with names in code`
          );
        }

        const validationResult = fieldValue.validate.validate(value);

        if (validationResult.error) {
          formErrors[fieldName as keyof CreateErrorObject<BisFunctionEditDto>] =
            validationResult.error?.details.map((x) => x.message).join(", ");
        }
      }
    }

    return formErrors;
  }, []);

  const onBisFunctionSubmit = useCallback(
    (values: BisFunctionEditDto) => {
      const preProcessedValues = bisFunctionsToUpsertTransform(values);

      dispatch<BisFunctionUpsert>({
        type: "BIS_FUNCTION_UPSERT",
        payload: preProcessedValues,
      });

      if(onSubmitCallback) onSubmitCallback();
    },
    [dispatch, onSubmitCallback]
  );

  const onOrderChange = useCallback(
    (direction: 'up' | 'down') => {
      if(typeof bisFunction !== 'object') return;

      dispatch<BisFunctionOrderChange>({
        type: "BIS_FUNCTION_ORDER_CHANGE",
        payload: {
          dir: direction,
          name: bisFunction.name
        },
      });
    },
    [dispatch, bisFunction]
  );

  const onDelete = useCallback(
    () => {
      if(typeof bisFunction !== 'object') return;

      dispatch<BisFunctionDelete>({
        type: "BIS_FUNCTION_DELETE",
        payload: {
          name: bisFunction.name
        },
      });
    },
    [dispatch, bisFunction]
  );

  const bisFunctionEditDto = bisFunctionsToEditTransform(bisFunction);

  if (!bisFunctionEditDto) {
    return (
      <Card>No transformer for edit mode for this method is implemented</Card>
    );
  }

  if(!entities) {
    return (
      <Card>Entities are not loaded, can't render a component properly</Card>
    );
  }

  const isEdit = typeof bisFunction === "object";

  return (
    <div>
      <BisFunction
        bisFunction={bisFunction}
        bisFunctionEdit={bisFunctionEditDto}
        entities={entities}
        onValidate={onBisFunctionValidate}
        onSubmit={onBisFunctionSubmit}
        onOrderChange={onOrderChange}
        onDelete={onDelete}
        isEdit={isEdit}
      />
    </div>
  );
};

export default BisFunctionContainer;
