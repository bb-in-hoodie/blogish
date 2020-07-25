import React, { useState } from 'react';
import {
  Form, FormGroup, Label, Input, Button,
} from 'reactstrap';
import '../css/join.css';

export default function Join() {
  // user info
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  return (
    <div className="join">
      <div className="header">
        JOIN
      </div>
      <Form>
        <FormGroup>
          <Label for="input_id">ID</Label>
          <div className="input_with_button">
            <Input id="input_id" type="text" value={id} onChange={(e) => setId(e.target.value)} />
            <Button color="warning">check</Button>
          </div>
        </FormGroup>
        <FormGroup>
          <Label for="input_password">Password</Label>
          <Input id="input_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label for="input_name">Name</Label>
          <Input id="input_name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </FormGroup>
        <div className="submit_btn_area">
          <Button color="secondary">Cancel</Button>
          <Button color="success" className="join_btn">Join</Button>
        </div>
      </Form>
    </div>
  );
}
