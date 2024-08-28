/* eslint-disable @typescript-eslint/no-explicit-any */
import { H1, Stack, Button } from "@deskpro/deskpro-ui";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZodObject, ZodTypeAny, z } from "zod";
import customerJson from "../../mapping/customer.json";
import orderJson from "../../mapping/order.json";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  editCustomer,
  editOrder,
  getCustomerById,
  getOrderById,
} from "../../api/api";
import { IOrder } from "../../api/types";
import { FieldMappingInput } from "../../components/FieldMappingInput/FieldMappingInput";
import { getMetadataBasedSchema } from "../../schemas/default";
import { QueryKeys } from "../../utils/query";
import {
  commaNotationToObject,
  objectToCommaNotation,
  phoneRegex,
} from "../../utils/utils";
import { HorizontalDivider } from "../../components/HorizontalDivider/HorizontalDivider";
import { Container } from "../../components/Layout";

export const Edit = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();

  const [inputs, setInputs] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);
  const [hasReset, setHasReset] = useState<boolean>(false);
  const isOrder = type === "order";

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  useEffect(() => {
    setInputs(
      isOrder
        ? [
            ...orderJson.create.map((e) => ({
              ...e,
              name: `shipping,${e.name}`,
            })),
            { name: "billing" },
            ...orderJson.create.map((e) => ({
              ...e,
              name: `billing,${e.name}`,
            })),
          ]
        : customerJson.create
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    if (inputs.length === 0) return;

    const newObj: { [key: string]: ZodTypeAny } = {};

    inputs.forEach((field: any) => {
      if (field.type === "email") {
        newObj[field.name] = z.string().email();
      }
      if (field.type === "text") {
        newObj[field.name] = z.string().optional();
      }
      if (field.type === "number") {
        newObj[field.name] = z
          .string()
          .regex(phoneRegex, "Invalid phone number");
      }
    });

    setSchema(getMetadataBasedSchema(inputs, newObj));
  }, [inputs]);

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

  useEffect(() => {
    if ((!context && dataQuery.isSuccess) || hasReset) return;

    reset(objectToCommaNotation(dataQuery.data as any));

    setHasReset(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, dataQuery.isSuccess]);

  const submit = async (data: IOrder) => {
    if (!client) return;

    setSubmitting(true);

    const parsedData = commaNotationToObject(data);

    const editFn = isOrder ? editOrder : editCustomer;

    await editFn(
      client,
      context?.settings.store_url,
      id as string,
      parsedData as IOrder
    );

    setSubmitting(false);

    navigate(`/view/${type}/${id}`);
  };

  if (dataQuery.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(submit)}>
        <Stack vertical gap={8}>
          <H1>Shipping Address</H1>
          <Stack vertical style={{ width: "100%" }}>
            {inputs.map((input, i) =>
              input.name !== "billing" ? (
                <FieldMappingInput
                  key={i}
                  errors={errors}
                  field={input}
                  register={register}
                  setValue={setValue}
                  watch={watch}
                  required={input.isRequired}
                />
              ) : (
                <Stack
                  vertical
                  style={{ marginTop: "5px", marginBottom: "5px" }}
                  key={i}
                >
                  <HorizontalDivider />
                  <H1>Billing Address</H1>
                </Stack>
              )
            )}
          </Stack>
          <Stack justify="space-between" style={{ width: "100%" }}>
            <Button
              type="submit"
              data-testid="button-submit"
              text={submitting ? "Editing..." : "Edit"}
            />
            <Button
              onClick={() => navigate(-1)}
              text="Cancel"
              intent="secondary"
            />
          </Stack>
        </Stack>
      </form>
    </Container>
  );
};
