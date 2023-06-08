import React from "react";
import LoginForm from "./LoginForm";
import { render } from '@testing-library/react';
import { makeStore } from "@/store/store";
const store = makeStore();

describe("<LoginForm />", () => {
  const forgotPwHandler = () => {};
  
  beforeEach(() => {
    render(
      <LoginForm onForgotPw={forgotPwHandler} />
    );
  });
});
