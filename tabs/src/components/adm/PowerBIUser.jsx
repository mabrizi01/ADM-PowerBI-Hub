

function PowerBIUser(props) 
{ 
    const {user} = props;
    
    return (
        <div>
            <strong>Report view for: </strong>{user.requestedFullName} - ({user.requestedUserName})
        </div>
    );
}

export default PowerBIUser;