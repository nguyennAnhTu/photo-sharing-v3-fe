import React, { useEffect, useState } from "react";
import fetchModel from "../../libs/fetchModelData";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, Typography } from "@mui/material";

function UserList(props) {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isInSidebar = location.pathname !== "/users";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetchModel(`api/user/list`, "GET");
        const users = await response.json();
        console.log(users);
        setUsers(users);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (!!props.loginUser) {
    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">Error: {error}</Typography>;
    //if (!users.length) return <Typography>No users found</Typography>;

    return (
      <div>
        {!isInSidebar && <Typography>Users</Typography>}
        <List component="nav">
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem component={Link} to={`/users/${user._id}`}>
                <ListItemText
                  primary={`${user.first_name} ${user.last_name}`}
                  secondary={
                    !isInSidebar
                      ? `${user.occupation} - ${user.location}`
                      : null
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </div>
    );
  } else {
    return <Typography>Please login to see this page</Typography>;
  }
}

export default UserList;
