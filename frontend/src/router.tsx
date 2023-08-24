import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import NotFound from "./components/NotFound/NotFound";
import AppContainer from "./containers/AppContainer/AppContainer"
import EntitiesUpsertContainer from "./containers/EntityUpsert/EntitiesUpsertContainer/EntitiesUpsertContainer";
import { EntityUpsertType } from "./containers/EntityUpsert/types";
import MonitorAndPlanningContainer from "./containers/MonitorAndPlanning/MonitorAndPlanning";

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppContainer/>}>
      <Route path='/home' element={<MonitorAndPlanningContainer/>}></Route>
      <Route path='/users' element={<EntitiesUpsertContainer type={EntityUpsertType.USER} />}></Route>
      <Route path='/resources' element={<EntitiesUpsertContainer type={EntityUpsertType.RESOURCE} />}></Route>
      <Route path='/credits' element={<EntitiesUpsertContainer type={EntityUpsertType.CREDIT} />}></Route>
      <Route path='/equipments' element={<EntitiesUpsertContainer type={EntityUpsertType.EQUIPMENT} />}></Route>
      <Route path='/products' element={<EntitiesUpsertContainer type={EntityUpsertType.PRODUCT} />}></Route>
      <Route path="*" element={<NotFound />}/>
    </Route>
  )
);
