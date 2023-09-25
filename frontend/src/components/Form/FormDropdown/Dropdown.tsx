import { Tooltip } from "@mui/material";
import React, { FC } from "react";
import { styled } from "styled-components";

import Icon from "../../Icon/Icon";

export const InnerContainer = styled.div`
  position: relative;
`;

export const ChosenOptionContainer = styled.div`
  background: white;
  border: 1px gray solid;
  padding: 5px 10px;
`;

export const OptionsContainer = styled.div`
  margin-top: 5px;
  height: 100px;
  position: absolute;
  display: flex;
  flex-direction: column;

  border: 1px gray solid;
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

export const Dropdown: FC<{
  editable?: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onChose: (name: string, option: string) => any;
  onBlur?: () => any;
  isOpen: boolean;
  longLabel?: string;
  labels: string[];
  options: string[];
  value: string;
  defaultValue: string | undefined;
  placeholder: string | undefined;
  name: string;
}> = ({
  editable = true,
  setIsOpen,
  onChose,
  onBlur,
  isOpen,
  longLabel,
  labels,
  options,
  value,
  defaultValue,
  placeholder,
  name,
}) => {
  return (
    <Tooltip title={longLabel} >
      <InnerContainer>
        <button
          type="button"
          disabled={!editable}
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChosenOptionContainer>
            {labels[options.findIndex((option) => option === value)] ||
              labels[options.findIndex((option) => option === defaultValue)] ||
              placeholder}
          </ChosenOptionContainer>
          <div>
            <Icon type="triangle" />
          </div>
        </button>
        {isOpen && (
          <OptionsContainer>
            {options.map((option, optionIndex) => (
              <Option
                key={option}
                onClick={() => {
                  onChose(name, option);
                  setIsOpen(false);
                }}
                onBlur={onBlur}
              >
                {labels[optionIndex]}
              </Option>
            ))}
          </OptionsContainer>
        )}
      </InnerContainer>
    </Tooltip>
  );
};
