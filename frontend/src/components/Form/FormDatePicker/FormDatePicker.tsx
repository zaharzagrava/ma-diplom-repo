import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent } from 'react';
import DatePicker from 'react-datepicker';
import FormError from '../FormError/FormError';

import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { DateTime } from 'luxon';

const Container = styled.div`
  flex: 1 0 0px;

  display: flex;
  flex-direction: column;

  position: relative;
`;

const FieldLabel = styled.p`  

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
    <Field name={name}>
      {({ field, form }: FieldProps<Date>) => (
        <div>
          {label && <FieldLabel>{label}</FieldLabel>}
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
