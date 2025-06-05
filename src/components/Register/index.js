import { useEffect, useState } from "react";
import fetchModel from "../../libs/fetchModelData";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Register() {
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
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerPassword !== confirmPassword) {
      alert("Password and confirm password must be same");
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
        alert("Register successfully");
        setRegisterUsername('');
        setRegisterPassword('');
        setConfirmPassword('');
        setDescription('');
        setFirstName('');
        setLastName('');
        setLocation('');
        setOccupation('');
        navigate("/");
      } else if(response.status===400) {
        alert("Username already existed");
      } else {
        alert("Error");
        return;
      }
    } catch(error) {
      setError(error);
    }
  }

  useEffect(() => {
    if (registerPassword && confirmPassword) {
      if (registerPassword !== confirmPassword) {
        setError('Password not match')
      } else {
        setError(null);
      }
    } else {
      setError('');
    }
  }, [registerPassword, confirmPassword])

  return (
    <div>
      <form onSubmit={handleRegister} >
        <label>Username: </label>
        <input type="text" placeholder="username" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} />
        <br />

        <label>Password: </label>
        <input 
          type="password" 
          placeholder="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)} 
        />
        <br />

        <span>Confirm password: </span>
        <input 
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        {error && (
          <p color="error">{error}</p>
        )}

        <span>First name: </span>
        <input 
          type="text"
          placeholder="first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />

        <span>Last name: </span>
        <input 
          type="text"
          placeholder="last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />

        <span>Location: </span>
        <TextField
          placeholder="Location" 
          onChange={(e) => setLocation(e.target.value)}
          style={{padding: 5}}
          value={location}
        />
        <br />
        
        <span>Description: </span>
        <TextField
          placeholder="Description" 
          onChange={(e) => setDescription(e.target.value)}
          style={{padding: 5}}
          value={description}
        />
        <br />

        <span>Occupation: </span>
        <TextField
          placeholder="Occupation" 
          onChange={(e) => setOccupation(e.target.value)}
          style={{padding: 5}}
          value={occupation}
        />
        <br />

        <button type="submit" >Register</button>
      </form>
    </div>
  )
}

export default Register;