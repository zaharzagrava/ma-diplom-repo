import React, { FC } from "react";

import Button from "../Button/Button";
import { Card } from "../Utils/Card";

type Props = {
  onOrderChange: (direction: 'up' | 'down') => void
};

const OrderChanger: FC<Props> = (params) => {
  return (
    <div>
      <Button
        buttonType="submit"
        onClick={() => params.onOrderChange('up')}
      >
        Up
      </Button>
      <Button
        buttonType="submit"
        onClick={() => params.onOrderChange('down')}
      >
        Down
      </Button>
    </div>
  );
};

export default OrderChanger;
