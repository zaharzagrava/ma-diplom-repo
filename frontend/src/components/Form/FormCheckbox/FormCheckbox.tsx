import { Field, FieldProps } from 'formik';
import React from 'react';
import Icon from '../../Icon/Icon';

import styles from './FormCheckbox.module.scss';

interface SingleSelectProps {
  name: string;
  value: string;
  type: 'singleselect';
  chosenValue: string | null;
  label: string;
}
interface MultiSelectProps {
  name: string;
  value: string;
  type: 'multiselect';
  values: string[];
  label: string;
}

function isMultiSelectProps(pet: Props): pet is MultiSelectProps {
  return (pet as MultiSelectProps).type === 'multiselect';
}

type Props = SingleSelectProps | MultiSelectProps;

const FormCheckbox = (props: Props) => {
  const { name, value, label } = props;

  let isChecked: boolean | null = null;
  if (isMultiSelectProps(props)) {
    isChecked = props.values.includes(value);
  } else {
    isChecked = props.chosenValue === value;
  }

  return (
    <div className={styles.container}>
      <Field type="checkbox" name={name} value={value}>
        {({ form }: FieldProps) => (
          <>
            <button
              type="button"
              className={`${styles.checkbox} ${isChecked ? styles.chosen_checkbox : styles.not_chosen_checkbox}`}
              onClick={
                isMultiSelectProps(props)
                  ? () => {
                    if (!isChecked) {
                      form.setFieldValue(name, [...props.values, value]);
                    } else {
                      form.setFieldValue(
                        name,
                        props.values.filter((currValue) => currValue !== value),
                      );
                    }
                  }
                  : () => {
                    if (!isChecked) {
                      form.setFieldValue(name, value);
                    } else {
                      form.setFieldValue(name, null);
                    }
                  }
              }
            >
              {isChecked ? <Icon type="tick" styleClass={styles.checkbox} /> : <Icon type="tick-off" styleClass={styles.checkbox} />}
            </button>
            <span className={styles.checkbox_label}>{label}</span>
          </>
        )}
      </Field>
    </div>
  );
};

export default FormCheckbox;
