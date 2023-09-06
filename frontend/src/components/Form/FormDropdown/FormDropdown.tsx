import { ErrorMessage, Field, FieldProps } from "formik";
import React, { FC, useRef, useState } from "react";
import FormError from "../FormError/FormError";
import styled from "styled-components";

import Icon from "../../Icon/Icon";
import { useOutsideClick } from "../../../hooks/useOutsideClick";
import { FieldLabel } from "../../Utils/FieldLabel";
import { Dropdown } from "./Dropdown";

interface Props {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  label?: string;
  labelDirection?: "column" | "row";
  options: string[];
  labels: string[];
  editable?: boolean;
  resetOnChoose?: true;
}

export const Container = styled.div<{
  $flexDirection: "column" | "row";
  $isLabelPresent: boolean;
}>`
  display: grid;
  grid-gap: ${(props) => (props.$isLabelPresent ? "20px" : 0)};
  ${(props) => {
    return props.$flexDirection === "column"
      ? "grid-template-columns: auto 1fr;"
      : "grid-template-rows: auto 1fr;";
  }}

  align-items: center;
  margin: 5px 0px;
`;

export const FormDropdown = ({
  name,
  defaultValue,
  placeholder,
  label,
  options,
  labels,
  labelDirection = "row",
  editable = true,
  resetOnChoose,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <Container
      ref={ref}
      $flexDirection={labelDirection}
      $isLabelPresent={Boolean(label)}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          return <Dropdown
            editable={editable}
            setIsOpen={setIsOpen}
            onChose={form.setFieldValue.bind(this)}
            isOpen={isOpen}
            labels={labels}
            options={options}
            value={field.value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            name={name}
          />
        }}
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
