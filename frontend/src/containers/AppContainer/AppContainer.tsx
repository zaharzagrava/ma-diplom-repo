import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppState } from "../../store/reducer";
import { AppAction } from "../../store/actions";
import Page from "../../components/Page/Page";
import router from "../../router";
import { firebaseAuth } from "../../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
} from "firebase/auth";
import { InterceptorService } from "../../services/Interceptors";
import { config } from "../../config";
import styled from "styled-components";
import MonitorAndPlanning from "../MonitorAndPlanning/MonitorAndPlanning";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";

// Bright Gray (#EEEEEE)
// Gainsboro (#DDDDDD)
// Chinese Silver (#CCCCCC)
// X11 Gray (#BBBBBB)
// Dark Charcoal (#333333)

const Title = styled.h1`
  color: black;
`;

const Header = styled.header`
  grid-area: header;
  padding: 20px;
  background-color: #ffffff;
`;

const Main = styled.article``;

const Aside = styled.div`
  padding: 10px;
  background-color: #ffffff;
`;

const Content = styled.div`
  padding: 20px;
  grid-area: content;
  background-color: #ffffff;

  display: grid;
  grid-gap: 20px;
  grid-template-columns: auto 1fr;
  grid-auto-flow: row;
`;

const Footer = styled.footer`
  padding: 20px;
  grid-area: footer;
  background-color: #ffffff;
`;

const MainGrid = styled.div`
  display: grid;
  padding: 0px 20px;
  grid-gap: 50px;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header" "content" "footer";
`;

const List = styled.ul`
  list-style-type: none;
  padding-inline-start: 10px;
`;

const ListElem = styled.li`
  padding-top: 10px;
`;

const AppContainer = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: AppState) => state);

  useEffect(() => {
    InterceptorService.init(config);

    onAuthStateChanged(firebaseAuth, async (userCred) => {
      if (!userCred) {
        signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
      } else if (state.actions.getMyself.success === null) {
        dispatch<AppAction>({ type: "GET_MYSELF" });
      }
    });
  }, [dispatch, state.actions.getMyself.success]);

  if (state.actions.getMyself.success === null) {
    return <div>Loading</div>;
  }

  if (state.actions.getMyself.success === false) {
    return (
      <div>
        There has been an error with login, you will be signed out and send to
        login again
      </div>
    );
  }

  return (
    <Page>
      <MainGrid>
        <Header>
          <Title>Менеджер проекту</Title>
        </Header>
        <Content>
          <Aside>
            <List>
              <ListElem>
                <Link to="/home">Моніторинг та Планування</Link>
              </ListElem>
              <ListElem>
                <Link to="/users">Користувачі</Link>
              </ListElem>
              <ListElem>
                <Link to="/resources">Ресурси</Link>
              </ListElem>
              <ListElem>
                <Link to="/credits">Кредити</Link>
              </ListElem>
              <ListElem>
                <Link to="/equipments">Обладнання</Link>
              </ListElem>
              <ListElem>
                <Link to="/products">Продукція</Link>
              </ListElem>
              <ListElem>
                <Link to="/production-chains">Ланцюги Виробництва</Link>
              </ListElem>
            </List>
          </Aside>
          <Main>
            <Outlet />
          </Main>
        </Content>
        <Footer>Вийти</Footer>
      </MainGrid>
    </Page>
  );
};

export default AppContainer;
