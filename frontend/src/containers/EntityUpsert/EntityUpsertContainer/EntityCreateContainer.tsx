import React, { FC, useCallback, useState } from "react";
import Button from "../../../components/Button/Button";
import { Dropdown } from "../../../components/Form/FormDropdown/Dropdown";
import { AlignCenter } from "../../../components/Utils/AlignCenter";
import { EntityUpsertType } from "../types";
import EntityUpsertContainer from "./EntityUpsertContainer";

type Props = {
  type: EntityUpsertType;
};

const EntityCreateContainer: FC<Props> = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onSwitch = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  const onCreate = useCallback(() => {
    setIsOpen(!isOpen);
  }, [setIsOpen, isOpen]);

  return (
    <AlignCenter>
      {isOpen ? (
        <>
          <EntityUpsertContainer entity={type} onSubmitCallback={onCreate} />
          <Button buttonType="button" onClick={() => onSwitch()}>
            Cancel
          </Button>
        </>
      ) : (
        <Button buttonType="button" onClick={() => onSwitch()}>
          Create
        </Button>
      )}
    </AlignCenter>
  );
};

export default EntityCreateContainer;
