import { Card, CardContent, CardMedia, Grid, Paper, TextField, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../libs/fetchModelData";

function UserPhotos(props) {
    const {userId} = useParams();
    const [photos, setPhotos] = useState();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const userResponse = await fetchModel(`api/user/${userId}`, "GET");
                if (userResponse.status===200) {
                    const userData = await userResponse.json();
                    console.log(`user: ${userData}`);
                    setUser(userData);
                }

                const photosResponse = await fetchModel(`api/photo/photosOfUser/${userId}`, "GET");
                const photosData = await photosResponse.json();
                console.log(`photos: ${photosData}`);
                setPhotos(photosData);
                console.log(photos);
            } catch(error) {
                console.log(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, [userId])

    const handleCommentSubmit = async (photoId) => {
        try {
            const response = await fetchModel(
                `api/photo/commentsOfPhoto/${photoId}`,
                "POST",
                {
                    comment: comments[photoId]
                }
            );
            if (response.status===200) {
                alert("comment success");
                setPhotos((prevPhotos) =>
                    prevPhotos.map((photo) =>
                    photo._id === photoId
                        ? {
                            ...photo,
                            comments: [
                            ...(photo.comments || []),
                                {
                                    _id: photoId,
                                    user_id: props.loginUser._id,
                                    user: {
                                    first_name: props.loginUser.first_name,
                                    last_name: props.loginUser.last_name,
                                    },
                                    comment: comments[photoId],
                                    date_time: new Date().toISOString(),
                                },
                            ],
                        }
                        : photo
                    )
                );
            setComments((prevComments) => ({
                ...prevComments,
                [photoId]: "",
            }));
            }
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }
    

    if (props.loginUser) {
        if (loading) return <Typography>Loading...</Typography>;
        if (error) return <Typography color="error">Error: {error}</Typography>;
        if (!user) {
            return <Typography variant="body1">User not found</Typography>;
        }

        const formatDate = (dateString) => {
        const date = new Date(dateString);
            return date.toLocaleString();
        };
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    Photos of {user.first_name} {user.last_name}
                </Typography>
                <Grid container spacing={3}>
                    {photos.map((photo) => (
                        <Grid item xs={12} key={photo._id}>
                            <Card>
                                <CardMedia
                                    style={{ objectFit: "contain", width: '60%', height:'auto' }}
                                    component={"img"}
                                    //height="400"
                                    //image={`/images/${photo.file_name}` || photo.file_name}
                                    image={photo.file_name || `/images/${photo.file_name}`}
                                    alt={`Photo by ${user.first_name}`}
                                >
                                </CardMedia>

                                <CardContent>
                                    <Typography variant="body2" color={"text.secondary"} gutterBottom>
                                        {formatDate(photo.date_time)}
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>Comments</Typography>
                                    {photo.comments && photo.comments.length > 0 ? (
                                    photo.comments.map((cmt) => (
                                        <Paper key={cmt._id} sx={{ p: 2, mb: 2 }}>
                                            <Typography variant="body2" color={"text.secondary"}>
                                                {formatDate(cmt.date_time)}
                                            </Typography>
                                            <Typography variant="body1" component={`div`}>
                                                <Link to={`/users/${cmt.user_id}`}>
                                                    {cmt.user.first_name} {cmt.user.last_name}
                                                </Link>
                                                : {cmt.comment}
                                            </Typography>
                                        </Paper>
                                        
                                    )))
                                : <Typography>No comments yet</Typography>}
                                </CardContent>

                                <Grid>
                                    <Typography variant="h6" gutterBottom>New comment</Typography>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        //label="Comment"
                                        value={comments[photo._id] || ''}
                                        onChange={(e) => setComments({...comments, [photo._id] : e.target.value})}
                                    ></TextField>

                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleCommentSubmit(photo._id)}
                                    >
                                        Comment
                                    </Button>
                                </Grid>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        )
    }
}

export default UserPhotos;