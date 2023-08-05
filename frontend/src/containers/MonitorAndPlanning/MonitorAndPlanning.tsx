import React, { useEffect } from "react";

import BisFunctionsChart from "../../components/BisFunctionsChart/BisFunctionChart";
import BisMetricsChart from "../../components/BisMetricsChart/BisMetricsChart";
import BisFunctionsContainer from "../BisFunctions/BisFunctionsContainer";
import { AppState } from "../../store/reducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppAction } from "../../store/actions";
import { VerticalGrid } from "../../components/Utils/VerticalGrid";
import { HorizontalGrid } from "../../components/Utils/HorizontalGrid";
import { AlignCenter } from "../../components/Utils/AlignCenter";
import { Table, TD, TR } from "../../components/Utils/TableUtils";

const MonitorAndPlanningContainer = () => {
  // const {from, to} = useSelector((state: AppState) => state.ui.monitoringAndPlanning);
  const bisFunctions = useSelector((state: AppState) => state.bisFunctions);
  const bisMetrics = useSelector((state: AppState) => state.bisMetrics);
  const entities = useSelector((state: AppState) => state.entites);

  console.log("@entities");
  console.log(JSON.stringify(entities, null, 2));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch<AppAction>({ type: "BIS_FUNCTIONS_GET_ALL" });
    dispatch<AppAction>({ type: "ENTITIES_GET_ALL" });
    dispatch<AppAction>({ type: "PLAN" });
  }, [dispatch]);

  if (bisFunctions === null || bisMetrics === null) {
    return <>Loading</>;
  }

  return (
    <VerticalGrid>
      <h2>Моніторинг та Планування</h2>
      <BisFunctionsContainer bisFunctions={bisFunctions} />
      <AlignCenter>
        <button>Add new business function</button>
      </AlignCenter>
      <AlignCenter>
        <button>Plan</button>
        <BisMetricsChart bisMetricsDto={bisMetrics.balance} />
        <BisFunctionsChart
          bisFunctions={bisFunctions.map((x) => ({
            name: x.name,
            periodRange: [x.startPeriod, x.endPeriod ?? 202212],
          }))}
        />
      </AlignCenter>
      <AlignCenter>
        <Table>
          <tbody>
            {bisMetrics.balance.map((bisMetricsPeriod) => {
              return (
                <TR key={bisMetricsPeriod.period}>
                  <TD>{bisMetricsPeriod.period}</TD>
                  <TD>
                    {bisMetricsPeriod.prompts.map((prompt) => (
                      <div key={prompt}>{prompt}</div>
                    ))}
                  </TD>
                </TR>
              );
            })}
          </tbody>
        </Table>
      </AlignCenter>
    </VerticalGrid>
  );
};

export default MonitorAndPlanningContainer;
