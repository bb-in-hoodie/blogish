import React from 'react';
import {
  BrowserRouter, Route, Switch,
} from 'react-router-dom';
import Main from './views/Main';
import Join from './views/Join';
import Browse from './views/Browse';
import BlogView from './views/BlogView';

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/join">
          <Join />
        </Route>
        <Route path="/browse">
          <Browse />
        </Route>
        <Route path="/blog/:blogId">
          <BlogView />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
