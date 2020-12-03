import React, { HTMLProps } from 'react';

interface Props extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
}

const Page: React.FC<Props> = ({ children, ...props }: Props) => (
  <div className="PageWrapper" {...props}>
    {children}
  </div>
);

export default Page;
