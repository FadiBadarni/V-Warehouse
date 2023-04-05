
import React ,{useState} from "react";
import { TextField, Button, Grid,MenuItem ,Select} from "@mui/material";

// import CheckMark from "./CheckMark";








const NewUser = ({handleSubmit,setYear,setEmail,setRole}) => {
    const [ role, setRole2] = useState("ADMIN");
    const [year, setYear2] = useState(1);

    const handleChangedYear=(year)=>{
        setYear(year)
        setYear2(year)
      }
      const handleChangedRole=(role)=>{
        setRole(role)
        setRole2(role)
      }


return (
    <form onSubmit={handleSubmit} className="equipment-management__form">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
        
        <TextField
            fullWidth
            id="Email"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
        />
        </Grid>
        <Grid item xs={12} md={6}>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={role}
            label="Role"
            onChange={(e)=>handleChangedRole(e.target.value)}
        >
            <MenuItem value={"ADMIN"}>ADMIN</MenuItem>
            <MenuItem value={"USER"}>USER</MenuItem>
            <MenuItem value={"TEACHER"}>TEACHER</MenuItem>
        </Select>
        </Grid>
    
        <Grid item xs={12}>
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={year}
            label="Year"
        
            onChange={(e)=>handleChangedYear(e.target.value)}
            
        >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={6}>6</MenuItem>
        </Select>
        </Grid>
        <Grid item xs={12} className="equipment-management__checkmark">
          {/* <CheckMark show={showCheckMark} /> */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Button
            type="submit"
            className="equipment-management__submit-button"
            variant="contained"
            color="primary"
            fullWidth
          >
            Add New User
          </Button>
        </Grid>
      </Grid>
     </form>
  );
};

export default NewUser;