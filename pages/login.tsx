import { useState } from "react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import Head from "next/head";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import PageWrapper from "@/components/wrappers/PageWrapper";

export default function Login() {
  const [forgotPw, setForgotPw] = useState(false);
  const forgotPwHandler = () => {
    setForgotPw(true);
  };
  const backToLoginHandler = () => {
    setForgotPw(false);
  };

  return (
    <>
      <PageWrapper title='Log ind'>
        <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              BingoBuddy
            </h2>
          </div>

          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-6 px-6 shadow sm:rounded-lg'>
              {forgotPw ? (
                <ForgotPasswordForm onBackToLogin={backToLoginHandler} />
              ) : (
                <LoginForm onForgotPw={forgotPwHandler} />
              )}
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return {
      redirect: {
        destination: "/platform",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
