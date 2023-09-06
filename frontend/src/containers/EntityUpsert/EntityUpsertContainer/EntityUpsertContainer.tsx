import React, { FC, useCallback } from "react";
import * as joi from "joi";

import { CreateErrorObject, FormFieldType, EntityUpsertable } from "../../../store/types";
import { useDispatch } from "react-redux";
import { BisFunctionDelete, EntityDelete, EntityUpsert } from "../../../store/actions";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/reducer";
import { CreditEditDto, EntityEditDto, EntityUpsertDto, EntityUpsertSettings, EntityUpsertType, EquipmentEditDto, ProductEditDto, ResourceEditDto, UserEditDto } from "../types";
import { Card } from "../../../components/Utils/Card";
import EntityUpsertComponent from "./EntityUpsert";

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

const priceValidation = () => ({
  type: FormFieldType.STRING,
  label: "Price:",
  placeholder: 'Price',
  validate: joi.number().min(1).max(10000).required(),
  default: null,
});

const amountValidation = () => ({
  type: FormFieldType.STRING,
  label: "Amount:",
  placeholder: 'Amount',
  validate: joi.number().min(0).max(10000).required(),
  default: null,
});

export const entityUpsertSettings: EntityUpsertSettings = {
  [EntityUpsertType.CREDIT]: {
    customValidation: undefined,
    fields: {
      name: {
        type: FormFieldType.STRING,
        label: "Name:",
        placeholder: 'Name',
        validate: joi.string().required(),
        default: null,
      },
      sum: {
        type: FormFieldType.STRING,
        label: "Sum:",
        placeholder: 'Sum',
        validate: joi.number().min(1).max(10000).integer().required(),
        default: null,
      },
      rate: {
        type: FormFieldType.STRING,
        label: "Rate:",
        placeholder: 'Rate',
        validate: joi.number().min(1).max(10000).required(),
        default: null,
      },
      startPeriod: {
        type: FormFieldType.PERIOD,
        label: "Salary:",
        placeholder: 'Salary',
        validate: joi.number(),
        default: null,
      },
    },
  },
  [EntityUpsertType.EQUIPMENT]: {
    customValidation: undefined,
    fields: {
      name: {
        type: FormFieldType.STRING,
        label: "Name:",
        placeholder: 'Name',
        validate: joi.string().required(),
        default: null,
      },
      price: priceValidation(),
      amount: amountValidation(),
    },
  },
  [EntityUpsertType.PRODUCT]: {
    customValidation: undefined,
    fields: {
      name: {
        type: FormFieldType.STRING,
        label: "Name:",
        placeholder: 'Name',
        validate: joi.string().required(),
        default: null,
      },
      price: priceValidation(),
      amount: amountValidation(),
    },
  },
  [EntityUpsertType.RESOURCE]: {
    customValidation: undefined,
    fields: {
      name: {
        type: FormFieldType.STRING,
        label: "Name:",
        placeholder: 'Name',
        validate: joi.string().required(),
        default: null,
      },
      price: priceValidation(),
      amount: amountValidation(),
    },
  },
  [EntityUpsertType.USER]: {
    customValidation: undefined,
    fields: {
      email: {
        type: FormFieldType.STRING,
        label: "Email:",
        placeholder: 'Email',
        validate: joi.string().required(),
        default: null,
      },
      fullName: {
        type: FormFieldType.STRING,
        label: "Full name:",
        placeholder: 'Full name',
        validate: joi.string().required(),
        default: null,
      },
      type: {
        type: FormFieldType.DROPDOWN,
        label: "Type:",
        placeholder: 'Type',
        validate: joi.string().required(),
        default: null,
      },
      salary: {
        type: FormFieldType.STRING,
        label: "Salary:",
        placeholder: 'Salary',
        validate: joi.number().min(1).max(10000).required(),
        default: null,
      },
      employedAt: {
        type: FormFieldType.PERIOD,
        label: "Employed At:",
        placeholder: 'Employed At',
        validate: joi.number(),
        default: null,
      },
    },
  },
};

export const entityToCreate = (entityUpsertType: EntityUpsertType): EntityEditDto => {
  switch (entityUpsertType) {
    case EntityUpsertType.USER:
      return {
        __type__: entityUpsertType,
        email: undefined,
        fullName: undefined,
        type: undefined,
        salary: undefined,
        employedAt: null,
      } satisfies UserEditDto;

    case EntityUpsertType.CREDIT:
      return {
        __type__: entityUpsertType,
        name: undefined,
        rate: undefined,
        sum: undefined,
        startPeriod: null,
      } satisfies CreditEditDto;

    case EntityUpsertType.EQUIPMENT:
      return {
        __type__: entityUpsertType,
        amount: undefined,
        name: undefined,
        price: undefined,
      } satisfies EquipmentEditDto;

    case EntityUpsertType.PRODUCT:
      return {
        __type__: entityUpsertType,
        amount: undefined,
        name: undefined,
        price: undefined,
      } satisfies ProductEditDto;

    case EntityUpsertType.RESOURCE:
      return {
        __type__: entityUpsertType,
        amount: undefined,
        name: undefined,
        price: undefined,
      } satisfies ResourceEditDto;

    // case EntityUpsertType.BUSINESS:
    //   return {
    //     __type__: entityUpsertType,
    //     name: undefined,
    //     balance: undefined,
    //   } satisfies BusinessEditDto;

    default:
      throw new Error(`No edit to upsert transformer for type ${(entityUpsertType as any).__type__}`)
  }
}

