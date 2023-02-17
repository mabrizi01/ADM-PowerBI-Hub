import React, { useState, useEffect, useContext } from "react";
import { models, Report, Embed, service, Page } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { TeamsFxContext } from "../Context";
import { AzureFunctions, CallFunction } from "./AzureFunctions";
import "./PowerBIEmbedder.css";

function callAzureFunction_CreateEmbeddingCode_v1(reportDetails, setResponseConfigHandler)
  {

    console.log("callAzureFunction_CreateEmbeddingCode: " + JSON.stringify( reportDetails));

      var url = "https://embeddingpowerbireport.azurewebsites.net/api/CreateEmbeddingCode";
      // const myBody = {
      //                   "groupId": "58983dbb-1358-44ce-aa9c-897edd6d034d",
      //                   "reportId": "4dd26748-294e-4544-a024-54579bdb3049",
      //               };
      const myBody = {
                        "groupId": reportDetails.groupId,
                        "reportId": reportDetails.reportId,
                        "param1": reportDetails.param1,
                        "param2": reportDetails.param2,
                        "param3": reportDetails.param3,
                        "param4": reportDetails.param4,
                        "param5": reportDetails.param5
                    };
      const myInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'},
          //mode: 'no-cors',
          cache: 'default', 
          body: JSON.stringify(myBody)  
        };

        console.log("callin fetch");
        fetch(url, myInit)
                      .then((response) => response.json())
                      .then((response) => 
                      {
                          console.log("calling setResponseConfigHandler with response: " + JSON.stringify(response));
                          setResponseConfigHandler(response);
                      })
                      .catch((error) => console.log(error));
    }
 
    function callAzureFunction_CreateEmbeddingCode(reportDetails, teamsUserCredential, setResponseConfigHandler)
    {
      const body = {
        "groupId": reportDetails.groupId,
        "reportId": reportDetails.reportId,
        "param1": reportDetails.param1,
        "param2": reportDetails.param2,
        "param3": reportDetails.param3,
        "param4": reportDetails.param4,
        "param5": reportDetails.param5
    };
        CallFunction("CreateEmbeddingCode", body, teamsUserCredential).then((data) => {
        console.log("AzureFunctions | CreateEmbeddingCode | data", data);
        setResponseConfigHandler(data);
    })
    .catch((error) => console.log(error));
  }

function RenderEmptyContent(props)
 {
  console.log("RenderEmptyContent");
  return (
          
    <div>
      <h1>No Report to show</h1>
      </div>
    )
 }

 function RenderTest(props)
 {
  const {reportInfo} = props;
  console.log("RenderTest");
  return (
          
    <div>
      <h1>RenderTest </h1>
      <h2>Report Name: {reportInfo.name}</h2>
      <h2>groupId: {reportInfo.groupId}</h2>
      <h2>reportId: {reportInfo.reportId}</h2>
      </div>
    )
 }

function RenderEmbedder(props)
{
  const {reportInfo} = props;
  const [responseConfig,  setResponseConfig] = useState({});
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;

  //When the reportDetails property changes, update the report area
  useEffect(() => 
  {
    callAzureFunction_CreateEmbeddingCode(reportInfo, teamsUserCredential,setResponseConfig);
  }, [reportInfo]);
  

  return (
        <div className="App">
              <PowerBIEmbed
                  embedConfig={{
                    //hostname: "https://app.powerbigov.us/",
                    type: "report", // Supported types: report, dashboard, tile, visual and qna
                    id: responseConfig.ReportId,
                    embedUrl: responseConfig.EmbedUrl,
                    accessToken: responseConfig.EmbedToken,
                    tokenType: models.TokenType.Embed,
                    settings: {
                      panes: {
                        filters: {
                          expanded: false,
                          visible: false,
                        },
                        pageNavigation: {
                          visible: true,
                        },
                      },
                      background: models.BackgroundType.Transparent,
                    },
                  }}
                  eventHandlers={
                    new Map([
                      [
                        "loaded",
                        function () {
                          console.log("Report loaded");
                        },
                      ],
                      [
                        "rendered",
                        function () {
                          console.log("Report rendered");
                        },
                      ],
                      [
                        "error",
                      function (event) {
                          console.log(event.detail);
                        },
                      ],
                    ])
                  }
                  cssClassName={"report-style-class"}
                />
            
          </div>
        );
}

function PowerBIEmbedder(props) 
{
  const {reportInfo} = props;
  
  
  console.log("PowerBIEmbedder: " + JSON.stringify(reportInfo));

  if (reportInfo === undefined || reportInfo === null 
    || reportInfo.groupId===undefined || reportInfo.groupId === '' 
    || reportInfo.reportId===undefined || reportInfo.reportId === '' )
  {
    return RenderEmptyContent(props);
  }
  else
  {
    if (1 == 1)
    {
        return RenderEmbedder(props) 
    }
    else
    {
        return RenderTest(props);
    }      
  }     
}

export default PowerBIEmbedder;