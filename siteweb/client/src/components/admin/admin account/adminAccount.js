import React, { Component } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MonCompte from "../../client/account/mon compte/monCompte";
import PasswordEdit from "../../client/account/password edit/passwordEdit";
import "./adminaccount.css";
function AdminAccount(props) {
  props.funcNav(true);
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="admin-account">
      <div>
        <TabContext value={value}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <TabList
              onChange={handleChange}
              centered
              TabIndicatorProps={{ style: { background: "#d3ad32" } }}
            >
              <Tab
                label={
                  <span
                    style={{
                      color: "#0c1013",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    Details de compte
                  </span>
                }
                value="1"
              />
              <Tab
                label={
                  <span
                    style={{
                      color: "#0c1013",
                      fontWeight: "bold",
                      fontFamily: "Poppins",
                    }}
                  >
                    Mot de passe
                  </span>
                }
                value="2"
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <MonCompte />
          </TabPanel>
          <TabPanel value="2">
            <PasswordEdit />
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
}
export default AdminAccount;
