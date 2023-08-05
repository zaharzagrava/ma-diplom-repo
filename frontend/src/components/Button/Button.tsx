import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

interface Props {
  styleType?: 'simple' | 'corner' | 'none' | 'gray';
  buttonType: 'button' | 'reset' | 'submit';
  onClick?: () => any;
  children: string | React.ReactNode;
}

const InnerContent = styled.div`
  text-align: left;
  text-decoration: none;
`;

const SimpleButtonStyled = styled.button`
  background-color: #fff;
  padding: 5px 10px;
  border: 1px gray solid;

  &:hover {
    background: #bdd5ee;
    cursor: pointer;
  }
`;

const NoneButtonStyled = styled.button`
  &:hover {
    cursor: pointer;
  }
`;

const CornerButtonStyled = styled.button`
  padding: 10px;
  color: #215526;
  background: #fff;
  border: 1px gray solid;

  &:hover {
    cursor: pointer;
  }
`;

const GrayButtonStyled = styled.button`
  background-color: #707070;
  padding: 10px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const Button: FunctionComponent<Props> = ({
  styleType = 'simple',
  buttonType,
  onClick,
  children,
}: Props) => {

  switch (styleType) {
    case 'none':
      return (
        <NoneButtonStyled
          type={buttonType}
          onClick={onClick}
        >
          <InnerContent>{children}</InnerContent>
        </NoneButtonStyled>
      );
    case 'corner':
      return (
        <CornerButtonStyled
          type={buttonType}
          onClick={onClick}
        >
          <InnerContent>{children}</InnerContent>
        </CornerButtonStyled>
      );
    case 'simple':
      return (
        <SimpleButtonStyled
          type={buttonType}
          onClick={onClick}
        >
          <InnerContent>{children}</InnerContent>
        </SimpleButtonStyled>
      );
    case 'gray':
      return (
        <GrayButtonStyled
          type={buttonType}
          onClick={onClick}
        >
          <InnerContent>{children}</InnerContent>
        </GrayButtonStyled>
      );

    default:
      return (
        <div>There is no such contentType as: {styleType}</div>
      );
  }
};

Button.defaultProps = {
  onClick: undefined,
};

export default Button;
