import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent } from 'react';

import FormError from '../FormError/FormError';
import styles from './FormTextareaField.module.scss';

interface Props {
  name: string;
  placeholder: string;
  label?: string;
}

const FormTextareaField: FunctionComponent<Props> = ({
  name,
  placeholder,
  label,
}: Props) => (
  <div className={styles.container}>
    {label && <p className={styles.field_label}>{label}</p>}
    <Field name={name}>
      {({ field }: FieldProps) => (
        <div className={styles.field_container}>
          <textarea
            name={name}
            placeholder={placeholder}
            className={styles.field}
            value={field.value}
            onChange={field.onChange}
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

FormTextareaField.defaultProps = {
  label: undefined,
};

export default FormTextareaField;
