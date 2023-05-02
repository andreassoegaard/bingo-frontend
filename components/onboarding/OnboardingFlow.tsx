import InputField from "@/components/ui/InputField";
import InputWrapper from "@/components/ui/InputWrapper";
import Button from "@/components/ui/Button";
import { useState } from "react";
import supabase from "@/lib/supabase-browser";

export default function OnboardingFlow() {
  const [organisationName, setOrganisationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from("organizations")
        .insert({ name: organisationName })
        .select();
      if (data) {
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
              data: {
                name: "",
                organizations: [data[0].id.toString()],
              },
            },
          });
        console.log(signUpData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <h3 className='text-base font-semibold leading-6 text-gray-900 mb-3'>
          Opret dig på BingoBuddy
        </h3>
        <InputWrapper for='organisationName' label='Organisation/foreningsnavn'>
          <InputField
            type='text'
            id='organisationName'
            name='organisationName'
            required
            placeholder='Indtast navn...'
            value={organisationName}
            onChange={(event) => setOrganisationName(event.target.value)}
          />
        </InputWrapper>
        <InputWrapper for='userEmail' label='E-mail-adresse'>
          <InputField
            type='email'
            id='userEmail'
            name='userEmail'
            required
            placeholder='din@mail.dk'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </InputWrapper>
        <InputWrapper for='userPassword' label='Kodeord'>
          <InputField
            type='password'
            id='userPassword'
            name='userPassword'
            required
            placeholder='din@mail.dk'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputWrapper>
        <InputWrapper for='repeatUserPassword' label='Gentag kodeord'>
          <InputField
            type='password'
            id='repeatUserPassword'
            name='repeatUserPassword'
            required
            placeholder='din@mail.dk'
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
          />
        </InputWrapper>
        <div className='mt-4'>
          <Button style='indigo' className='w-full'>
            Opret
          </Button>
        </div>
      </form>
    </>
  );
}
