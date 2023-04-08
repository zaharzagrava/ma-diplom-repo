import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppState } from '../../store/reducer';
import { AppAction } from '../../store/actions';
import Page from '../../components/Page/Page';
import router from '../../router';
import { firebaseAuth } from '../../firebase';
import { GoogleAuthProvider, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';
import { InterceptorService } from '../../services/Interceptors';
import { config } from '../../config';
import styled from 'styled-components';
import MonitorAndPlanning from '../MonitorAndPlanning/MonitorAndPlanning';

// Bright Gray (#EEEEEE)
// Gainsboro (#DDDDDD)
// Chinese Silver (#CCCCCC)
// X11 Gray (#BBBBBB)
// Dark Charcoal (#333333)

const Title = styled.h1`
  color: black;
  font-size: 1.5rem;
`;

const Header = styled.header`
  grid-area: header;
  padding: 20px;
  background-color: #EEEEEE;
`;


const Article = styled.article`
  grid-area: content;
`;

const Aside = styled.div`
  grid-area: sidebar;
  padding: 10px;
  background-color: #EEEEEE;
`;

const Footer = styled.footer`
  padding: 20px;
  grid-area: footer;
  background-color: #EEEEEE;
`;

const MainGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 3fr;
  grid-template-areas: 
    "header  header"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "sidebar content"
    "footer  footer";
`;

const List = styled.ul`
  list-style-type: none;
  padding-inline-start: 10px;
`

const ListElem = styled.li`
  padding-top: 10px;
  font-size: 18px;
`;

const AppContainer = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: AppState) => state);

  useEffect(()=> {
    InterceptorService.init(config);

		onAuthStateChanged(firebaseAuth, async (userCred) => {
      if (!userCred) {
        signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
      } else if (state.actions.getMyself.success === null) {
        dispatch<AppAction>({ type: 'GET_MYSELF' });
      }
		});
  }, [dispatch, state.actions.getMyself.success]);

  if(state.actions.getMyself.success === null) {
    return <div>Loading</div>
  }

  if(state.actions.getMyself.success === false) {
    return <div>There has been an error with login, you will be signed out and send to login again</div>
  }

  return (
    <Page>
      <MainGrid>
        <Header>
          <Title>Менеджер проекту</Title>
        </Header>
        <Article>
          <MonitorAndPlanning/>
        </Article>
        <Aside>
          <List>
            <ListElem>Моніторинг та Планування</ListElem>
            <ListElem>Користувачі</ListElem>
            <ListElem>Ресурси</ListElem>
            <ListElem>Обладнання</ListElem>
          </List>
        </Aside>
        <Footer>Вийти</Footer>
      </MainGrid>
    </Page>
  );
};

export default AppContainer;
