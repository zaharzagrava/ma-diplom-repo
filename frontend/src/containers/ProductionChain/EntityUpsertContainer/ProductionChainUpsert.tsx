import { ErrorMessage, FieldArray, Formik, FormikProps, FormikTouched, FormikValues, setNestedObjectValues } from "formik";
import Joi from "joi";
import React, { FC } from "react";
import styled from "styled-components";
import Button from "../../../components/Button/Button";
import FormDatepicker from "../../../components/Form/FormDatePicker/FormDatePicker";
import { FormDropdown } from "../../../components/Form/FormDropdown/FormDropdown";
import FormError from "../../../components/Form/FormError/FormError";
import FormStringField from "../../../components/Form/FormStringField/FormStringField";
import { Card } from "../../../components/Utils/Card";
import { UserTypes, Entities, FormFieldType } from "../../../store/types";
import { ProductionChainEditDto } from "../types";

export const HorizontalGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 100px 100px;

  align-items: end;
`;

export const EquipmentResourceGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 275px 30px 30px;
  grid-gap: 20px;

  align-items: center;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 20px;
  grid-template-columns: 435px 300px;

  align-items: center;
`;

type Props = {
  productionChainEdit: ProductionChainEditDto;
  isEdit?: boolean; // helper property

  entities: Entities;

  onValidate: (values: ProductionChainEditDto) => any;
  onSubmit: (values: ProductionChainEditDto) => void;
};

const ProductionChainUpsert: FC<Props> = (params) => {
  return (
    <Card>
      <Formik
        initialValues={params.productionChainEdit}
        enableReinitialize={true}
        validate={params.onValidate}
        onSubmit={params.onSubmit}
      >
        {({ handleSubmit, values, setTouched, errors, touched }: FormikProps<ProductionChainEditDto>) => {
          return (
            <div>
              <FormStringField
                name={"name"}
                placeholder={"Name"}
                label={"Name"}
              />
              <FormDropdown
                name={"productId"}
                label={"Product"}
                labelDirection="column"
                options={params.entities.products.map((x) => x.id)}
                labels={params.entities.products.map((x) => x.name)}
              />
              <hr />
              <FieldArray name="equipments">
                {(props) => {
                  const { push, remove, form } = props;
                  return (
                    <div>
                      {(
                        form as FormikProps<ProductionChainEditDto>
                      ).values.equipments.map((equipment, index) => (
                        <FormGrid key={index}>
                          <EquipmentResourceGrid>
                            <FormDropdown
                              name={`equipments[${index}].id`}
                              label={"Equipment: "}
                              placeholder={"Choose equipment"}
                              labelDirection="column"
                              options={params.entities.equipment.map(
                                (x) => x.id
                              )}
                              labels={params.entities.equipment.map(
                                (x) => x.name
                              )}
                            />
                            {index > 0 && (
                              <Button
                                buttonType="button"
                                onClick={() => remove(index)}
                              >
                                -
                              </Button>
                            )}
                            {index === form.values.equipments.length - 1 && (
                              <Button
                                buttonType="button"
                                onClick={() => push({})}
                              >
                                +
                              </Button>
                            )}
                          </EquipmentResourceGrid>
                          <FormStringField
                            name={`equipments[${index}].amount`}
                            placeholder={"Amount"}
                            label={"Amount"}
                          />
                          <hr />
                        </FormGrid>
                      ))}
                    </div>
                  );
                }}
              </FieldArray>
              <hr />
              <FieldArray name="resources">
                {(props) => {
                  const { push, remove, form } = props;
                  return (
                    <div>
                      {(
                        form as FormikProps<ProductionChainEditDto>
                      ).values.resources.map((resource, index) => (
                        <FormGrid key={index}>
                          <EquipmentResourceGrid>
                            <FormDropdown
                              name={`resources[${index}].id`}
                              label={"Resource: "}
                              placeholder={"Choose resource"}
                              labelDirection="column"
                              options={params.entities.resources.map(
                                (x) => x.id
                              )}
                              labels={params.entities.resources.map(
                                (x) => x.name
                              )}
                            />
                            {index > 0 && (
                              <Button
                                buttonType="button"
                                onClick={() => remove(index)}
                              >
                                -
                              </Button>
                            )}
                            {index === form.values.resources.length - 1 && (
                              <Button
                                buttonType="button"
                                onClick={() => push({})}
                              >
                                +
                              </Button>
                            )}
                          </EquipmentResourceGrid>
                          <FormStringField
                            name={`resources[${index}].amount`}
                            placeholder={"Amount"}
                            label={"Amount"}
                          />
                          <hr />
                        </FormGrid>
                      ))}
                    </div>
                  );
                }}
              </FieldArray>
              <hr />
              <FieldArray name="users">
                {(props) => {
                  const { push, remove, form } = props;
                  const users = (form as FormikProps<ProductionChainEditDto>)
                    .values.users;
                  return (
                    <div>
                      {users.map((user, index) => (
                        <div key={index}>
                          <EquipmentResourceGrid key={index}>
                            <FormDropdown
                              name={`users[${index}].id`}
                              label={"User: "}
                              placeholder={"Choose user"}
                              labelDirection="column"
                              options={params.entities.users.map((x) => x.id)}
                              labels={params.entities.users.map(
                                (x) => x.fullName
                              )}
                            />
                            {index > 0 && (
                              <Button
                                buttonType="button"
                                onClick={() => remove(index)}
                              >
                                -
                              </Button>
                            )}
                            {index === form.values.users.length - 1 && (
                              <Button
                                buttonType="button"
                                onClick={() => push({})}
                              >
                                +
                              </Button>
                            )}
                          </EquipmentResourceGrid>
                        </div>
                      ))}
                      {users.length === 0 && (
                        <Button buttonType="button" onClick={() => push({})}>
                          Add first user
                        </Button>
                      )}
                    </div>
                  );
                }}
              </FieldArray>
              <hr />
              <HorizontalGrid>
                <Button buttonType="submit" onClick={() => handleSubmit()}>
                  Update
                </Button>
              </HorizontalGrid>
            </div>
          );
        }}
      </Formik>
    </Card>
  );
};

export default ProductionChainUpsert;
