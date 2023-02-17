import './components.css'; 
// import './componentsDebug.css'; 
import React, { useState, useEffect, useContext } from 'react';
import { TeamsFxContext } from "../Context";
import { useData } from "@microsoft/teamsfx-react";
import PowerBITitle from './PowerBITitle';
import PowerBIUser from './PowerBIUser';
import PowerBIReportsList from './PowerBIReportsList';
import PowerBIEmbedder from './PowerBIEmbedder';
import { app, Context } from "@microsoft/teams-js";
import TestFunctions, { CreateEmbeddingCode, GetReportsList } from './AzureFunctions';


function PowerBIHub()
{
    function onSwitchUser()
    {
        if (userInfo.userName != "mrossi@mbonline19.onmicrosoft.com")
        {
            setUserInfo({
                fullName: "Mario Rossi", 
                userName: "mrossi@mbonline19.onmicrosoft.com"
            });
        }
        else
        {
            setUserInfo({
                fullName: "Luca Verdi", 
                userName: "lverdi@mbonline19.onmicrosoft.com"
            });
        }
        
    }

    function onReportOpen(report) 
    {
        console.log("PowerBIHub | onReportOpen: " + report.name);
        var newReportInfo = {...report};
        
        //Update local state
        setCurrentReport(newReportInfo); 
    }

    //Set infoContext
    const [infoContext, setInfoContext] = useState(
        {
            teamDisplayName: '',
            channelDisplayName: '',
            userPrincipalName: ''
        }); 
    useData(async () => {app.getContext().then((context) => 
                                {
                                    const newInfoContext = {...infoContext,
                                        teamDisplayName: context?.team?.displayName,
                                        channelDisplayName: context?.channel?.displayName,
                                        userPrincipalName: context?.user?.userPrincipalName};
                                    
                                    console.log("PowerBIHub | updating infoContext (setInfoContext)");
                                    setInfoContext(newInfoContext);
                                })
                            });

    

    //set userInfo
    const { teamsUserCredential } = useContext(TeamsFxContext);
    const [ userInfo, setUserInfo] =  useState({});
    useData(async () => {
        if (teamsUserCredential) 
        {
            teamsUserCredential.getUserInfo().then((userInfo) => { 
                console.log("PowerBIHub | updating userInfo (setUserInfo)");
                
                setUserInfo({
                    fullName: userInfo.displayName, 
                    userName: userInfo.preferredUserName
                }); 
            });
        }
    });

    //set tokenContextInfo
    // const { teamsContextCredential } = useContext(TeamsFxContext);
    // const [ tokenContextInfo, setTokenContextInfo] = useState('');
    // useData(async () => {
    //             if (teamsUserCredential) 
    //             {
    //                 teamsUserCredential.getToken().then((tokenInfo) => {
    //                     console.log("PowerBIHub | tokenInfo: " + JSON.stringify(tokenInfo));
    //                     setTokenContextInfo(tokenInfo);
    //                 });
    //             }
    //         });


    //set tokenContext
    // const [tokenContext, setTokenContext] = useState('');
    // const { loading, data, error } = useData(async () => {
    //     if (teamsUserCredential) {
    //         const tokenInfo = await teamsUserCredential.getToken();
    //         console.log("PowerBIHub | tokenInfo: " + JSON.stringify(tokenInfo));
    //         return tokenInfo;
    //     }
    //     else{
    //         console.log("PowerBIHub | teamsUserCredential is null");
    //     }
    //     });
    // const token = (loading || error) ? "": data;

    //currentReportInfo
    const [currentReportInfo, setCurrentReport] = useState({});
    
    
    return (
        <div className="hubMain debug">
            <header>
                <div className="left debug-left">
                    
                    <strong>Team: </strong>{infoContext.teamDisplayName}, <strong>Channel: </strong>{infoContext.channelDisplayName}, <strong>UserPrincipalName: </strong>{infoContext.userPrincipalName}
                </div>

                 <div className="right debug-right">
                    <div className='left debug-blue' >
                        <input type="button" value="switch demo" onClick={onSwitchUser}></input>
                    </div>
                    
                    <div className='right debug-green'>
                        <PowerBIUser user={userInfo}/>
                    </div>    
                    
                </div>   
                
            </header>

            <section>
                <nav>
                    <div className="nav debug-blue">
                        <PowerBIReportsList user={userInfo} onReportOpen={onReportOpen}/>
                    </div>
                </nav>
                <article className='debug-border'>
                    <div className='full debug-blue'>
                        <div className='left-right debug-top'>
                            <PowerBITitle reportInfo={currentReportInfo} />
                        </div>
                        <div className='stretch debug-bottom'>
                            <PowerBIEmbedder reportInfo={currentReportInfo} />
                            {/* <TestFunctions /> */}
                        </div>
                    </div>
                </article>
            </section>
            
            <footer>
                ADM PoC by Microsoft - 2023
            </footer>
        </div>
    );
}

export default PowerBIHub;