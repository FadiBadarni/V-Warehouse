import React from "react";
import { Grid, TextField } from "@mui/material";

const AttributeFields = ({
  attributes,
  handleAttributeChange,
  isExistingItem,
}) => {
  return attributes.map((attribute, index) => (
    <React.Fragment key={index}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Attribute Name ${index + 1}`}
          value={attribute.attributeName}
          onChange={(e) =>
            handleAttributeChange(index, "attributeName", e.target.value)
          }
          disabled={isExistingItem}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Attribute Value ${index + 1}`}
          value={attribute.attributeValue}
          onChange={(e) =>
            handleAttributeChange(index, "attributeValue", e.target.value)
          }
          disabled={isExistingItem}
        />
      </Grid>
    </React.Fragment>
  ));
};

export default AttributeFields;
