import React from "react";
import {
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import { Search } from "react-feather";
import "./style.css";
import { useTranslation } from "react-i18next";

const SessionsFilter = ({
  sort,
  handleSort,
  selectedType,
  setSelectedType,
  types,
  setSearch,
}) => {
  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
      <div className="">
        <FormGroup
          className="d-flex m-0 margin-force-zero"
          style={{
            borderRadius: "10px",
            margin: "0 !important",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            height: "fit-content",
          }}
        >
          <Label
            for="exampleSelect"
            style={{
              width: "100%",
              alignSelf: "center",
              textAlignLast: "center",
              marginBottom: "0 !important",
              fontWeight: "800",
              fontSize: "15px",
            }}
          >
            {t("Sort By")}:
          </Label>
          <Input
            type="select"
            name="select"
            id="exampleSelect"
            value={sort}
            onChange={handleSort}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "14px",
            }}
          >
            <option value="created_at_desc">{t("Newest")}</option>
            <option value="created_at_asc">{t("Oldest")}</option>
            <option value="first_name_asc"> {t("A To Z")} </option>
            <option value="first_name_desc"> {t("Z To A")} </option>
          </Input>
        </FormGroup>
      </div>

      <div className="flex-grow-1 d-flex flex-wrap">
        {types.map((item) => (
          <Button
            key={item.value}
            className="w-25"
            block
            onClick={() =>
              setSelectedType(selectedType === item.value ? "" : item.value)
            }
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              borderRadius: "15px",
              backgroundColor: "#C8D0D0",
              padding: "10px",
              maxWidth: "200px",
            }}
            color={selectedType === item.value ? "primary" : "#C8D0D0"}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex-grow-1">
        <InputGroup>
          <InputGroupText
            addonType="prepend"
            style={{
              borderTopLeftRadius: "35px",
              borderBottomLeftRadius: "35px",
              borderRight: "none",
            }}
          >
            <Search />
          </InputGroupText>
          <Input
            onChange={(e) => setSearch(e.target.value)}
            style={{
              borderTopRightRadius: "35px",
              borderBottomRightRadius: "35px",
              borderLeft: "none",
            }}
            placeholder={t("Search...")}
          />
        </InputGroup>
      </div>
    </div>
  );
};

export default SessionsFilter;
