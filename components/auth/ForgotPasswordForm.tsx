import { useState } from "react";
import supabase from "@/lib/supabase-browser";
import Button from "@/components/ui/Button";
import InputWrapper from "@/components/ui/InputWrapper";
import InputField from "@/components/ui/InputField";

interface Props {
  onBackToLogin?(event?: any): void;
}

export default function ForgotPasswordForm({ onBackToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        throw Error(error.message);
      } else {
        setSuccess("Tjek din e-mail og tryk på linket");
        setEmail("");
        setTimeout(() => {
          onBackToLogin;
          setSuccess("");
        }, 4000);
      }
      setLoading(false);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 4000);
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={submitHandler}>
        <InputWrapper for='email' label='E-mail-adresse'>
          <InputField
            id='email'
            name='email'
            type='email'
            placeholder='din@email.dk'
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </InputWrapper>
        <div>
          <Button
            type='submit'
            style='indigo'
            className='w-full'
            loading={loading}
            error={error}
            success={success}
          >
            Glemt kodeord
          </Button>
          <div
            className='text-sm text-center mt-2 text-gray-500 cursor-pointer'
            onClick={onBackToLogin}
          >
            Fortryd
          </div>
        </div>
      </form>
    </>
  );
}
