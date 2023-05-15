import {
  LoadingSpinner,
  Stack,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import orderJson from "../../mapping/order.json";
import customerJson from "../../mapping/customer.json";
import { useNavigate, useParams } from "react-router-dom";
import { QueryKeys } from "../../utils/query";
import {
  getCustomerById,
  getOrderById,
  getOrderNotesByOrderId,
} from "../../api/api";
import { ICustomer, INote, IOrder } from "../../api/types";
import { Notes } from "../../components/Notes/Notes";

export const View = () => {
  const { type, id } = useParams();
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();

  const isOrder = type === "order";

  const dataQuery = useQueryWithClient(
    [QueryKeys.ORDERS, id as string],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    (client) => {
      return isOrder
        ? getOrderById(client, context?.settings.store_url, id as string)
        : getCustomerById(client, context?.settings.store_url, id as string);
    },
    {
      enabled: !!context?.settings.store_url && !!id && !!type,
    }
  );

  const notesQuery = useQueryWithClient(
    [QueryKeys.NOTES, id as string],
    (client) =>
      getOrderNotesByOrderId(client, context?.settings.store_url, id as string),
    {
      enabled: !!context?.settings.store_url && !!id && isOrder,
    }
  );

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("link", {
      type: "cta_external_link",
      url: `${context?.settings.store_url}/${
        isOrder
          ? `wp-admin/post.php?post=${id}&action=edit`
          : `wp-admin/user-edit.php?user_id=${id}`
      }`,
      hasIcon: true,
    });
  });

  useDeskproAppEvents({
    onElementEvent(id) {
      switch (id) {
        case "homeButton":
          navigate("/redirect");
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
    <Stack vertical gap={8}>
      <FieldMapping
        fields={[dataQuery.data]}
        metadata={isOrder ? orderJson.view : customerJson.view}
      ></FieldMapping>
      {isOrder && notesQuery.isSuccess && (
        <Notes notes={notesQuery.data as INote[]}></Notes>
      )}
    </Stack>
  );
};
