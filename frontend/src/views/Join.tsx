import React, {
  useState, SetStateAction, Dispatch, ComponentState,
} from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import { joinAPI, idValidateAPI } from '../api/UserAPI';
import User, {
  InputUniqueness,
  InputValidity,
  USER_ID_MAX_LENGTH,
  USER_ID_MIN_LENGTH,
  USER_ID_REGEX,
  USER_NICKNAME_MAX_LENGTH,
  USER_NICKNAME_MIN_LENGTH,
  USER_NICKNAME_REGEX,
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_REGEX,
} from '../types/User';
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
    alert(`Welcome, ${user.nickname}.
Please login and create your first blog.`);
  } catch {
    alert('Failed to join.');
  } finally {
    // go back to the main page on success or release waitingAPI
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
  setUserIdUniqueness: Dispatch<SetStateAction<InputUniqueness>>,
) {
  if (waitingAPI) return;

  setWaitingAPI(true);
  try {
    const isValid = await idValidateAPI(userId);
    setUserIdUniqueness(isValid ? 'UNIQUE' : 'NOT_UNIQUE');
  } catch {
    alert('Failed to validate the ID.');
  } finally {
    setWaitingAPI(false);
  }
}

function onCancelClick(history: History) {
  if (window.confirm('Are you sure you want to exit?')) {
    history.push('/');
  }
}

