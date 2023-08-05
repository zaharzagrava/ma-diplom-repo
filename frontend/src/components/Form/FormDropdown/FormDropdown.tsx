import { ErrorMessage, Field, FieldProps } from 'formik';
import React, { useRef, useState } from 'react';
import FormError from '../FormError/FormError';
import styled from 'styled-components';

import Icon from '../../Icon/Icon';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { FieldLabel } from '../../Utils/FieldLabel';

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  labelDirection?: 'column' | 'row';
  options: string[];
  labels: string[];
}

export const Container = styled.div<{
  flexDirection: 'column' | 'row'
}>`
  display: grid;
  grid-gap: 20px;
  ${(props) => {
    return props.flexDirection === 'column' ? 'grid-template-columns: auto 1fr;' : 'grid-template-rows: auto 1fr;';
  }}

  align-items: center;
  margin: 10px 0px;
`;

// display: grid;
// gap: 10px;
// grid-auto-columns: min-content;
// grid-auto-flow: column;

//  clamp(70px, min-content, 300px)
/* grid-auto-flow: ${props => props.flexDirection}; */

export const InnerContainer = styled.div`
  position: relative;
`;

export const ChosenOptionContainer = styled.div`
  background: white;
  border: 1px gray solid;
  padding: 5px 10px;
`

export const OptionsContainer = styled.div<{
  flexDirection: 'column' | 'row'
}>`
  border-radius: 15px;
  margin-top: 5px;
  height: 100px;
  position: absolute;
  display: flex;
  flex-direction: column;

  z-index: 2;
`;

export const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid #e0e6ef;

  &:hover {
    cursor: pointer;
  }
`;

export const Option = styled.button`
  background-color: #fff;
  padding: 5px 10px;

  &:hover {
    background: #bdd5ee;
    cursor: pointer;
  }
`;

const FormDropdown = ({
  name,
  defaultValue,
  placeholder,
  label,
  options,
  labels,
  labelDirection = 'row'
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <Container ref={ref} flexDirection={labelDirection}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <Field name={name}>
        {({ field, form }: FieldProps) => (
          <InnerContainer>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              <ChosenOptionContainer>
                {labels[options.findIndex((option) => option === field.value)] ||
                  labels[options.findIndex((option) => option === defaultValue)] ||
                  placeholder}
              </ChosenOptionContainer>
              <div>
                <Icon
                  type="triangle"
                />
              </div>
            </button>
            {isOpen && (
              <OptionsContainer flexDirection={labelDirection}>
                {options.map((option, optionIndex) => (
                  <Option
                    key={option}
                    onClick={() => {
                      form.setFieldValue(name, option);
                      setIsOpen(false);
                    }}
                  >
                    {labels[optionIndex]}
                  </Option>
                ))}
              </OptionsContainer>
            )}
          </InnerContainer>
        )}
      </Field>
      <ErrorMessage
        component={FormError as React.FunctionComponent<{}>}
        name={name}
      />
    </Container>
  );
};

FormDropdown.defaultProps = {
  defaultValue: undefined,
  placeholder: undefined,
  label: undefined,
};


export default FormDropdown;
