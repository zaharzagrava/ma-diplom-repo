import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => <div>{children}</div>;

export default Page;
