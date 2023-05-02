import { PropsWithChildren, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import InputWrapper from "@/components/ui/InputWrapper";
import supabase from "@/lib/supabase-browser";
import { selectOrgState } from "@/store/orgSlice";
import { useSelector } from "react-redux";

export default function InviteUserButton(props: PropsWithChildren) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const orgState = useSelector(selectOrgState);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    try {
      const { data } = await supabase.functions.invoke("invite-user", {
        body: { email, name, organizations: [orgState.toString()] },
      });
      setLoading(false);
      setSuccess("Brugeren blev inviteret!");
      setTimeout(() => {
        setSuccess("");
        setShowModal(false);
      }, 2000);
      console.log(data);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <Button style='indigo' onClick={() => setShowModal(true)}>
        Inviter bruger
      </Button>
      <Modal
        open={showModal}
        size='md'
        title='Inviter ny bruger'
        subtitle='Indtast brugerens e-mail-adresse herunder. De vil derefter få en
          e-mail med en invitation til BingoBuddy.'
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <InputWrapper for='name' label='Navn'>
            <InputField
              id='name'
              type='text'
              name='name'
              placeholder='Anders Andersen'
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </InputWrapper>
          <InputWrapper for='email' label='E-mail-adresse'>
            <InputField
              id='email'
              type='email'
              name='email'
              placeholder='brugerens@email.dk'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </InputWrapper>
          <Button
            style='indigo'
            className='w-full mt-4'
            success={success}
            loading={loading}
          >
            Inviter bruger
          </Button>
        </form>
      </Modal>
    </>
  );
}
