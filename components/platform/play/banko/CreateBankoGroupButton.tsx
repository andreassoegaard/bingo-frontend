import { PropsWithChildren, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import InputField from "@/components/ui/InputField";
import InputWrapper from "@/components/ui/InputWrapper";
import supabase from "@/lib/supabase-browser";
import { selectOrgState } from "@/store/orgSlice";
import { useSelector } from "react-redux";
import { useOrgId } from "@/hooks/useOrgId";
import { useEffect } from "react";

interface Props {
  currentGroups: any;
}

export default function CreateBankoGroupButton(
  props: PropsWithChildren<Props>
) {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const orgId = useOrgId();

  useEffect(() => {
    const today = new Date();
    let name = `Banko-dag d. ${today.toLocaleDateString("da-DK", {
      day: "numeric",
      year: "numeric",
      month: "long",
    })}`;

    const entriesWithName = props.currentGroups.filter((item: any) =>
      item.name.includes(name)
    );
    if (entriesWithName && entriesWithName.length > 0) {
      name = name + ` (${entriesWithName.length + 1})`;
    }
    setName(name);
  }, [props.currentGroups]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setError("");
    setLoading(true);
    event.preventDefault();
    try {
      const { error } = await supabase
        .from("banko_games_groups")
        .insert([{ name, organization_id: orgId }]);

      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setShowModal(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <Button style='indigo' onClick={() => setShowModal(true)}>
        Opret spilgruppe
      </Button>
      <Modal
        open={showModal}
        size='md'
        title='Opret ny spilgruppe'
        subtitle='Efterfølgende kan du starte det første bankospil'
        onClose={() => setShowModal(false)}
      >
        <form onSubmit={handleSubmit}>
          <InputWrapper for='name' label='Navn'>
            <InputField
              id='name'
              type='text'
              name='name'
              placeholder='Banko-dag d. xx/xx-xxxx'
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </InputWrapper>
          <Button
            style='indigo'
            className='w-full mt-4'
            success={success}
            loading={loading}
            error={error}
          >
            Opret spilgruppe
          </Button>
        </form>
      </Modal>
    </>
  );
}
