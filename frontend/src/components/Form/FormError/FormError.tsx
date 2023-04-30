import React from 'react';

interface Props {
  children: React.ReactNode;
}

const FormError = ({ children }: Props) => <div>{children}</div>;

export default FormError;