export default function Join(): JSX.Element {
  // user info
  const [userId, setUserId] = useState('');
  const [userIdValidity, setUserIdValidity] = useState<InputValidity>('EMPTY');
  const [userIdUniqueness, setUserIdUniqueness] = useState<InputUniqueness>('UNCHECKED'); // server-side checking

  const [password, setPassword] = useState('');
  const [passwordValidity, setPasswordValidity] = useState<InputValidity>('EMPTY');

  const [nickname, setNickname] = useState('');
  const [nicknameValidity, setNicknameValidity] = useState<InputValidity>('EMPTY');

  const [waitingAPI, setWaitingAPI] = useState(false);
  const isJoinEnabled = !waitingAPI
                        && userIdUniqueness === 'UNIQUE'
                        && userIdValidity === 'VALID'
                        && passwordValidity === 'VALID'
                        && nicknameValidity === 'VALID';

  const history = useHistory();

  // input change event listener
  function onInputChange(
    input: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setInputValidity: React.Dispatch<React.SetStateAction<InputValidity>>,
    minLength: number,
    maxLength: number,
    regex: RegExp,
    setInputUniqueness?: React.Dispatch<React.SetStateAction<InputUniqueness>>,
  ) {
    setInput(input);
    if (setInputUniqueness) {
      setInputUniqueness('UNCHECKED');
    }

    const { length } = input;
    if (length === 0) {
      setInputValidity('EMPTY');
    } else if (length >= minLength && length <= maxLength) {
      setInputValidity(regex.test(input) ? 'VALID' : 'INVALID');
    } else {
      setInputValidity('INVALID');
    }
  }

  // onEnterDown
  function onKeyDownOnForm(e: React.KeyboardEvent) {
    if (isJoinEnabled && e.key === 'Enter') {
      onJoinClick(waitingAPI, setWaitingAPI, { userId, password, nickname }, history);
    }
  }

  return (
    <div className="join">
      <header>
        JOIN
      </header>
      <main>
        <Form>
          <FormGroup className="formgroup_id">
            <Label for="input_id">
              ID
              {' '}
              <span className="input_counter">
                (
                {userId.length}
                /
                {USER_ID_MAX_LENGTH}
                )
              </span>
            </Label>
            <div className="input_with_button">
              <Input
                id="input_id"
                type="text"
                maxLength={USER_ID_MAX_LENGTH}
                value={userId}
                onChange={(e) => onInputChange(
                  e.target.value,
                  setUserId,
                  setUserIdValidity,
                  USER_ID_MIN_LENGTH,
                  USER_ID_MAX_LENGTH,
                  USER_ID_REGEX,
                  setUserIdUniqueness,
                )}
                onKeyDown={onKeyDownOnForm}
              />
              <Button
                color="info"
                outline
                disabled={userIdValidity !== 'VALID' || userIdUniqueness !== 'UNCHECKED' || waitingAPI}
                onClick={() => onCheckClick(waitingAPI, setWaitingAPI, userId, setUserIdUniqueness)}
              >
                check
              </Button>
            </div>
            {userIdUniqueness === 'UNIQUE'
            && <span className="validity valid">It&apos;s a valid ID.</span>}
            {userIdUniqueness === 'NOT_UNIQUE'
            && <span className="validity invalid">It&apos;s an occupied ID.</span>}
            {userIdUniqueness === 'UNCHECKED' && userIdValidity === 'VALID'
            && <span className="validity unchecked">The ID is valid. Please check for duplication.</span>}
            {userIdUniqueness === 'UNCHECKED' && userIdValidity === 'INVALID'
            && (
              <span className="validity invalid">
                English characters, numbers and dashes are allowed (
                {USER_ID_MIN_LENGTH}
                {' '}
                ≤ length ≤
                {' '}
                {USER_ID_MAX_LENGTH}
                ).
              </span>
            )}
          </FormGroup>
          <FormGroup className="formgroup_password">
            <Label for="input_password">
              Password
              {' '}
              <span className="input_counter">
                (
                {password.length}
                /
                {USER_PASSWORD_MAX_LENGTH}
                )
              </span>
            </Label>
            <Input
              id="input_password"
              type="password"
              maxLength={USER_PASSWORD_MAX_LENGTH}
              value={password}
              onChange={(e) => onInputChange(
                e.target.value,
                setPassword,
                setPasswordValidity,
                USER_PASSWORD_MIN_LENGTH,
                USER_PASSWORD_MAX_LENGTH,
                USER_PASSWORD_REGEX,
              )}
              onKeyDown={onKeyDownOnForm}
            />
            {passwordValidity === 'VALID'
            && <span className="validity valid">It&apos;s a valid password.</span>}
            {passwordValidity === 'INVALID'
            && (
              <span className="validity invalid">
                English characters, numbers and dashes are allowed (
                {USER_PASSWORD_MIN_LENGTH}
                {' '}
                ≤ length ≤
                {' '}
                {USER_PASSWORD_MAX_LENGTH}
                ).
              </span>
            )}
          </FormGroup>
          <FormGroup className="formgroup_nickname">
            <Label for="input_nickname">
              Nickname
              {' '}
              <span className="input_counter">
                (
                {nickname.length}
                /
                {USER_NICKNAME_MAX_LENGTH}
                )
              </span>
            </Label>
            <Input
              id="input_nickname"
              type="text"
              maxLength={USER_NICKNAME_MAX_LENGTH}
              value={nickname}
              onChange={(e) => onInputChange(
                e.target.value,
                setNickname,
                setNicknameValidity,
                USER_NICKNAME_MIN_LENGTH,
                USER_NICKNAME_MAX_LENGTH,
                USER_NICKNAME_REGEX,
              )}
              onKeyDown={onKeyDownOnForm}
            />
            {nicknameValidity === 'VALID'
            && <span className="validity valid">It&apos;s a valid nickname.</span>}
            {nicknameValidity === 'INVALID'
            && (
              <span className="validity invalid">
                English characters, numbers and dashes are allowed (
                {USER_NICKNAME_MIN_LENGTH}
                {' '}
                ≤ length ≤
                {' '}
                {USER_NICKNAME_MAX_LENGTH}
                ).
              </span>
            )}
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
              disabled={!isJoinEnabled}
              className="join_btn"
              onClick={() => onJoinClick(
                waitingAPI,
                setWaitingAPI,
                { userId, password, nickname },
                history,
              )}
            >
              Join
            </Button>
          </div>
        </Form>
      </main>
    </div>
  );
}
