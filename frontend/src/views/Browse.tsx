import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Browse(): JSX.Element {
  const history = useHistory();

  return (
    <>
      <h1>Browse</h1>

      <button type="button" onClick={() => { history.push('/edit/1'); }}>editor</button>
    </>
  );
}
