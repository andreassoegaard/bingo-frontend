import React from "react";
import LoginForm from "./LoginForm";
import MockRouter from "@/cypress/utils/router";
import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
const store = makeStore();
const forgotPwHandler = () => {};

describe("<LoginForm />", () => {
  beforeEach(() => {
    cy.mount(
      <Provider store={store}>
        <MockRouter>
          <LoginForm onForgotPw={forgotPwHandler} />
        </MockRouter>
      </Provider>
    );
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();
  });

  it("calls the submitHandler function when valid input is provided", () => {
    // Stub the submitHandler function
    const submitHandlerStub = cy.stub().as("submitHandler");

    cy.get("form")
      .invoke("prop", "onSubmit", submitHandlerStub) // set the onSubmit prop to the stub
      .within(() => {
        cy.get('input[name="email"]').type("example@email.com");
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
      });

    cy.get("@submitHandler").should("be.called");
  });

  it("has password field set to required", () => {
    // Stub the submitHandler function
    const submitHandlerStub = cy.stub().as("submitHandler");

    cy.get("form")
      .invoke("prop", "onSubmit", submitHandlerStub) // set the onSubmit prop to the stub
      .within(() => {
        cy.get('input[name="email"]').type("example@email.com");
        cy.get('button[type="submit"]').click();
      });

    cy.get('input[name="password"]').then(
      // @ts-ignore
      ($y) => expect($y[0].checkValidity()).to.be.false
    );
  });

  it("has email field set to required", () => {
    // Stub the submitHandler function
    const submitHandlerStub = cy.stub().as("submitHandler");

    cy.get("form")
      .invoke("prop", "onSubmit", submitHandlerStub) // set the onSubmit prop to the stub
      .within(() => {
        cy.get('input[name="password"]').type("password123");
        cy.get('button[type="submit"]').click();
      });

    cy.get('input[name="email"]').then(
      // @ts-ignore
      ($y) => expect($y[0].checkValidity()).to.be.false
    );
  });
});
