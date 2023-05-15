import {
  Button,
  P8,
  Stack,
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { useState } from "react";
import { createOrderNote } from "../../api/api";

export const CreateNote = () => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();
  const { orderId } = useParams();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("editButton");
  });

  return (
    <Stack style={{ width: "100%" }}>
      <Stack>
        <P8>New note</P8>
        <InputWithTitle
          title="New note"
          setValue={setNote}
          value={note}
          required={true}
        />
      </Stack>
      <Stack justify="space-between">
        <Button
          onClick={async () => {
            if (!client) return;

            setSubmitting(true);

            if (note.length === 0) {
              setError("Note cannot be empty");

              return;
            }

            await createOrderNote(
              client,
              context?.settings.store_url,
              orderId as string,
              note
            );
          }}
          text={submitting ? "Creating..." : "Create"}
        />
        <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
      </Stack>
      {error && <P8 color="red">{error}</P8>}
    </Stack>
  );
};
