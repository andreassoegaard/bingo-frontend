import { useState } from "react";
import { useRouter } from "next/router";
import { selectOrgState, setOrgState, setOrgName } from "@/store/orgSlice";
import { useDispatch, useSelector } from "react-redux";
import supabase from "@/lib/supabase-browser";
import Button from "@/components/ui/Button";
import InputWrapper from "@/components/ui/InputWrapper";
import InputField from "@/components/ui/InputField";
import Modal from "@/components/ui/Modal";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

interface Props {
  onForgotPw(event: any): void;
}

export default function LoginForm({ onForgotPw }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const orgState = useSelector(selectOrgState);
  const dispatch = useDispatch();
  const changeOrg = (orgId: number) => {
    dispatch(setOrgState(orgId));
  };
  const changeOrgName = (orgName: string) => {
    dispatch(setOrgName(orgName));
  };

  const submitHandler = async (event: React.SyntheticEvent) => {
    setSubmitLoading(true);
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw Error(error.message);
      } else if (data) {
        const { data: orgData } = await supabase
          .from("organizations")
          .select("*");
        if (orgData) {
          changeOrg(Number(data.user?.app_metadata.organizations[0]));
          changeOrgName(orgData[0].name);
        }
        router.replace("/platform");
      }
      setSubmitLoading(false);
    } catch (error: any) {
      setSubmitLoading(false);
      setSubmitError(error.message);
      setTimeout(() => {
        setSubmitError("");
      }, 4000);
    }
  };

  const [showOnboarding, setShowOnboarding] = useState(false);

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
        <InputWrapper for='password' label='Kodeord'>
          <InputField
            id='password'
            name='password'
            type='password'
            placeholder='*******'
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </InputWrapper>
        <div className='text-xs flex items-center justify-between'>
          <div>
            <div
              className='cursor-pointer font-medium text-gray-500 hover:text-indigo-600 mb-0.5'
              onClick={onForgotPw}
            >
              Glemt dit kodeord?
            </div>
            <div
              className='cursor-pointer font-medium text-gray-500 hover:text-indigo-600'
              onClick={() => setShowOnboarding(true)}
            >
              Har du ikke en bruger?
            </div>
          </div>
          <Button
            type='submit'
            style='indigo'
            loading={submitLoading}
            error={submitError}
          >
            Log ind
          </Button>
        </div>
      </form>
      <Modal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        size='md'
      >
        <OnboardingFlow />
      </Modal>
    </>
  );
}
