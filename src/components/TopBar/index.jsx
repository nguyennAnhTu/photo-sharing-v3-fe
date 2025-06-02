import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Input,
  DialogActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import fetchModel from "../../libs/fetchModelData";
import { Navigate, useNavigate } from "react-router-dom";

function TopBar(props) {
  const [user, setUser] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetchModel(`api/user/logout`, "POST");
    if (response.status === 200) {
      props.onLogin(null);
      navigate(`/login-register`);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOpen(true);
      setError(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedImage) {
      setError(`Please select image`);
      return;
    }
    try {
      const formData = new FormData();
      formData.append(`photo`, selectedImage);

      const response = await fetch(
        `https://9cyzc7-8081.csb.app/api/photo/new`,
        {
          method: "POST",
          headers: {
            credentials: "include",
          },
          body: formData,
          credentials: "include",
        }
      );
      if (response.status === 200) {
        alert("Upload success");
        handleCloseDialog();
      } else {
        setError(`Error while upload image`);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (props.loginUser) {
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
            Hi {props.loginUser.first_name} {props.loginUser.last_name}
          </Typography>
          <Grid item xs={6} sm={4} md={2} lg={2}>
            <Button
              variant="contained"
              onClick={handleOpenDialog}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                py: 1,
                borderRadius: 2,
                bgcolor: "#4caf50",
                color: "white",
                mr: 2,
                "&:hover": { bgcolor: "#388e3c" },
              }}
            >
              Upload
            </Button>
          </Grid>
          <Dialog
            open={open}
            onClose={handleCloseDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Upload Image</DialogTitle>
            <DialogContent>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              {previewUrl && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                fullWidth
                sx={{ mb: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseDialog}
                sx={{ textTransform: "none", color: "text.secondary" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadSubmit}
                variant="contained"
                sx={{
                  textTransform: "none",
                  bgcolor: "#4caf50",
                  "&:hover": { bgcolor: "#388e3c" },
                }}
              >
                Upload
              </Button>
            </DialogActions>
          </Dialog>

          <Button
            title="Log out"
            onClick={handleLogout}
            variant="contained"
            sx={{
              textTransform: "none",
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 2,
              borderColor: "white",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.1)",
                borderColor: "white",
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  } else {
    return (
      <AppBar className="topbar-appBar" position="absolute">
        <Toolbar>
          <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
            Please Login
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Typography variant="h6" color="inherit">
              Photo sharing app
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
