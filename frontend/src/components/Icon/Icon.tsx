import React from 'react';
import {
  CancelIcon,
  DoubleCheckIcon,
  EyeIcon,
  PencilIcon,
  SaveIcon,
} from '../../assets/icons';

interface Props {
  type:
  | 'tick'
  | 'tick-off'
  | 'eye'
  | 'triangle'
  | 'cancel'
  | 'double-check'
  | 'pencil'
  | 'save'
  ;
  styleClass?: string;
  style?: React.CSSProperties;
  onClick?: () => any;
}

const Icon = ({ type, styleClass, style, onClick }: Props) => {
  switch (type) {
    case 'eye':
      return <EyeIcon style={style} className={styleClass} onClick={onClick} />;
    case 'double-check':
      return <DoubleCheckIcon style={style} className={styleClass} onClick={onClick} />;
    case 'pencil':
      return <PencilIcon style={style} className={styleClass} onClick={onClick} />;
    case 'cancel':
      return <CancelIcon style={style} className={styleClass} onClick={onClick} />;
    case 'save':
      return <SaveIcon style={style} className={styleClass} onClick={onClick} />;
    default:
      return <></>;
  }
};

Icon.defaultProps = {
  onClick: undefined,
};

export default Icon;
