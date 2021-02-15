import React, {
  useState, SetStateAction, Dispatch, useEffect,
} from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { assignUser } from '../redux/userSlice';
import { loginAPI } from '../api/UserAPI';
import { LoginResult } from '../types/User';
import '../css/main.css';
import useUser from '../hooks/useUser';

async function onLoginClick(
  userId: string,
  password: string,
  setWaitingAPI: Dispatch<SetStateAction<boolean>>,
  history: History,
  dispatch: Dispatch<any>,
) {
  let result: LoginResult | undefined;

  try {
    setWaitingAPI(true);
    result = await loginAPI(userId, password); // response [succeded: userBody] [failed: false]

    if (!result?.succeeded) {
      alert('ID 혹은 Password가 유효하지 않습니다.');
    }
  } catch (e) {
    alert('로그인 과정에서 에러가 발생했습니다.');
  } finally {
    setWaitingAPI(false);

    // 로그인 성공 시 browse로 이동
    if (result?.succeeded) {
      dispatch(assignUser(result.user));
      history.push('/browse');
    }
  }
}

export default function Main(): JSX.Element {
  const user = useUser();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [waitingAPI, setWaitingAPI] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoginDisabled = !userId || !password || waitingAPI;

  useEffect(() => {
    if (user.userId) {
      history.push('/browse');
    }
  }, [user]);

  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (!isLoginDisabled && e.key === 'Enter') {
      onLoginClick(userId, password, setWaitingAPI, history, dispatch);
    }
  }

  return (
    <div className="main">
      <header>
        LOGIN
      </header>
      <main>
        <Form>
          <FormGroup className="formgroup_id">
            <Label for="input_id">ID</Label>
            <Input
              id="input_id"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={onKeyDownOnForm}
            />
          </FormGroup>
          <FormGroup className="formgroup_password">
            <Label for="input_password">Password</Label>
            <Input
              id="input_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={onKeyDownOnForm}
            />
          </FormGroup>
          <div className="login_btn_area">
            <Button
              color="secondary"
              className="join_btn"
              onClick={() => { history.push('/join'); }}
            >
              Join
            </Button>
            <Button
              color="primary"
              className="login_btn"
              disabled={isLoginDisabled}
              onClick={() => onLoginClick(userId, password, setWaitingAPI, history, dispatch)}
            >
              Login
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
}
