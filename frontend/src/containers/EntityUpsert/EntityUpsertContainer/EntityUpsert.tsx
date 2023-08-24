import { Formik, FormikProps } from "formik";
import Joi from "joi";
import React, { FC } from "react";
import styled from "styled-components";
import Button from "../../../components/Button/Button";
import FormDatepicker from "../../../components/Form/FormDatePicker/FormDatePicker";
import { FormDropdown } from "../../../components/Form/FormDropdown/FormDropdown";
import FormStringField from "../../../components/Form/FormStringField/FormStringField";
import { Card } from "../../../components/Utils/Card";
import { UserTypes, Entities, FormFieldType } from "../../../store/types";

import { EntityEditDto, EntityUpsertType } from "../types";
import { entityUpsertSettings } from "./EntityUpsertContainer";

export const HorizontalGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 100px 100px;

  align-items: end;
`;

type Props = {
  entityEdit: EntityEditDto;
  isEdit?: boolean; // helper property

  entities: Entities;

  onValidate: (values: EntityEditDto) => any;
  onSubmit: (values: EntityEditDto) => void;
  onDelete: () => void;
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
  entityEdit: EntityEditDto;
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
  } else if(params.value.type === FormFieldType.DROPDOWN) {
    let filteredEntities;
    try {
      filteredEntities = (() => {
        switch (params.entityEdit.__type__) {
          case EntityUpsertType.USER:
            return UserTypes;

          default:
            throw new Error(
              `No dropdown handler of ${params.entityEdit.__type__} type`
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
        options={filteredEntities.map((x: any) => x.id || x)}
        labels={filteredEntities.map((x: any) => x.name || x.fullName || x)}
      />
    );
  } else {
    formComponent = <FormDatepicker name={params.name} label={params.value.label}  />
  }

  return formComponent;
};

const EntityUpsert: FC<Props> = (params) => {
  const settings =
    entityUpsertSettings[params.entityEdit.__type__];

  if (!settings)
    return (
      <Card>Error: No renderer for type {params.entityEdit.__type__}</Card>
    );

  return (
    <Card>
      <Formik
        initialValues={params.entityEdit}
        enableReinitialize={true}
        validate={params.onValidate}
        onSubmit={params.onSubmit}
      >
        {({ handleSubmit }: FormikProps<EntityEditDto>) => (
          <div>
            {Object.entries(settings.fields).map(
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
                        entityEdit={params.entityEdit}
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
            <HorizontalGrid>
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
          </div>
        )}
      </Formik>
    </Card>
  );
};

export default EntityUpsert;
