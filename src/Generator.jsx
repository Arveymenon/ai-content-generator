import './App.css';
import React from 'react';
import { generateData } from './api/generator';
import Loader, {  } from './utils/loader';

const defaultGeneratorData = {
  type: "blog",
  company_name: "",
  industry_name: "",
  blog_type: "",
  topic: "",
  idea: ""
}

const blogMandataoryField = [
  "company_name",
  "industry_name",
  "blog_type",
  "topic"
]
const logoMandataoryField = [
  "company_name",
  "industry_name"
]

function Generator () {
    const [ loading, setLoading ] = React.useState(false)
    const[ notification, setNotification] = React.useState("")
    const[ generatedData, setGeneratedData]  = React.useState("")
    const[ disableGenerate, setDisableGenerate]  = React.useState(true)

    const user = localStorage.getItem("User")
    const[ userData, setUserData]  = React.useState(user !== "undefined" && JSON.parse(user))
    const[ userDataRequired, setUserDataRequired]  = React.useState(!userData)
  
    const [ generatorData, setGeneratorData] = React.useState(defaultGeneratorData)

    let formGenerateData = async () => {
        setLoading(true)
        userDataRequired && setUserDataRequired(!userData)
        let response = await generateData(generatorData, userData)
        setLoading(false)
        if(response.message){
          setNotification(response.message)
          return
        }
        response && setGeneratedData(response)
    }
  
    const updateForm = ($e, key) => {
      setGeneratorData({...generatorData, [key]: $e.target.value})
      console.log(generatorData)
    }
  
    const getUserData = ($e, key) => {
      setUserData({...userData, [key]: $e.target.value})
      console.log(userData)
    }

    React.useEffect(() => {
      const userDataEmptyCheck = Object.keys(userData).findIndex(key=> userData[key] === "")

      if(generatorData.type === 'blog') {
        (blogMandataoryField.findIndex(key => generatorData[key] === "") > -1 ||
        userDataEmptyCheck > -1)
        ? setDisableGenerate(true) : setDisableGenerate(false) && setNotification("Kindly provide a few more details")
      }
       else {
        (logoMandataoryField.findIndex(key=> generatorData[key] === "") > -1 ||
        userDataEmptyCheck > -1)
        ? setDisableGenerate(true) : setDisableGenerate(false) && setNotification("Kindly provide a few more details")
      }

    }, [generatorData])

      return (
        <>

          <div className="App">
            <div id="type">
              <div onClick={()=>setGeneratorData({...generatorData, type: "blog"})}>Blog</div>
              <div onClick={()=>setGeneratorData({...generatorData, type: "logo"})}>Logo</div>
            </div>

              {notification}
              {
                userDataRequired && 
                <div>
                    <input type="test" id="name" placeholder="name" onChange={(event) => getUserData(event, "name")}/>
                    <input type="text" id="email" placeholder="email" onChange={(event) => getUserData(event, "email")}/>
                    <input type="text" id="mobile" placeholder="mobile" onChange={(event) => getUserData(event, "mobile")}/>
                </div>
              }
              
              {generatorData.type === 'blog' ?
              <>
                <input type="text" id="company_name" placeholder="company_name" onChange={(event) => updateForm(event, "company_name")}/>
                <input type="text" id="industry_name" placeholder="industry_name" onChange={(event) => updateForm(event, "industry_name")}/>
                <input type="text" id="blog_type" placeholder="blog_type" onChange={(event) => updateForm(event, "blog_type")}/>
                <input type="text" id="topic" placeholder="topic" onChange={(event) => updateForm(event, "topic")}/>
              </> 
              :
              <>
                <input type="text" id="company_name" placeholder="company_name" onChange={(event) => updateForm(event, "company_name")}/>
                <input type="text" id="industry_name" placeholder="industry_name" onChange={(event) => updateForm(event, "industry_name")}/>
                <input type="text" id="idea" placeholder="idea (optional)" onChange={(event) => updateForm(event, "idea")}/>
              </>
              }

              <button disabled={disableGenerate} onClick={formGenerateData}>GENERATE {generatorData.type.toUpperCase()}</button>
              { loading && <Loader />}
              {generatorData.type === 'blog' ?
              <div dangerouslySetInnerHTML={{__html: generatedData}} />
              :
              generatedData?.data?.length &&
                <img src={generatedData.data[0].url} alt={generatedData.data[0].url} />
              }

          </div>
        </>
      );
}

export default Generator