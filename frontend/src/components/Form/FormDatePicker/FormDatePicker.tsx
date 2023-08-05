import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent } from 'react';
import DatePicker from 'react-datepicker';
import FormError from '../FormError/FormError';

import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { FieldLabel } from '../../Utils/FieldLabel';

const Container = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-rows: auto 1fr;
  grid-auto-flow: row;

  margin: 10px 0px;
`;

interface Props {
  name: string;
  label?: string;
}

const FormDatepicker: FunctionComponent<Props> = ({
  name,
  label,
}: Props) => (
  <Container>
    {label && <FieldLabel>{label}</FieldLabel>}
    <Field name={name}>
      {({ field, form }: FieldProps<Date>) => (
        <div>
          <DatePicker
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            name={name}
            selected={DateTime.fromFormat((field.value as any).toString(), 'yyyyMM').toJSDate()}
            onChange={(date) => {
              if(date !== null) {
                const dateYYYYMM = DateTime.fromJSDate(date).toFormat('yyyyMM');
                form.setFieldValue(name, Number(dateYYYYMM));
                return;
              }

              form.setFieldValue(name, date)
            }}
            onBlur={field.onBlur}
          />
        </div>
      )}
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
