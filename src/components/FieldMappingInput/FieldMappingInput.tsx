/* eslint-disable @typescript-eslint/no-explicit-any */
import { H1, Stack, TextArea } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { forwardRef } from "react";
import { FieldErrorsImpl } from "react-hook-form";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form/dist/types";
import { InputWithTitleRegister } from "../InputWithTitle/InputWithTitleRegister";

type Props = {
  errors: Partial<FieldErrorsImpl<any>>;
  field: {
    name: string;
    label: string;
    type: string;
    required?: boolean;
  };
  required?: boolean;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
};

export const FieldMappingInput = forwardRef(
  ({ field, errors, watch, setValue, register, ...attributes }: Props) => {
    const { theme } = useDeskproAppTheme();

    if (field.label === "Type") return null;
    switch (field.type) {
      case "text":
      case "number":
      case "email":
        return (
          <InputWithTitleRegister
            register={register(field.name, {
              setValueAs: (value) => {
                if (value === "") return undefined;

                if (field.type === "number") return Number(value);

                return value;
              },
            })}
            title={field.label}
            error={!!errors[field.name]}
            type={field.type}
            required={field.required}
            data-testid={`input-${field.name}`}
            {...attributes}
          ></InputWithTitleRegister>
        );
      case "textarea":
        return (
          <Stack
            vertical
            gap={4}
            style={{ width: "100%", color: theme.colors.grey80 }}
          >
            <H1>{field.label}</H1>
            <TextArea
              variant="inline"
              value={watch(field.name)}
              error={!!errors[field.name]}
              onChange={(e) => setValue(field.name, e.target.value)}
              placeholder="Enter text here..."
              required={field.required}
              title={field.label}
              {...attributes}
              style={{
                resize: "none",
                minHeight: "5em",
                maxHeight: "100%",
                height: "auto",
                width: "100%",
                overflow: "hidden",
              }}
            />
          </Stack>
        );
    }
    return null;
  }
);
