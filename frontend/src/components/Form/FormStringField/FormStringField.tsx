import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import Icon from '../../Icon/Icon';
import { FieldLabel } from '../../Utils/FieldLabel';
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

const Container = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: auto 1fr;
  grid-auto-flow: row;

  align-items: center;
  margin: 10px 0px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`;

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
    <Container>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Field name={name}>
        {({ field }: FieldProps) => (
          <InputContainer>
            <input
              style={{paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, fontSize: 16}}
              type={type}
              name={name}
              placeholder={placeholder}
              // className={`${styles.field} ${!editable && styles.uneditable}`}
              // For nullable values in db, so that react won't yell at us for using null value in html input
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              readOnly={!editable}
              size={30}
            />
            {isHideIconShown && (
              <div>
                <Icon type="eye" onClick={() => setIsHidden(!isHidden)} />
              </div>
            )}
          </InputContainer>
        )}
      </Field>
      <ErrorMessage
        component={FormError as React.FunctionComponent<{}>}
        name={name}
      />
    </Container>
  );
};

FormStringField.defaultProps = {
  type: 'text',
  label: undefined,
  isHideIconShown: false,
  editable: true,
};

export default FormStringField;
