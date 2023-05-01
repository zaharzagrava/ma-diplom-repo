import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { useRef, useState } from 'react';
import FormError from '../FormError/FormError';

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
    <div ref={ref}>
      {label && <p>{label}</p>}
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div>
                {labels[options.findIndex((option) => option === field.value)] ||
                  labels[options.findIndex((option) => option === defaultValue)] ||
                  placeholder}
              </div>
              <div>
                <Icon
                  type="triangle"
                />
              </div>
            </button>
            {isOpen && (
              <div>
                {options.map((option, optionIndex) => (
                  <button
                    key={option}
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
