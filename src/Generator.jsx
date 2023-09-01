import "./App.css";
import React from "react";
import { generateData } from "./api/generator";
import Loader from "./utils/loader";
import { Button, TextField, Tabs, Tab } from "@mui/material";
import Box from "@mui/material/Box";
import SharedCustomSelect from "./Shared/Components/Select";
import CustomSelect from "./Shared/Components/Select2";
import { blog_types, industries } from "./utils/data";
// import { Select, Option } from '@mui/base';

const defaultGeneratorData = {
  type: "blog",
  company_name: "",
  industry_name: "",
  blog_type: "",
  topic: "",
  idea: "",
};

const blogMandataoryField = [
  "company_name",
  "industry_name",
  "blog_type",
  "topic",
];
const logoMandataoryField = ["company_name", "industry_name"];

function Generator() {
  const [loading, setLoading] = React.useState(false);
  const [notification, setNotification] = React.useState("");
  const [generatedData, setGeneratedData] = React.useState("");
  const [disableGenerate, setDisableGenerate] = React.useState(true);

  const user = localStorage.getItem("User");
  const [userData, setUserData] = React.useState(user && JSON.parse(user));
  
  const [showUserFields, setShowUserFields] = React.useState(false);

  const [generatorData, setGeneratorData] =
    React.useState(defaultGeneratorData);

  let formGenerateData = async () => {
    setLoading(true);
    
    const userDataEmptyCheck =
      userData ? Object.keys(userData).findIndex((key) => userData[key] === "") > -1 : true;

    if(userDataEmptyCheck) {
      setShowUserFields(userDataEmptyCheck)
      return
    }

    let response = await generateData(generatorData, userData);
    setLoading(false);
    if (response.message) {
      setNotification(response.message);
      return;
    }
    if(response){
      setGeneratedData(response);
      setNotification("");
    }
  };

  const updateForm = ($e, key) => {
    setGeneratorData({ ...generatorData, [key]: $e.target.value });
    console.log(generatorData);
  };

  const getUserData = ($e, key) => {
    setUserData({ ...userData, [key]: $e.target.value });
    console.log(userData);
  };

  React.useEffect(() => {

    const userDataEmptyCheck = showUserFields &&
      Object.keys(userData).findIndex((key) => userData[key] === "") > -1;

    if (generatorData.type === "blog") {
      blogMandataoryField.findIndex((key) => generatorData[key] === "") > -1 ||
      userDataEmptyCheck
        ? setDisableGenerate(true)
        : setDisableGenerate(false);
    } else {
      logoMandataoryField.findIndex((key) => generatorData[key] === "") > -1 ||
      userDataEmptyCheck
        ? setDisableGenerate(true)
        : setDisableGenerate(false)
    }
  }, [generatorData]);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          onChange={(ev, value) =>
            setGeneratorData({ ...generatorData, type: value })
          }
          aria-label="basic tabs example"
        >
          <Tab label="Blog" value="blog" />
          <Tab label="Logo" value="logo" />
        </Tabs>
      </Box>
      <div>
        <div className="App">
          {notification}

          {generatorData.type === "blog" ? (
            <>
              <TextField
                className={"my-form-input"}
                label="Company Name"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="Company Name"
                onChange={(event) => updateForm(event, "company_name")}
              />
              <CustomSelect
                className={"dd my-form-input"}
                label={"Industry Name"}
                required={true}
                onChange={(event) => updateForm(event, "industry_name")}
                options={industries}
                value={"test1"}
              />
              <TextField
                className={"my-form-input"}
                label="Topic"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="Topic"
                onChange={(event) => updateForm(event, "topic")}
              />
              <CustomSelect
                className={"dd my-form-input"}
                label={"Blog Type"}
                required={true}
                onChange={(event) => updateForm(event, "blog_type")}
                options={blog_types}
                value={"test1"}
              />
            </>
          ) : (
            <>
              <TextField
                className={"my-form-input"}
                label="Company Name"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="company_name"
                onChange={(event) => updateForm(event, "company_name")}
              />
               <CustomSelect
                className={"dd my-form-input"}
                label={"Industry Name"}
                required={true}
                onChange={(event) => updateForm(event, "industry_name")}
                options={industries}
                value={"test1"}
              />
              <TextField
                className={"my-form-input"}
                label="Idea (optional)"
                type="text"
                id="filled-password-input"
                placeholder="Idea"
                onChange={(event) => updateForm(event, "idea")}
              />
            </>
          )}
          {showUserFields && (
            <div>
              <TextField
                className={"my-form-input"}
                label="Name"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="Name"
                onChange={(event) => getUserData(event, "name")}
              />
              <TextField
                className={"my-form-input"}
                label="Email"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="Email"
                onChange={(event) => getUserData(event, "email")}
              />
              <TextField
                className={"my-form-input"}
                label="Mobile"
                type="text"
                required="true"
                id="filled-password-input"
                placeholder="Mobile"
                onChange={(event) => getUserData(event, "mobile")}
              />
            </div>
          )}

          <Button
            disabled={disableGenerate}
            onClick={formGenerateData}
            variant="outlined"
          >
            GENERATE {generatorData.type.toUpperCase()}
          </Button>
          {loading && <Loader />}
        </div>
        {generatorData.type === "blog" && !generatedData?.data?.length ? (
          <div dangerouslySetInnerHTML={{ __html: generatedData }} />
        ) : (
          generatedData?.data?.length && (
            <img
              src={generatedData.data[0].url}
              alt={generatedData.data[0].url}
            />
          )
        )}
      </div>
    </>
  );
}

export default Generator;
