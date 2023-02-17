import { useContext, useState } from "react";
import { useData } from "@microsoft/teamsfx-react";
import * as axios from "axios";
import { BearerTokenAuthProvider, createApiClient, TeamsUserCredential } from "@microsoft/teamsfx";
import { TeamsFxContext } from "../Context";
import admConfig from "./lib/admConfig";

export async function CallFunction(functionName: string, body:any, teamsUserCredential?: TeamsUserCredential) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = admConfig.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(async () => (await teamsUserCredential.getToken(""))!.token));
    const response = await apiClient.post(functionName, body);
    return response.data;
  } catch (err: unknown) {
    if (axios.default.isAxiosError(err)) {
      let funcErrorMsg = "";

      if (err?.response?.status === 404) {
        funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy to the cloud") first before running this App`;
      } else if (err.message === "Network Error") {
        funcErrorMsg =
          "Cannot call Azure Function due to network error, please check your network connection status and ";
        if (err.config?.url && err.config.url.indexOf("localhost") >= 0) {
          funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
        } else {
          funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision in the cloud" and "Teams: Deploy to the cloud) first before running this App`;
        }
      } else {
        funcErrorMsg = err.message;
        if (err.response?.data?.error) {
          funcErrorMsg += ": " + err.response.data.error;
        }
      }

      throw new Error(funcErrorMsg);
    }
    throw err;
  }
}

 

export default function TestFunctions()
{
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;
  
  async function GetReportsList(body?:any) {
    //const { loading, data, error } = useData(() => callFunction("GetReportsList", teamsUserCredential));
    console.log("AzureFunctions | Calling GetReportsList");
    
    // Asynchronous Call
    return await CallFunction("GetReportsList", body, teamsUserCredential);
    
    // Synchronous Call  
    // CallFunction("GetReportsList", body, teamsUserCredential).then((data) => {
    //   console.log("AzureFunctions | GetReportsList | data", data);
    //   });
    
      console.log("AzureFunctions | Called GetReportsList");
  }
  
   async function CreateEmbeddingCode(body?:any) 
   {
      
      console.log("AzureFunctions | Calling CreateEmbeddingCode"); 
      // Asynchronous Call
      return await CallFunction("CreateEmbeddingCode", body, teamsUserCredential);

      // Synchronous Call 
      // CallFunction("CreateEmbeddingCode", body, teamsUserCredential).then((data) => {
      //   console.log("AzureFunctions | GetReportsList | data", data);
      // });
    console.log("AzureFunctions | Called CreateEmbeddingCode");
  }
  
  async function Test(body?:any) 
   {
      
      console.log("AzureFunctions | Calling Test"); 
      // Asynchronous Call
      return await CallFunction("Test", body, teamsUserCredential);

     
    console.log("AzureFunctions | Called Test");
  }
  function onGetReportsList() 
  {
    GetReportsList({upn: "admin@mbonline19.onmicrosoft.com"}).then((data) => {
        console.log("AzureFunctions | GetReportsList | data", data);
        });
  }

  function onCreateEmbeddingCode() 
  {
    CreateEmbeddingCode({groupId: "58983dbb-1358-44ce-aa9c-897edd6d034d", reportId: "9f3a6a10-0b45-4afc-90ac-1687c0d22bbd"}).then((data) => {
      console.log("AzureFunctions | GetReportsList | data", data);
    });
  }
  
  function onTest() 
  {
    Test().then((data) => 
    {
      setTestResult(data);
      console.log("AzureFunctions | GetReportsList | data", data);
    });
  }

  const [testResult, setTestResult] = useState<any>(null);

  return (
    <div>
      <input type="button" value="EmbeddingReport" onClick={onCreateEmbeddingCode}></input>
      <input type="button" value="GetReportsList" onClick={onGetReportsList}></input>
      <input type="button" value="Test" onClick={onTest}></input>
      <input type="text" value={testResult}></input>
    </div>
  );
}