function PowerBIReportDetails(props) {
  const {
    reportInfo,
    onReportOpen } = props;
  
  return (
    <div className="box">
        <h4><strong>Name: </strong>{reportInfo.name}</h4> 
        <h4><strong>Author: </strong>{reportInfo.author}</h4> 
        <h4><strong>PowerBIReport: </strong>{reportInfo.powerBIReportID}</h4> 
        <h4><strong>Tenant: </strong>{reportInfo.tenantID}</h4>
        <h4><strong>Group: </strong>{reportInfo.groupId}</h4>
        <h4><strong>Report: </strong>{reportInfo.reportId}</h4>
        <h4><strong>Params: </strong>{reportInfo.param1}, {reportInfo.param2}, {reportInfo.param3}, {reportInfo.param4}, {reportInfo.param5}</h4>
        <h4><strong>Description: </strong>{reportInfo.description}</h4>
        <button onClick={() => {
                                  console.log("PowerBIReportDetails | Report loaded: " + reportInfo.name);
                                  onReportOpen(reportInfo);
                                }}>Show Report</button>
        <button onClick={() => {
          onReportOpen({});
        }}>Close Report</button>
    </div>
  );
}   

export default PowerBIReportDetails;