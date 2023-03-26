import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom"
import AppContainer from "./containers/AppContainer/AppContainer"
import HomeContainer from "./containers/HomeContainter/HomeContainer"

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<AppContainer/>}>
      <Route path='/home' element={<HomeContainer/>}></Route>
    </Route>
  )
);
