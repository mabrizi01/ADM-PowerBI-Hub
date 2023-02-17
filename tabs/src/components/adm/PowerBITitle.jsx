
import React from 'react';

function PowerBITitle(props) 
{
    const { reportInfo } = props;

    console.log("PowerBITitle: " + JSON.stringify(reportInfo));

    if (reportInfo === undefined || reportInfo === null 
        || reportInfo.name === undefined || reportInfo.name === null || reportInfo.name === '')
    {
        return (
            <div>
                <h2>No Report Info available</h2>
            </div>
        )
    }
    else
    {
        const authorDefined = !(reportInfo.author === undefined || reportInfo.author === null || reportInfo.author === '');
    
        return (
            <div className='left-right debug'>
                <div className='left debug-left'>
                    <div className='left debug-blue'>
                        <strong>Name: </strong>{ reportInfo.name }
                        <br />
                        <strong>Description: </strong>{ reportInfo.description }
                    </div>                 
                </div>
                <div className='right debug-right'>
                    <div className='left debug-blue'>
                        <strong>Author: </strong>{ authorDefined ? reportInfo.author : 'Unknown'}
                        <br />
                        <strong>Creation Date: </strong>{reportInfo.creationDate}
                    </div>
                </div>
            </div>
        )
    }
};

export default PowerBITitle;