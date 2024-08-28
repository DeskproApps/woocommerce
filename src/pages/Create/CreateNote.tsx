import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useNavigate, useParams } from "react-router-dom";
import { InputWithTitle } from "../../components/InputWithTitle/InputWithTitle";
import { useState } from "react";
import { createOrderNote } from "../../api/api";
import { Container } from "../../components/Layout";

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

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  return (
    <Container>
      <Stack style={{ width: "100%" }} vertical gap={8}>
        <InputWithTitle
          title="New note"
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore wrong type
          setValue={(e) => setNote(e.target.value)}
          data-testid="note-input"
          value={note}
          required={true}
        />
        <Stack justify="space-between" style={{ width: "100%" }}>
          <Button
            data-testid="button-submit"
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

              navigate(-1);
            }}
            text={submitting ? "Creating..." : "Create"}
          />
          <Button onClick={() => navigate(-1)} text="Cancel" intent="secondary" />
        </Stack>
        {error && <P8 color="red">{error}</P8>}
      </Stack>
    </Container>
  );
};
