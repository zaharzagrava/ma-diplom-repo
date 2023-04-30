import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { useRef, useState } from 'react';
import FormError from '../FormError/FormError';

import styles from './FormDropdown.module.scss';
import Icon from '../../Icon/Icon';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  options: string[];
  labels: string[];
}

const FormDropdown = ({
  name,
  defaultValue,
  placeholder,
  label,
  options,
  labels,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div className={styles.container} ref={ref}>
      {label && <p className={styles.field_label}>{label}</p>}
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <>
            <button
              type="button"
              className={styles.dropdown_header}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className={styles.dropdown_header_label}>
                {labels[options.findIndex((option) => option === field.value)] ||
                  labels[options.findIndex((option) => option === defaultValue)] ||
                  placeholder}
              </div>
              <div className={styles.dropdown_header_arrow}>
                <Icon
                  type="triangle"
                  styleClass={styles.dropdown_header_arrow_icon}
                />
              </div>
            </button>
            {isOpen && (
              <div
                className={`${styles.options_container} ${label && styles.label_margin
                  }`}
              >
                {options.map((option, optionIndex) => (
                  <button
                    key={option}
                    className={styles.option}
                    onClick={() => {
                      form.setFieldValue(name, option);
                      setIsOpen(false);
                    }}
                  >
                    {labels[optionIndex]}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Field>
      <ErrorMessage
        component={FormError as React.FunctionComponent<{}>}
        name={name}
      />
    </div>
  );
};

FormDropdown.defaultProps = {
  defaultValue: undefined,
  placeholder: undefined,
  label: undefined,
};


export default FormDropdown;
