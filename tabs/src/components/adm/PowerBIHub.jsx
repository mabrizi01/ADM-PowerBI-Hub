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
        
        if (userInfo.requestedUserName != "mrossi@MngEnvMCAP203777.onmicrosoft.com")
        {
            const newUserInfo = {...userInfo, 
                                    requestedFullName: "Mario Rossi", 
                                    requestedUserName: "mrossi@MngEnvMCAP203777.onmicrosoft.com"
                                };
            setUserInfo(newUserInfo);
        }
        else
        {
            const newUserInfo = {...userInfo, 
                requestedFullName: "Luca Verdi", 
                requestedUserName: "lverdi@MngEnvMCAP203777.onmicrosoft.com"
            };
            setUserInfo(newUserInfo);
            
        }
        
    }

    function onReportOpen(report) 
    {
        console.log("PowerBIHub | onReportOpen: " + report.name);
        
        //Update local state
        var newReportInfo = {...report, user: userInfo};
        setCurrentReport(newReportInfo); 
    }

    //Set currentReportInfo
    const emptyReportInfo={};
    const [currentReportInfo, setCurrentReport] = useState(emptyReportInfo);

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
    const [ userInfo, setUserInfo] =  useState({fullName: '', userName: '', requestedFullName: '', requestedUserName: ''});
    useData(async () => {
        if (teamsUserCredential) 
        {
            teamsUserCredential.getUserInfo().then((teamsUserInfo) => { 
                console.log("PowerBIHub | updating userInfo (setUserInfo)");
                
                setUserInfo({
                    fullName: teamsUserInfo.displayName, 
                    userName: teamsUserInfo.preferredUserName,
                    requestedFullName: teamsUserInfo.displayName,
                    requestedUserName: teamsUserInfo.preferredUserName
                }); 
            });
        }
    });

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