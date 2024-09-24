import {Container} from "@mui/material";

export default function Layout({children}) {
    return (
          <Container maxWidth="xxl">
              {children}
          </Container>
    )
}