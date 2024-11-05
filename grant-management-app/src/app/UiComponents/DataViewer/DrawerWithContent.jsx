import {useState, useEffect} from "react";
import {Button, Container, Drawer, IconButton} from "@mui/material";
import {FaTimes} from "react-icons/fa";

function DrawerWithContent({component: Component, item, extraData, rerender}) {
    const [open, setOpen] = useState(false);

    const handleToggle = () => setOpen(!open);

    useEffect(() => {
        if (rerender) {
            setOpen(false);
        }
    }, [rerender]);

    return (
          <>
              <Button onClick={handleToggle} variant="outlined">
                  {extraData.label}
              </Button>
              <Drawer anchor="bottom" open={open} onClose={handleToggle}>
                  <Container
                        maxWidth="xl"
                        sx={{
                            p: 2,
                            height: "100vh",
                            overflowY: "auto",
                            position: "relative",
                        }}
                  >
                      <IconButton
                            onClick={handleToggle}
                            sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                            }}
                      >
                          <FaTimes/>
                      </IconButton>
                      <div>

                          <Component item={item} onClose={handleToggle} {...extraData} />
                      </div>
                  </Container>
              </Drawer>
          </>
    );
}

export default DrawerWithContent;
