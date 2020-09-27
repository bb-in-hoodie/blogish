import React, {
  useState, SetStateAction, Dispatch, useEffect, ComponentState,
} from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { joinAPI, idValidateAPI } from '../api/UserAPI';
import User from '../types/User';
import '../css/join.css';

async function onJoinClick(
  waitingAPI: ComponentState,
  setWaitingAPI: Dispatch<SetStateAction<boolean>>,
  newUser: User,
  history: History,
) {
  if (waitingAPI) return;

  let user: User | null = null;
  setWaitingAPI(true);

  try {
    user = await joinAPI(newUser) as User;
    alert(`${user.nickname}님의 회원가입을 성공하였습니다.
메인 페이지로 돌아갑니다.`);
  } catch {
    alert('회원가입 과정에서 에러가 발생했습니다.');
  } finally {
    // 회원가입에 성공했으면 메인 페이지로 이동, 아니면 waitingAPI 해제
    if (user) {
      history.push('/');
    } else {
      setWaitingAPI(false);
    }
  }
}

async function onCheckClick(
  waitingAPI: ComponentState,
  setWaitingAPI: Dispatch<SetStateAction<boolean>>,
  userId: string,
  setIsValidId: Dispatch<SetStateAction<boolean | null>>,
) {
  if (waitingAPI) return;

  setWaitingAPI(true);

  try {
    const isValid = await idValidateAPI(userId);
    setIsValidId(isValid);
  } catch {
    alert('ID 검증 과정에서 에러가 발생했습니다.');
  } finally {
    setWaitingAPI(false);
  }
}

function onCancelClick(history: History) {
  if (window.confirm('회원가입을 중단하시겠습니까?')) {
    history.push('/');
  }
}

export default function Join(): JSX.Element {
  // user info
  const [userId, setUserId] = useState('');
  const [isValidId, setIsValidId] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [waitingAPI, setWaitingAPI] = useState(false);

  const history = useHistory();

  // useEffects
  useEffect(() => {
    setIsValidId(null);
  }, [userId]);

  return (
    <div className="join">
      <header>
        JOIN
      </header>
      <main>
        <Form>
          <FormGroup className="formgroup_id">
            <Label for="input_id">ID</Label>
            <div className="input_with_button">
              <Input
                id="input_id"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <Button
                color="info"
                outline
                disabled={!userId || isValidId !== null || waitingAPI}
                onClick={() => onCheckClick(waitingAPI, setWaitingAPI, userId, setIsValidId)}
              >
                check
              </Button>
            </div>
            {isValidId === false
            && <span className="invalid">이미 사용 중인 ID입니다.</span>}
            {isValidId === true
            && <span className="valid">사용할 수 있는 ID입니다.</span>}
          </FormGroup>
          <FormGroup className="formgroup_password">
            <Label for="input_password">Password</Label>
            <Input
              id="input_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="formgroup_nickname">
            <Label for="input_nickname">Nickname</Label>
            <Input
              id="input_nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </FormGroup>
          <div className="submit_btn_area">
            <Button
              color="secondary"
              onClick={() => onCancelClick(history)}
            >
              Cancel
            </Button>
            <Button
              color="success"
              disabled={!userId || !isValidId || !password || !nickname || waitingAPI}
              className="join_btn"
              onClick={() => onJoinClick(waitingAPI, setWaitingAPI, { userId, password, nickname }, history)}
            >
              Join
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
}
