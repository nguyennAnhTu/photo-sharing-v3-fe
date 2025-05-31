import { Component, useEffect, useState } from "react";
import fetchModel from "../../libs/fetchModelData";
import { Link, useParams } from "react-router-dom";
import { Grid, Typography ,Paper, Button } from "@mui/material";

function UserDetail(props) {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async() => {
            try {
                const response = await fetchModel(`api/user/${userId}`, "GET");
                const user = await response.json();
                console.log(user);
                setUser(user);
            } catch(error) {
                console.log(error);
                setLoading(false);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId])

    if(loading) return <Typography>Loading...</Typography>
    if(error) return <Typography color={"red"}>Error: {error}</Typography>
    if (!user) {
      return <Typography variant="body1">User not found</Typography>;
    }

    if(props.loginUser) {
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    {user.first_name} {user.last_name}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            <strong>Occupation:</strong> {user.occupation}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Location:</strong> {user.location}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            <strong>Description:</strong> {user.description}
                        </Typography>
                    </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            component={Link}
                            to={`/photos/${user._id}`}
                            variant="contained"
                            color="primary"
                        >View photos</Button>
                    </Grid>
                </Grid>
            </div>
        )
    } else {
        return <Typography>Please login to see this page</Typography>
    }
}

export default UserDetail;