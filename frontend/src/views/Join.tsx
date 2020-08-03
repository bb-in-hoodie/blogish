import React, { useState } from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import '../css/join.css';
import { userJoin, userValidate } from '../api/UserAPI';
import User from '../types/User';

export default function Join(): JSX.Element {
  // user info
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  // api
  let waitingAPI = false;

  const onJoinClick = async () => {
    if (waitingAPI) return;

    const newUser: User = { userId, password, nickname };
    waitingAPI = true;

    await userJoin(newUser)
      .then((resp: User) => {
        // TODO: routing 구현
        console.log(resp);
      }).catch(() => {
        alert('회원가입 과정에서 에러가 발생했습니다.');
      }).finally(() => {
        waitingAPI = false;
      });
  };

  const onCheckClick = async () => {
    if (waitingAPI) return;

    // TODO: userId 비어있는 경우 처리
    waitingAPI = true;

    await userValidate(userId)
      .then((resp: boolean) => {
      // TODO: resp 대응
        console.log(resp);
      }).catch(() => {
        alert('ID 검증 과정에서 에러가 발생했습니다.');
      }).finally(() => {
        waitingAPI = false;
      });
  };

  return (
    <div className="join">
      <div className="header">
        JOIN
      </div>
      <Form>
        <FormGroup>
          <Label for="input_id">ID</Label>
          <div className="input_with_button">
            <Input id="input_id" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
            <Button color="warning" onClick={onCheckClick}>check</Button>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="input_password">Password</Label>
          <Input id="input_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="input_nickname">Name</Label>
          <Input id="input_nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </FormGroup>
        <div className="submit_btn_area">
          <Button color="secondary">Cancel</Button>
          <Button color="success" className="join_btn" onClick={onJoinClick}>Join</Button>
        </div>
      </Form>
    </div>
  );
}
