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
  FormFieldType,
} from "../../store/bis-function.types";
import { Entities } from "../../store/types";
import Button from "../Button/Button";
import FormDatepicker from "../Form/FormDatePicker/FormDatePicker";
import FormDropdown from "../Form/FormDropdown/FormDropdown";
import FormStringField from "../Form/FormStringField/FormStringField";
import { Card } from "../Utils/Card";
import { HorizontalGrid } from "../Utils/HorizontalGrid";
import { bisFunctionsSettings } from "./BisFunctionContainer";

type Props = {
  mode: "edit" | "create";

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
  bisFunction: BisFunctionDto;
  bisFunctionEdit: BisFunctionEditDto;

  entities: Entities;

  onValidate: (values: BisFunctionEditDto) => any;
  onSubmit: (values: BisFunctionEditDto) => void;
};

export const FormComponent: FC<{
  name: string;
  value: {
    type: FormFieldType;
    label: string;
    validate: Joi.AnySchema<any>;
    default: any;
  };
  bisFunction: BisFunctionDto;
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
    let filteredEntities
    try {
      filteredEntities = (() => {
        switch (params.bisFunction.type) {
          case BisFunctionType.SELL_PRODUCT_FIXED:
            return params.entities.products;
          case BisFunctionType.BUY_RESOURCE_PRODUCT_FIXED_AMOUNT:
            return params.entities.products;
          case BisFunctionType.PAYOUT_CREDIT_FIXED_AMOUNT:
            return params.entities.credits;

          default:
            throw new Error(
              `No dropdown handler for ${params.bisFunction.id} of ${params.bisFunction.type} type`
            );
        }
      })();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unkown error';
      return <Card>{errorMsg}</Card>
    }

    formComponent = (
      <FormDropdown
        name={params.name}
        placeholder={params.value.default}
        label={params.value.label}
        labelDirection='column'
        options={filteredEntities.map((x) => x.id)}
        labels={filteredEntities.map((x) => x.name)}
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

  if (
    bisFunctionsSettings[
      params.bisFunctionEdit.type as keyof typeof bisFunctionsSettings
    ]
  ) {
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
              <h2>{params.bisFunction.name}</h2>
              <HorizontalGrid>
                <p>#{params.bisFunction.order}</p>
                <FormDropdown
                  name="type"
                  placeholder="Function type"
                  label="Type"
                  options={bisFunctionTypes.map((x) => x.type)}
                  labels={bisFunctionTypes.map((x) => x.label)}
                />
                <FormDatepicker name={"startPeriod"} label="Start period" />
                <FormDatepicker name={"endPeriod"} label="End period" />
              </HorizontalGrid>
              <hr />
              {bisFunctionSettings && (
                <>
                  {Object.entries(bisFunctionSettings.fields).map(
                    ([key, value]) => {
                      console.log('@key, value');
                      console.log(key, value);
                      return (
                        <div key={key}>
                          <FormComponent
                            name={key}
                            value={value}
                            bisFunction={params.bisFunction}
                            entities={params.entities}
                          />
                          <hr
                            style={{
                              marginTop: 0,
                              marginBottom: 0,
                              width: "30%",
                              marginLeft: 0,
                            }}
                          />
                        </div>
                      );
                    }
                  )}
                </>
              )}

              <div style={{ marginTop: 10 }}>
                <Button buttonType="submit" onClick={() => handleSubmit()}>
                  Update
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </Card>
    );
  }

  return <Card>Error: No renderer for type {params.bisFunctionEdit.type}</Card>;
};

export default BisFunction;
