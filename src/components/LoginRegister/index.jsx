import { useState } from "react";
import { Grid, Paper, Typography, TextField, Button, Dialog } from "@mui/material";
import fetchModel from "../../libs/fetchModelData";
import { Navigate } from "react-router-dom";

function LoginRegister(props) {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [userid, setUserid] = useState();
    const [occupation, setOccupation] = useState();
    const [description,setDescription] = useState();
    const [loginFalse, setLoginFalse] = useState(false);
    const [open, setOpen] = useState(true);
    const [error, setError] = useState(null);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchModel(
                "api/user/login",
                "POST",
                {
                    username: loginUsername,
                    password: loginPassword
                }
            );
            console.log(response);
            if (response.status === 400) {
                setLoginFalse(true)
                alert("Thong tin dang nhap khong chinh xac");
                return;
            }
            
            const userData = await response.json();
            console.log(userData);
            await props.onLogin(userData);
        } catch(error) {
            setLoginFalse(true);
        }
    }

    const handleOpenRegisterForm = () => {
        setOpen(true);
    }

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (registerPassword !== confirmPassword) {
            alert("Password and confirm password must same");
            return;
        }
        try {
            const response = await fetchModel(
                `api/user/register`,
                'POST',
                {
                    username: registerUsername,
                    password: registerPassword,
                    first_name: firstName,
                    last_name: lastName,
                    location: location,
                    occupation: occupation,
                    description: description
                }
            );
            if (response.status===200) {
                alert('Register success');
                setRegisterUsername('');
                setRegisterPassword('');
                setConfirmPassword('');
                setDescription('');
                setFirstName('');
                setLastName('');
                setLocation('');
                setOccupation('');
            } else if (response.status===400) {
                alert('Username already existed');
            }
        } catch(error) {
            setError(error);
        }
    }

    if(props.loginUser) {
        console.log(`user: ${props.loginUser}`);
        return <Navigate to={`/`} state={{ from: "/login-register" }} replace />;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h6" gutterBottom>
                    Đăng nhập
                </Typography>
                <form onSubmit={handleLoginSubmit}>
                    <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Tên đăng nhập"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                    />
                    <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Mật khẩu"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    />
                    <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 2 }}
                    >
                    Đăng nhập
                    </Button>
                </form>
                </Paper>
            </Grid>

            <Grid item xs={6}>
                <Paper elevation={3} style={{ padding: 20 }}>
                    <Typography variant="h6" gutterBottom>
                        Đăng ký
                    </Typography>
                    <form onSubmit={handleRegisterSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Username"                           
                            value={registerUsername}
                            onChange={(e) => setRegisterUsername(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Password"
                            type="password"
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Confirm password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="First name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Last name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Occupation"
                            value={occupation}
                            onChange={(e) => setOccupation(e.target.value)}
                        
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            sx={{mb: 2}}
                        >
                            Register
                        </Button>
                    </form>

                </Paper>
            </Grid>
            
        </Grid>
    )
}

export default LoginRegister;