import { ReactElement } from "react";
import { APIArrayReturnTypes } from "../api/types";
import { CustomTag } from "../components/CustomTag/CustomTag";
import { StyledLink } from "../styles";
import { IJson } from "../types/json";
import { getObjectValue } from "./utils";

export const mapFieldValues = (
  metadataFields: IJson["list"][0] | IJson["view"][0],
  field: APIArrayReturnTypes
): {
  key: string | number;
  value: string | number | ReactElement;
}[] => {
  return metadataFields.map((metadataField) => {
    let value;
    switch (metadataField.type) {
      case "date":
        value = new Date(
          field[metadataField.name as keyof APIArrayReturnTypes] as string
        ).toLocaleDateString("en-UK");

        break;
      case "label": {
        value = (
          <CustomTag
            title={
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            }
          ></CustomTag>
        );

        break;
      }
      case "key": {
        value = getObjectValue(field, metadataField.name);

        break;
      }

      case "currency": {
        value = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: field.currency,
        }).format(
          field[metadataField.name as keyof APIArrayReturnTypes] as number
        );

        break;
      }

      case "address": {
        value = field[metadataField.name as keyof APIArrayReturnTypes];

        value =
          value.address_1 +
          " " +
          value.address_2 +
          (value.address_2 ? ", " : " ") +
          value.city +
          " " +
          value.state +
          " " +
          value.postcode;

        break;
      }

      case "url": {
        value = field[metadataField.name as keyof APIArrayReturnTypes] ? (
          <StyledLink
            to={
              field[metadataField.name as keyof APIArrayReturnTypes] as string
            }
          >
            {field[metadataField.name as keyof APIArrayReturnTypes] as string}
          </StyledLink>
        ) : (
          ""
        );

        break;
      }

      case "percentage": {
        value = `${field[metadataField.name as keyof APIArrayReturnTypes]}%`;

        break;
      }

      case "lineitem": {
        value = "lineitem";

        break;
      }

      case "phone": {
        const phoneFields = field.Phones?.find(
          (e: { PhoneType: string }) => e.PhoneType === metadataField.name
        );

        value = phoneFields?.PhoneNumber
          ? `+${phoneFields?.PhoneCountryCode} ${phoneFields?.PhoneAreaCode} ${phoneFields?.PhoneNumber}`
          : null;

        break;
      }

      default:
        value = field[metadataField.name as keyof APIArrayReturnTypes];
    }

    return {
      key: metadataField.label,
      value: value as string | number | ReactElement,
    };
  });
};
