import { H1, P1, P11, Stack, useDeskproAppTheme } from "@deskpro/app-sdk";
import { INote } from "../../api/types";
import { formatDateSince } from "../../utils/utils";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";

type Props = {
  notes: INote[];
};

export const Notes = ({ notes }: Props) => {
  const { theme } = useDeskproAppTheme();
  return (
    <Stack vertical gap={10} style={{ width: "100%" }}>
      <H1>Order Notes ({notes.length})</H1>
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
          <HorizontalDivider full={i === notes.length - 1} />
        </Stack>
      ))}
    </Stack>
  );
};
