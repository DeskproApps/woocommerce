import { H1, P1, P11, Stack } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { INote } from "../../api/types";
import { formatDateSince } from "../../utils/utils";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

type Props = {
  notes: INote[];
  orderId: string;
};

export const Notes = ({ notes, orderId }: Props) => {
  const { theme } = useDeskproAppTheme();
  const navigate = useNavigate();
  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      <Stack gap={5}>
        <H1>Order Notes ({notes.length})</H1>
        <FontAwesomeIcon
          icon={faPlus}
          size="sm"
          style={{
            alignSelf: "center",
            cursor: "pointer",
            marginBottom: "2px",
          }}
          onClick={() => navigate(`/create/note/${orderId}`)}
        ></FontAwesomeIcon>
      </Stack>
      {notes.map((note, i) => (
        <Stack
          vertical
          key={i}
          style={{
            width: "100%",
            verticalAlign: "center",
          }}
        >
          <Stack gap={15}>
            <P11 style={{ color: theme.colors.grey80 }}>
              {formatDateSince(new Date(note.date_created))}
            </P11>
            <P1>{note.note}</P1>
          </Stack>
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
