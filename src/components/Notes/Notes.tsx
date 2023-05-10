import {
  H1,
  HorizontalDivider,
  P1,
  P11,
  Stack,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { formatDateSince } from "../../utils/utils";
import { INote } from "../../api/types";

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
          <HorizontalDivider
            style={{
              width: "115%",
              backgroundColor: theme?.colors.grey10,
            }}
          />
        </Stack>
      ))}
    </Stack>
  );
};
