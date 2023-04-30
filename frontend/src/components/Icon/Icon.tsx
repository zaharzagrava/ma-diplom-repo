import React from 'react';
import {
  EyeIcon,
} from '../../assets/icons';

interface Props {
  type:
  | 'tick'
  | 'tick-off'
  | 'eye'
  | 'triangle';
  styleClass?: string;
  onClick?: () => any;
}

const Icon = ({ type, styleClass, onClick }: Props) => {
  switch (type) {
    case 'eye':
      return <EyeIcon className={styleClass} onClick={onClick} />;
    default:
      return <></>;
  }
};

Icon.defaultProps = {
  onClick: undefined,
};

export default Icon;
