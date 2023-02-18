import React, { useState, useEffect, useContext } from "react";
import { AzureFunctions, CallFunction } from "./AzureFunctions";
import PowerBIReportDetails from "./PowerBIReportDetails";
import { TeamsFxContext } from "../Context";


// function setReportsListByAzure_v1(user, setReportsListDelegate)
// {
//     var url = "https://embeddingpowerbireport.azurewebsites.net/api/GetReportsList";
//     const myBody = {
//                     "upn": user.userName,
//                    };
                  
//   const myInit = {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'},
//       //mode: 'no-cors',
//       cache: 'default', 
//       body: JSON.stringify(myBody)  
//     };
   

    
//     fetch(url, myInit)
//     .then((response) => response.json())
//     .then((response) => 
//         {
//             console.log(`response received from Azure Function '${url}'`);
//             console.log(response);
//             setReportsListDelegate(response);
//         })
//     .catch((error) => console.log(error));

// }

function setReportsListByAzure(user, teamsUserCredential, setReportsListDelegate)
{
    if (user.userName !== "")
    {
        const body = {
                        "upnCaller": user.userName,
                        "upnRequested": user.requestedUserName,
                    };
        
        CallFunction("GetReportsList", body, teamsUserCredential).then((data) => {
            console.log("AzureFunctions | GetReportsList | data", data);
            setReportsListDelegate(data);
        })
        .catch((error) => console.log(error));
    }
}

function updateReportsList(user, teamsUserCredential, setReportsListDelegate)
{
    if (1==1)
    {
        setReportsListByAzure(user, teamsUserCredential, setReportsListDelegate);
    }
    else
    {
        setReportsListFake(user, setReportsListDelegate); 
    }
}

function setReportsListFake(user, setReportsListDelegate)
{
    setReportsListDelegate([
        {name:'report1', author: user.fullName, creationDate: "2023/02/09", email: user.userName, groupId:"58983dbb-1358-44ce-aa9c-897edd6d034d", reportId: "4dd26748-294e-4544-a024-54579bdb3049", description: 'description report1'},
        {name:'report2', author: user.fullName, creationDate: "2023/02/09", email: user.userName, groupId:"58983dbb-1358-44ce-aa9c-897edd6d034d", reportId: "9f3a6a10-0b45-4afc-90ac-1687c0d22bbd", description: 'description report2'},
        {name:'report3', author: user.fullName, creationDate: "2023/02/09", email: user.userName, groupId:"58983dbb-1358-44ce-aa9c-897edd6d034d", reportId: "7049dba5-8fa5-41ac-bf6b-6553354fb00a", description: 'description report3'},
    ]);   
}

function PowerBIReportsList(props) 
{
    const { user } = props;
    const { onReportOpen } = props;
    const [reportsList,  setReportsList] = useState([]);
    const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;

    //When the User property changes, update the reports list
    useEffect(() => 
    {
        console.log("onReportOpen: ");
        
        updateReportsList(user, teamsUserCredential, setReportsList);
    }, [user]);
    
    return (  
        <div> 
            <h3>Reports Available:</h3> 
            {
                reportsList.map((report, index) => 
                {
                    return (
                        <div key={index} >
                            <PowerBIReportDetails reportInfo={report} onReportOpen={onReportOpen}/>   
                        </div>);
                }) 
            }
        </div>
    );
}

// function onReportOpen(report)
// {
//     console.log("Report loaded: " + report.name);
// };


export default PowerBIReportsList;
