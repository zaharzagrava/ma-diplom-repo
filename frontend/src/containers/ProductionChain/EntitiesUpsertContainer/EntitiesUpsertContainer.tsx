import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { AppAction } from "../../../store/actions";
import { VerticalGrid } from "../../../components/Utils/VerticalGrid";
import { AppState } from "../../../store/reducer";
import ProductionChainUpsertContainer from "../EntityUpsertContainer/ProductionChainUpsertContainer";

const ProductionChainsContainer = () => {
  const productionChains = useSelector((state: AppState) => state.entites?.productionChains);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<AppAction>({ type: "ENTITIES_GET_ALL" });
  }, [dispatch]);

  if (productionChains === undefined) {
    return <>Loading</>;
  }

  return (
    <VerticalGrid>
      <h2>Production chain</h2>
      {productionChains.map((x) => (
        <ProductionChainUpsertContainer
          productionChain={x}
          key={x.id}
        />
      ))}
    </VerticalGrid>
  );
};

export default ProductionChainsContainer;
