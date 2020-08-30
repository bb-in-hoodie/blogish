import React from 'react';
import { useHistory } from 'react-router-dom';
import useUser from '../hooks/useUser';

export default function Browse(): JSX.Element {
  const history = useHistory();
  const user = useUser(true);

  return (
    <>
      <h1>Browse</h1>
      <span>{user.nickname}</span>
      <button type="button" onClick={() => { history.push('/edit/1'); }}>editor</button>
    </>
  );
}
