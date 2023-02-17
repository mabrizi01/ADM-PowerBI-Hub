

function PowerBIUser(props) 
{ 
    const {user} = props;
    
    return (
        <div>
            <strong>Report view for: </strong>{user.fullName} - ({user.userName})
        </div>
    );
}

export default PowerBIUser;