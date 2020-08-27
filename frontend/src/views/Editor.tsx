import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Editor(): JSX.Element {
  const history = useHistory();

  return (
    <>
      <h1>Editor</h1>

      <button type="button" onClick={() => { history.push('/browse'); }}>browse</button>
    </>
  );
}
