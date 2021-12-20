import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function SearchItem(props) {
  return (
    <ListItem disablePadding>
      <ListItemButton onClick={props.handleClick}>
        <ListItemText primary={props.listText} />
      </ListItemButton>
    </ListItem>
  );
}
