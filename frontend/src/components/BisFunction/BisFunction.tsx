import { Formik, FormikProps } from "formik";
import Joi from "joi";
import React, { FC } from "react";
import styled from "styled-components";

import {
  BisFunctionDto,
  BisFunctionEditDto,
  BisFunctionSettings,
  BisFunctionType,
  bisFunctionTypes,
} from "../../store/bis-function.types";
import { Entities, FormFieldType } from "../../store/types";
import Button from "../Button/Button";
import FormDatepicker from "../Form/FormDatePicker/FormDatePicker";
import { FormDropdown } from "../Form/FormDropdown/FormDropdown";
import FormStringField from "../Form/FormStringField/FormStringField";
import { Card } from "../Utils/Card";
import { bisFunctionsSettings } from "./BisFunctionContainer";
import OrderChanger from "./OrderChanger";

export const HorizontalGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 120px 300px 300px 250px 250px 100px;

  align-items: center;
`;

type Props = {
  /**
   * We maintain two separate objects, since they store somewhat different data
   *
   * bisFunction stores latest snapshot of the bisFunction from the BE
   * bisFunctionEdit stores the data for the /api/bis-function/upsert method
   *
   * If bisFunction is undefined - we consider that this object is only created (for 'create' mode)
   *
   * Combining data from both of them, we render the editable component
   */
  bisFunction: BisFunctionDto | BisFunctionType; // if bisFunction is undefined - then 'create' mode
  bisFunctionEdit: BisFunctionEditDto;
  isEdit?: boolean; // helper property

  entities: Entities;

  onValidate: (values: BisFunctionEditDto) => any;
  onSubmit: (values: BisFunctionEditDto) => void;
  onDelete: () => void;
  onOrderChange: (direction: 'up' | 'down') => void;
};

export const FormComponent: FC<{
  name: string;
  value: {
    type: FormFieldType;
    label: string;
    validate: Joi.AnySchema<any>;
    default: any;
    placeholder?: string;
  };
  bisFunctionEdit: BisFunctionEditDto;
  entities: Entities;
}> = (params) => {
  let formComponent;
  if (params.value.type === FormFieldType.STRING) {
    formComponent = (
      <FormStringField
        name={params.name}
        placeholder={params.value.default}
        label={params.value.label}
      />
    );
    // FormFieldType.DROPDOWN
  } else {
    let filteredEntities;
    try {
      filteredEntities = (() => {
        switch (params.bisFunctionEdit.type) {
          case BisFunctionType.HIRE_EMPLOYEE:
            if(params.name === 'userId') {
              return params.entities.users;
            } else {
              return params.entities.productionChains;
            }

          case BisFunctionType.FIRE_EMPLOYEE:
            return params.entities.users;
          case BisFunctionType.SELL_PRODUCT_FIXED:
          case BisFunctionType.BUY_RESOURCE_FOR_PRODUCT_FIXED_AMOUNT:
          case BisFunctionType.BUY_EQUIPMENT_FOR_PRODUCT_FIXED_AMOUNT:
            return params.entities.products;
          case BisFunctionType.PRODUCE_PRODUCTS:
            return params.entities.productionChains;
          case BisFunctionType.TAKE_CREDIT:
          case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
            return params.entities.credits;

          default:
            throw new Error(
              `No dropdown handler of ${params.bisFunctionEdit.type} type`
            );
        }
      })();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unkown error";
      return <Card>{errorMsg}</Card>;
    }

    formComponent = (
      <FormDropdown
        name={params.name}
        placeholder={params.value.placeholder}
        label={params.value.label}
        labelDirection="column"
        options={filteredEntities.map((x) => x.id)}
        labels={filteredEntities.map((x: any) => x.name || x.fullName)}
      />
    );
  }

  return formComponent;
};

const BisFunction: FC<Props> = (params) => {
  const bisFunctionSettings =
    bisFunctionsSettings[
      params.bisFunctionEdit.type as keyof BisFunctionSettings
    ];

  if (!bisFunctionSettings)
    return (
      <Card>Error: No renderer for type {params.bisFunctionEdit.type}</Card>
    );

  return (
    <Card>
      <Formik
        initialValues={params.bisFunctionEdit}
        enableReinitialize={true}
        validate={params.onValidate}
        onSubmit={params.onSubmit}
      >
        {({ handleSubmit }: FormikProps<BisFunctionEditDto>) => (
          <div>
            <HorizontalGrid>
              {params.isEdit && <OrderChanger onOrderChange={params.onOrderChange} />}
              {params.isEdit ? (
                <h2>
                  {typeof params.bisFunction === "object" &&
                    params.bisFunction.name}
                </h2>
              ) : (
                <FormStringField
                  name={"name"}
                  placeholder={"Function name"}
                />
              )}
              <FormDropdown
                name="type"
                placeholder="Function type"
                defaultValue={bisFunctionTypes[0].type}
                options={bisFunctionTypes.map((x) => x.type)}
                labels={bisFunctionTypes.map((x) => x.label)}
                editable={!params.isEdit}
                resetOnChoose={true}
              />
              <FormDatepicker name={"startPeriod"} />
              <FormDatepicker name={"endPeriod"} />
              <Button
                buttonType="submit"
                onClick={() => handleSubmit()}
              >
                {params.isEdit ? 'Update' : 'Create'}
              </Button>
              {params.isEdit &&
              <Button
                buttonType="button"
                onClick={() => params.onDelete()}
              >
                Delete
              </Button>
              }
            </HorizontalGrid> 
            <hr />
            {Object.entries(bisFunctionSettings.fields).map(
              ([key, value], index) => {
                return (
                  <div key={key}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormComponent
                        name={key}
                        value={value}
                        bisFunctionEdit={params.bisFunctionEdit}
                        entities={params.entities}
                      />
                    </div>
                    <hr
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        width: "5%",
                        marginLeft: 0,
                      }}
                    />
                  </div>
                );
              }
            )}
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default BisFunction;
