import React, { FC, useCallback, useState } from "react";

import BisFunctionContainer from "../../components/BisFunction/BisFunctionContainer";
import Button from "../../components/Button/Button";
import { Dropdown } from "../../components/Form/FormDropdown/Dropdown";
import { AlignCenter } from "../../components/Utils/AlignCenter";
import {
  BisFunctionType,
  bisFunctionTypes,
} from "../../store/bis-function.types";

type Props = {};

const NewBisFunctionContainer: FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<BisFunctionType | undefined>(undefined);

  const onSubmit = useCallback(() => {
    setIsOpen(false);
    setType(undefined);
  }, [setIsOpen, setType]);

  if (type) {
    return <BisFunctionContainer bisFunction={type} onSubmitCallback={onSubmit} />;
  }

  return (
    <AlignCenter>
      <Dropdown
        onChose={(name, option) => setType(option as any)}
        defaultValue="Add new business function"
        isOpen={isOpen}
        options={bisFunctionTypes.map((x) => x.type)}
        labels={bisFunctionTypes.map((x) => x.label)}
        value={""}
        setIsOpen={setIsOpen}
        name="set"
        placeholder="Add new business function"
      />
    </AlignCenter>
  );
};

export default NewBisFunctionContainer;
