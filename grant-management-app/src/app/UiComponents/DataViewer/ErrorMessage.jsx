import {Alert} from "@mui/material";

export default function ErrorMessage({error}) {
    return (
          <Alert severity="error">{error}</Alert>
    )
}