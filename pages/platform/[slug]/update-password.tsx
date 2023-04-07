import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "@/lib/supabase-browser";
import Button from "@/components/ui/Button";
import PageWrapper from "@/components/wrappers/PageWrapper";
import Head from "next/head";
import serverProps from "@/lib/server-props";
import merge from "lodash.merge";

export default function UpdatePassword() {
  const [showForm, setShowForm] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [submitLoading, setSubmitLoading] = useState(false);
  const submitHandler = async (event: any) => {
    event.preventDefault();
    try {
      setSubmitLoading(true);
      if (password === repeatPassword) {
        await supabase.auth.updateUser({
          password,
        });
        router.replace("/platform");
      } else {
        throw Error("De indtastede passwords er ikke ens. Prøv igen.");
      }
      setSubmitLoading(false);
    } catch (error: any) {
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 4000);
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <PageWrapper title='Opdater dit kodeord'>
        <div className='flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8'>
          <div className='sm:mx-auto sm:w-full sm:max-w-md'>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
              Opdater dit kodeord
            </h2>
          </div>

          <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white py-6 px-6 shadow sm:rounded-lg'>
              <form onSubmit={submitHandler}>
                <div className='mb-2'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Kodeord
                  </label>
                  <div className='mt-2'>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      autoComplete='current-password'
                      required
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </div>
                <div className='mb-4'>
                  <label
                    htmlFor='repeatPassword'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Gentag kodeord
                  </label>
                  <div className='mt-2'>
                    <input
                      id='repeatPassword'
                      name='repeatPassword'
                      type='password'
                      autoComplete='repeat-current-password'
                      required
                      className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      onChange={(event) =>
                        setRepeatPassword(event.target.value)
                      }
                    />
                  </div>
                </div>
                <Button
                  type='submit'
                  style='indigo'
                  className='w-full'
                  loading={submitLoading}
                  error={error}
                >
                  Gem kodeord
                </Button>
              </form>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}

export const getServerSideProps = async (ctx: any) => {
  return merge(await serverProps(ctx), {
    props: {},
  });
};
