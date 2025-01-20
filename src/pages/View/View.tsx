import { Stack } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCustomerById,
  getOrderById,
  getOrderNotesByOrderId,
} from "../../api/api";
import { ICustomer, INote, IOrder } from "../../api/types";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import { Notes } from "../../components/Notes/Notes";
import customerJson from "../../mapping/customer.json";
import orderJson from "../../mapping/order.json";
import { QueryKeys } from "../../utils/query";
import { Container } from "../../components/Layout";
import { ISettings, UserData } from "../../types/settings";

export const View = () => {
  const { type, id: itemId } = useParams();
  const { context } = useDeskproLatestAppContext<UserData, ISettings>();
  const navigate = useNavigate();

  const isOrder = type === "order";

  const dataQuery = useQueryWithClient(
    [QueryKeys.ORDERS, itemId as string],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    (client) => {
      return isOrder
        ? getOrderById(client, context?.settings?.store_url ?? "", itemId as string)
        : getCustomerById(
            client,
            context?.settings?.store_url ?? "",
            itemId as string
          );
    },
    {
      enabled: !!context?.settings.store_url && !!itemId && !!type,
    }
  );

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("editButton", {
      type: "edit_button",
    });
  });

  const notesQuery = useQueryWithClient(
    [QueryKeys.NOTES, itemId as string],
    (client) =>
      getOrderNotesByOrderId(
        client,
        context?.settings.store_url ?? "",
        itemId as string
      ),
    {
      enabled: !!context?.settings.store_url && !!itemId && isOrder,
    }
  );

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("link", {
      type: "cta_external_link",
      url: `${context?.settings.store_url}/${
        isOrder
          ? `wp-admin/post.php?post=${itemId}&action=edit`
          : `wp-admin/user-edit.php?user_id=${itemId}`
      }`,
      hasIcon: true,
    });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");

          break;
        case "editButton":
          navigate(`/edit/${type}/${itemId}`);

          break;
      }
    },
  });

  useInitialisedDeskproAppClient(
    (client) => {
      if (!dataQuery.isSuccess) return;

      const data = dataQuery.data as ICustomer & IOrder;

      client.setTitle(isOrder ? data?.number : data?.full_name);
    },
    [dataQuery.isSuccess]
  );

  if (dataQuery.isLoading) return <LoadingSpinner />;

  return (
    <Container>
      <Stack vertical>
        <FieldMapping
          fields={[dataQuery.data]}
          metadata={isOrder ? orderJson.view : customerJson.view}
        ></FieldMapping>
        {isOrder && notesQuery.isSuccess && (
          <Notes
            orderId={itemId as string}
            notes={notesQuery.data as INote[]}
          ></Notes>
        )}
      </Stack>
    </Container>
  );
};
