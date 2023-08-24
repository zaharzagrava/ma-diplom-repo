import { ErrorMessage, Field, FieldProps } from "formik";
import React, { FunctionComponent } from "react";
import DatePicker from "react-datepicker";
import FormError from "../FormError/FormError";

import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { DateTime } from "luxon";
import { FieldLabel } from "../../Utils/FieldLabel";

const Container = styled.div<{
  $isLabelPresent: boolean;
}>`
  display: grid;
  grid-gap: ${(props) => (props.$isLabelPresent ? "20px" : 0)};
  grid-template-rows: auto 1fr;
  grid-auto-flow: row;

  margin: 5px 0px;
`;

interface Props {
  name: string;
  label?: string;
}

const FormDatepicker: FunctionComponent<Props> = ({ name, label }: Props) => (
  <Container $isLabelPresent={Boolean(label)}>
    {label && <FieldLabel>{label}</FieldLabel>}
    <Field name={name}>
      {({ field, form }: FieldProps<Date>) => {
        return (
          <div>
            <DatePicker
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              name={name}
              selected={((): Date | undefined => {
                if(field.value) {
                  return DateTime.fromFormat(
                    (field.value).toString(),
                    "yyyyMM"
                  ).toJSDate();
                }
                
                return undefined;
              })()}
              onChange={(date) => {
                if (date !== null) {
                  const dateYYYYMM =
                    DateTime.fromJSDate(date).toFormat("yyyyMM");
                  form.setFieldValue(name, Number(dateYYYYMM));
                  return;
                }

                form.setFieldValue(name, date);
              }}
              onBlur={field.onBlur}
            />
          </div>
        );
      }}
    </Field>
    <ErrorMessage
      component={FormError as React.FunctionComponent<{}>}
      name={name}
    />
  </Container>
);

FormDatepicker.defaultProps = {
  label: undefined,
};

export default FormDatepicker;
