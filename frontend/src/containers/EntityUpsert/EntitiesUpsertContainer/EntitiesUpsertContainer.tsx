import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import EntityUpsertContainer from "../EntityUpsertContainer/EntityUpsertContainer";
import { EntityUpsertType, upsertTypeToKey } from "../types";
import { AppAction } from "../../../store/actions";
import { VerticalGrid } from "../../../components/Utils/VerticalGrid";
import { AppState } from "../../../store/reducer";
import EntityCreateContainer from "../EntityUpsertContainer/EntityCreateContainer";

const EntitiesUpsertContainer = ({ type }: { type: EntityUpsertType }) => {
  const entities = useSelector((state: AppState) => state.entites);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<AppAction>({ type: "ENTITIES_GET_ALL" });
  }, [dispatch]);

  if (entities === null) {
    return <>Loading</>;
  }

  const entitiesOfType = entities[upsertTypeToKey(type)];

  return (
    <VerticalGrid>
      <h2>Користувачі</h2>
      {entitiesOfType.map((x) => (
        <EntityUpsertContainer
          entity={{
            ...x,
            __type__: type as any,
          }}
          key={x.id}
        />
      ))}
      <EntityCreateContainer type={type} />
    </VerticalGrid>
  );
};

export default EntitiesUpsertContainer;
