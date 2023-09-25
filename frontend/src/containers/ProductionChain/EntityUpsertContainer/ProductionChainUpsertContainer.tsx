import React, { FC, useCallback } from "react";
import * as joi from "joi";

import { ProductionChain } from "../../../store/types";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppState } from "../../../store/reducer";
import { Card } from "../../../components/Utils/Card";
import ProductionChainUpsertComponent from "./ProductionChainUpsert";
import { ProductionChainUpsert } from "../../../store/actions";
import { ProductionChainEditDto, ProductionChainUpsertDto } from "../types";
import * as _ from "lodash";
import { omitByRecursively } from "../../../utils";

function validateValuesWithSettings<
  T extends Record<
    string,
    {
      label: string;
      validate: joi.Schema;
    }
  >
>(values: any, settings: T) {
  const errors: any = {};
  for (const [fieldName, fieldValue] of Object.entries(settings)) {
    const value = values[fieldName as keyof any];
    if (!value) {
      console.warn(
        `Value for configured ${fieldName} validation is not found, probably some misconfiguration with names in code`
      );
    }

    const validationResult = fieldValue.validate.validate(value);

    if (validationResult.error) {
      errors[fieldName] = validationResult.error?.details
        .map((x) => x.message)
        .join(", ");
    }
  }

  if (Object.keys(errors).length === 0) return null;

  return errors;
}

function validateNoDuplicates(
  arrData: _.Dictionary<any[]>,
  errorsArr: any,
  msg: string
) {
  Object.values(arrData).forEach((x) => {
    if (errorsArr[errorsArr.length - 1] === undefined) errorsArr.push({});

    if (x.length > 1) errorsArr[errorsArr.length - 1].id = msg;
  });
}

export const productionChainValidationSettings = {
  name: {
    label: "Name",
    validate: joi.string().required().max(20),
  },
  productId: {
    label: "Product",
    validate: joi.string().required(),
  },
};

export const equipmentRelValidationSettings = {
  id: {
    label: "Id",
    validate: joi.string().required(),
  },
  amount: {
    label: "Amount",
    validate: joi.number().required().max(100),
  },
};

export const userRelValidationSettings = {
  id: {
    label: "Id",
    validate: joi.string().required(),
  },
};

export const resourceRelValidationSettings = {
  id: {
    label: "Id",
    validate: joi.string().required(),
  },
  amount: {
    label: "Amount",
    validate: joi.number().required().max(100),
  },
};

export const productionChainToEdit = (
  productionChain: ProductionChain
): ProductionChainEditDto => {
  return {
    name: productionChain.name,
    productId: productionChain.productId,
    equipments: productionChain.prodChainEquipments.map((x) => ({
      id: x.equipmentId,
      amount: x.amount,
    })),
    resources: productionChain.prodChainResources.map((x) => ({
      id: x.resourceId,
      amount: x.amount,
    })),
    users: productionChain.prodChainUsers.map((x) => ({
      id: x.userId,
    })),
  };
};

type Props = {
  productionChain: ProductionChain;
  onSubmitCallback?: () => void;
};

const ProductionChainUpsertContainer: FC<Props> = ({
  productionChain,
  onSubmitCallback,
}) => {
  const dispatch = useDispatch();
  const entities = useSelector((state: AppState) => state.entites);

  const onValidate = useCallback((values: ProductionChainEditDto) => {
    let formErrors = {
      name: undefined,
      productId: undefined,
      equipments: [] as { id: string; amount: string }[],
      resources: [] as { id: string; amount: string }[],
      users: [] as { id: string }[],
    };

    if (productionChainValidationSettings) {
      const errors = validateValuesWithSettings(
        values,
        productionChainValidationSettings
      );

      if (errors !== null)
        formErrors = {
          ...formErrors,
          ...errors,
        };
    }

    for (let e = 0; e < values.equipments.length; e++) {
      const equipment = values.equipments[e];
      const errors = validateValuesWithSettings(
        equipment,
        resourceRelValidationSettings
      );

      if (errors !== null) formErrors.equipments[e] = errors;
    }

    validateNoDuplicates(
      _.groupBy(values.equipments, "id"),
      formErrors.equipments,
      "One equipment can be assigned only once"
    );

    for (let r = 0; r < values.resources.length; r++) {
      const resource = values.resources[r];
      const errors = validateValuesWithSettings(
        resource,
        resourceRelValidationSettings
      );

      if (errors !== null) formErrors.resources[r] = errors;
    }

    validateNoDuplicates(
      _.groupBy(values.resources, "id"),
      formErrors.resources,
      "One resource can be assigned only once"
    );

    for (let u = 0; u < values.users.length; u++) {
      const user = values.users[u];
      const errors = validateValuesWithSettings(
        user,
        userRelValidationSettings
      );

      if (errors !== null) formErrors.users[u] = errors;
    }

    validateNoDuplicates(
      _.groupBy(values.users, "id"),
      formErrors.users,
      "One user can be assigned only once"
    );

    console.log("@formErrors");
    console.log(formErrors);
    if (
      formErrors.name === undefined &&
      formErrors.productId === undefined &&
      !formErrors.equipments.find((x) => Object.keys(x).length > 0) &&
      !formErrors.resources.find((x) => Object.keys(x).length > 0) &&
      !formErrors.users.find((x) => Object.keys(x).length > 0)
    ) {
      return {};
    }

    return formErrors;
  }, []);

  const onSubmit = useCallback(
    (values: ProductionChainEditDto) => {
      dispatch<ProductionChainUpsert>({
        type: "PRODUCTION_CHAIN_UPSERT",
        payload: {
          ...values,
          name: productionChain.name,
        } as ProductionChainUpsertDto,
      });

      if (onSubmitCallback) onSubmitCallback();
    },
    [dispatch, onSubmitCallback, productionChain.name]
  );

  console.log("@productionChain");
  console.log(productionChain);

  let productionChainEdit = productionChainToEdit(productionChain);

  if (!productionChainEdit) {
    return (
      <Card>No transformer for edit mode for this method is implemented</Card>
    );
  }

  if (!entities) {
    return (
      <Card>Entities are not loaded, can't render a component properly</Card>
    );
  }

  return (
    <div>
      <ProductionChainUpsertComponent
        productionChainEdit={productionChainEdit}
        entities={entities}
        onValidate={onValidate as any}
        onSubmit={onSubmit}
        isEdit={true}
      />
    </div>
  );
};

export default ProductionChainUpsertContainer;