export const entityToEdit = (entityUpsert: EntityUpsertable): EntityEditDto => {
  return entityUpsert as any;
}

export const entityToUpsert = (
  entityEditDto: EntityEditDto,
): EntityUpsertDto => {
  switch (entityEditDto.__type__) {
    case EntityUpsertType.USER:
      const userEditDto: Required<UserEditDto> = entityEditDto as Required<UserEditDto>;
      return {
        ...userEditDto,
        salary: Number(userEditDto.salary)
      }

    case EntityUpsertType.CREDIT:
      const creditEditDto: Required<CreditEditDto> = entityEditDto as Required<CreditEditDto>;
      return {
        ...creditEditDto,
        rate: Number(creditEditDto.rate),
        sum: Number(creditEditDto.sum)
      }

    case EntityUpsertType.EQUIPMENT:
      const equipmentEditDto: Required<EquipmentEditDto> = entityEditDto as Required<EquipmentEditDto>;
      return {
        ...equipmentEditDto,
        price: Number(equipmentEditDto.price),
        amount: Number(equipmentEditDto.amount),
      }

    case EntityUpsertType.PRODUCT:
      const productEditDto: Required<ProductEditDto> = entityEditDto as Required<ProductEditDto>;
      return {
        ...productEditDto,
        price: Number(productEditDto.price),
        amount: Number(productEditDto.amount),
      }

    case EntityUpsertType.RESOURCE:
      const resourceEditDto: Required<ResourceEditDto> = entityEditDto as Required<ResourceEditDto>;
      return {
        ...resourceEditDto,
        price: Number(resourceEditDto.price),
        amount: Number(resourceEditDto.amount),
      }

    // case EntityUpsertType.BUSINESS:
    //   const businessEditDto: Required<BusinessEditDto> = entityEditDto as Required<BusinessEditDto>;
    //   return {
    //     ...businessEditDto,
    //     balance: Number(businessEditDto.balance),
    //   }

    default:
      throw new Error(`No edit to upsert transformer for type ${(entityEditDto as any).__type__}`)
  }
};

type Props = {
  entity: EntityUpsertable | EntityUpsertType;
  onSubmitCallback?: () => void
};

const EntityUpsertContainer: FC<Props> = ({
  entity,
  onSubmitCallback
}) => {
  // Convert entity into bisFunctionUpsert
  const dispatch = useDispatch();
  const entities = useSelector((state: AppState) => state.entites);

  const onValidate = useCallback((values: EntityEditDto) => {
    let formErrors: CreateErrorObject<EntityEditDto> = {};
    const validationSettingsFields = entityUpsertSettings[values.__type__]?.fields;

    if (validationSettingsFields) {
      for (const [fieldName, fieldValue] of Object.entries(
        validationSettingsFields
      )) {
        const value = values[fieldName as keyof EntityEditDto];
        if (!value) {
          console.warn(
            `Value for configured ${fieldName} validation is not found, probably some misconfiguration with names in code`
          );
        }

        const validationResult = fieldValue.validate.validate(value);

        if (validationResult.error) {
          formErrors[fieldName as keyof CreateErrorObject<EntityEditDto>] =
            validationResult.error?.details.map((x) => x.message).join(", ");
        }
      }
    }

    return formErrors;
  }, []);

  const onSubmit = useCallback(
    (values: EntityEditDto) => {
      const preProcessedValues = entityToUpsert(values);

      dispatch<EntityUpsert>({
        type: "ENTITY_UPSERT",
        payload: preProcessedValues,
      });

      if(onSubmitCallback) onSubmitCallback();
    },
    [dispatch, onSubmitCallback]
  );

  const onDelete = useCallback(
    () => {
      if(typeof entity !== 'object') return;

      dispatch<EntityDelete>({
        type: "ENTITY_DELETE",
        payload: {
          id: entity.id,
          __type__: entity.__type__
        }
      });
    },
    [dispatch, entity]
  );

  let entityEditDto;
  if(typeof entity === 'object') {
    entityEditDto = entityToEdit(entity);
  } else {
    entityEditDto = entityToCreate(entity);
  }

  if (!entityEditDto) {
    return (
      <Card>No transformer for edit mode for this method is implemented</Card>
    );
  }

  if(!entities) {
    return (
      <Card>Entities are not loaded, can't render a component properly</Card>
    );
  }

  const isEdit = typeof entity === "object";

  return (
    <div>
      <EntityUpsertComponent
        entityEdit={entityEditDto}
        entities={entities}
        onValidate={onValidate}
        onSubmit={onSubmit}
        onDelete={onDelete}
        isEdit={isEdit}
      />
    </div>
  );
};

export default EntityUpsertContainer;
