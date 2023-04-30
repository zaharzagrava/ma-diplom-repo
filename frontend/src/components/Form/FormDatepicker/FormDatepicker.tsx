import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent } from 'react';
import DatePicker from 'react-datepicker';
import FormError from '../FormError/FormError';

import styles from './FormDatepicker.module.scss';

import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  name: string;
  label?: string;
}

const FormDatepicker: FunctionComponent<Props> = ({
  name,
  label,
}: Props) => (
  <div className={styles.container}>
    {label && <p className={styles.field_label}>{label}</p>}
    <Field name={name}>
      {({ field, form }: FieldProps<Date>) => (
        <div className={styles.field_container}>
          <DatePicker
            showTimeInput
            showTwoColumnMonthYearPicker
            name={name}
            selected={field.value}
            onChange={(date: any) => form.setFieldValue(name, date)}
            onBlur={field.onBlur}
          />
        </div>
      )}
    </Field>
    <ErrorMessage
      component={FormError as React.FunctionComponent<{}>}
      name={name}
    />
  </div>
);

FormDatepicker.defaultProps = {
  label: undefined,
};

export default FormDatepicker;
