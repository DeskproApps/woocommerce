import { H1, Stack } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import customerJson from "../mapping/customer.json";
import orderJson from "../mapping/order.json";
import { QueryKeys } from "../utils/query";
import { getCustomersByEmail, getOrders } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Container } from "../components/Layout";
import { ISettings, UserData } from "../types/settings";

export const Main = () => {
  const { context } = useDeskproLatestAppContext<UserData, ISettings>();;
  const navigate = useNavigate();
  useInitialisedDeskproAppClient((client) => {
    client.setTitle("WooCommerce");

    client.registerElement("refreshButton", { type: "refresh_button" });

    client.registerElement("homeButton", {
      type: "home_button",
    });

    client.deregisterElement("link");

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

  const customerQuery = useQueryWithClient(
    [QueryKeys.CUSTOMERS],
    (client) =>
      getCustomersByEmail(
        client,
        context?.settings?.store_url ?? "",
        context?.data?.user.primaryEmail ??  ""
      ),
    {
      enabled:
        !!context?.data?.user?.primaryEmail && !!context?.settings?.store_url,
    }
  );

  const ordersQuery = useQueryWithClient(
    [QueryKeys.ORDERS],
    (client) => getOrders(client, context?.settings?.store_url ?? ""),
    {
      enabled: !!context?.settings?.store_url && !!customerQuery.isSuccess,
    }
  );

  if (ordersQuery.isLoading || customerQuery.isLoading) {
    return (
      <Container>
        <LoadingSpinner />
      </Container>
    );
  }

  const customer = customerQuery.data?.[0];
  const orders = ordersQuery.data;

  if (customer) {
    customer.total_spent = orders?.reduce(
      (acc, curr) => acc + Number(curr.total),
      0
    ) as number;
    customer.currency = orders?.[0]?.currency as string;
  }

  if (!customer) {
    return (
      <Container>
        <H1>No user found under this email.</H1>
      </Container>
    );
  }

  return (
    <Container>
      <Stack vertical>
        <FieldMapping
          fields={[customer]}
          metadata={customerJson.main}
          childTitleAccessor={(e) => e.full_name}
          internalChildUrl="view/customer/"
          externalChildUrl={`${context?.settings?.store_url}/wp-admin/user-edit.php?user_id=`}
          idKey={customerJson.idKey}
        ></FieldMapping>
        {!orders || orders?.length === 0 ? (
          <H1>No orders to show.</H1>
        ) : (
          <FieldMapping
            fields={orders}
            metadata={orderJson.main}
            childTitleAccessor={(e) =>
              `#${e.number} ${e.billing?.first_name} ${e.billing?.last_name}`
            }
            internalChildUrl="view/order/"
            externalChildUrl={`${context?.settings?.store_url}/wp-admin/post.php?post=`}
            idKey={orderJson.idKey}
          ></FieldMapping>
        )}
      </Stack>
    </Container>
  );
};
