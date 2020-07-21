import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Main from './views/Main';
import Join from './views/Join';
import Browse from './views/Browse';
import Blog from './views/Blog';
import Editor from './views/Editor';

export default function App() {
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
          <Blog />
        </Route>
        <Route path="/edit/:blogId">
          <Editor />
        </Route>
        <Route path="/">
          <Main />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
