import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent, useState } from 'react';
import Icon from '../../Icon/Icon';
import FormError from '../FormError/FormError';

interface Props {
  name: string;
  type?: 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';
  placeholder: string;
  label?: string;
  isHideIconShown?: boolean;
  editable?: boolean;
}

const FormStringField: FunctionComponent<Props> = ({
  name,
  type: argType,
  placeholder,
  label,
  isHideIconShown,
  editable,
}: Props) => {
  const [isHidden, setIsHidden] = useState(true);

  let type: string = argType || 'text';
  if (isHideIconShown && (type === 'text' || type === 'password')) {
    if (isHidden) type = 'password';
    else type = 'text';
  }

  return (
    <div>
      {label && <p>{label}</p>}
      <Field name={name}>
        {({ field }: FieldProps) => (
          <div>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              // className={`${styles.field} ${!editable && styles.uneditable}`}
              // For nullable values in db, so that react won't yell at us for using null value in html input
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              readOnly={!editable}
            />
            {isHideIconShown && (
              <div>
                <Icon type="eye" onClick={() => setIsHidden(!isHidden)} />
              </div>
            )}
          </div>
        )}
      </Field>
      <ErrorMessage
        component={FormError as React.FunctionComponent<{}>}
        name={name}
      />
    </div>
  );
};

FormStringField.defaultProps = {
  type: 'text',
  label: undefined,
  isHideIconShown: false,
  editable: true,
};

export default FormStringField;
