import React, { useState, useEffect, useContext } from "react";
import { models, Report, Embed, service, Page } from "powerbi-client";
import { PowerBIEmbed } from "powerbi-client-react";
import { TeamsFxContext } from "../Context";
import { AzureFunctions, CallFunction } from "./AzureFunctions";
import "./PowerBIEmbedder.css";

function EmptyContent(props)
{
  console.log("EmptyContent");
  return (
    <></>
    )
}

function NoReport(props)
{
  console.log("NoReport");
  return (
    <div>
      <h1>No Report to show</h1>
      </div>
    )
}

function TestContent(props)
{
  console.log("TestContent");
  //Get report details from the parent component
  const {reportInfo} = props;

  return (
    <div>
      <h1>RenderTest </h1>
      <h2>Report Name: {reportInfo.name}</h2>
      <h2>Tenant Id: {reportInfo.tenantID}</h2>
      <h2>Group Id: {reportInfo.groupId}</h2>
      <h2>Report Id: {reportInfo.reportId}</h2>
      </div>
    )
}

function ReportEmbedder(props)
{
  //Get report details from the parent component
  const {reportInfo} = props;

  //Get current user's access credentials
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;

  //Create a state variable to store the response from the Azure Function
  const emptyResponseConfig = {ReportId: "", EmbedUrl: "", EmbedToken: ""};
  const [responseConfig,  setResponseConfig] = useState(emptyResponseConfig);
  

  function AzureFunction_CreateEmbeddingCode(reportInfo, teamsUserCredential)
  {
      console.log("calling AzureFunction_CreateEmbeddingCode | reportInfo: " + JSON.stringify( reportInfo));

      if (reportInfo != undefined && reportInfo != null 
        && reportInfo.reportId != undefined && reportInfo.reportId != null)
      {
          const body = {
            "upnCaller": reportInfo.user.userName,
            "powerBIReportId": reportInfo.powerBIReportID,
            "tenantId": reportInfo.tenantID,
            "groupId": reportInfo.groupId,
            "reportId": reportInfo.reportId,
            "param1": reportInfo.param1,
            "param2": reportInfo.param2,
            "param3": reportInfo.param3,
            "param4": reportInfo.param4,
            "param5": reportInfo.param5
          }

        console.log("calling AzureFunctions CreateEmbeddingCode | body: ", body);
    
        CallFunction("CreateEmbeddingCode", body, teamsUserCredential).then((data) => 
          {
            console.log("called AzureFunctions | CreateEmbeddingCode | data: ", data);
            setResponseConfig(data);
          })
    .catch((error) => console.log(error));
      }
    
  } 

  console.log("RenderEmbedder: " + JSON.stringify(responseConfig));

  //When the reportInfo property changes, update the report area
  useEffect(() => 
  {
      setResponseConfig(emptyResponseConfig);
      AzureFunction_CreateEmbeddingCode(reportInfo, teamsUserCredential);
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
  //Get report details from the parent component
  const {reportInfo} = props;

  //If the report details are not defined, then render the empty content
  const renderNoReport = reportInfo === undefined || reportInfo === null
    || reportInfo.tenantID === undefined || reportInfo.groupId===undefined || reportInfo.reportId===undefined;
  console.log("reportInfo: " + JSON.stringify(reportInfo));
  console.log("renderNoReports: " + renderNoReport);
  
  const renderEmpty = !renderNoReport && (reportInfo.tenantID === '' 
    || reportInfo.groupId === '' 
    || reportInfo.reportId === '');
  console.log("renderEmpty: " + renderEmpty);
 
  
  if (renderNoReport)
  {
    return <NoReport />
  }
  else if (renderEmpty)
  {
    return <EmptyContent />
  }
  else 
  {
    if (1 == 1)
    {
      return <ReportEmbedder reportInfo={reportInfo}/>
    }
    else
    {
      return <TestContent reportInfo={reportInfo}/>
    }      
  }     
}

export default PowerBIEmbedder;