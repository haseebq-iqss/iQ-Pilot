import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { FormEvent, useContext, useState } from "react";
import { PageFlex, ColFlex, RowFlex } from "./../../style_extensions/Flex";
import { useNavigate } from "react-router-dom";
import useAxios from "../../api/useAxios";
import { useMutation } from "@tanstack/react-query";
import SnackbarContext from "../../context/SnackbarContext";
import { SnackBarContextTypes } from "../../types/SnackbarTypes";
import { UserTypes } from "../../types/UserTypes";

type roleTypes = "admin" | "driver" | "employee";

function Signup() {
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState("/images/logo-blue.png");
  const [currPosition, setCurrPosition] = useState<Array<number>>([0]);
  const [role, setRole] = useState<roleTypes>("employee");

  const signupMF = (loginData: any) => {
    return useAxios.post("auth/signup", loginData);
  };

  const { setOpenSnack }: SnackBarContextTypes = useContext(SnackbarContext);

  const { mutate: signupUser, status: loginStatus } = useMutation({
    mutationFn: signupMF,
    onSuccess: (data) => {
      console.log(data.data);
      setOpenSnack({
        open: true,
        message: data.data.message,
        severity: "success",
      });

      const user: UserTypes = data.data.user;
      navigate(`/${user?.role}`);
    },
    onError: (err) => {
      console.log(err);
      setOpenSnack({
        open: true,
        message: err.message,
        severity: "warning",
      });
    },
  });

  function HandleSignup(e: FormEvent) {
    e.preventDefault();
    const currentTarget = e.currentTarget as HTMLFormElement;
    if (currPosition?.length <= 1) {
      setOpenSnack({
        open: true,
        message: "Provide a location",
        severity: "warning",
      });
    }
    if (currentTarget.password.value !== currentTarget.confirmPassword.value) {
      setOpenSnack({
        open: true,
        message: "Passwords do not match",
        severity: "warning",
      });
    } else {
      const signupData = {
        profilePicture: profilePic,
        fName: currentTarget.firstName.value,
        lName: currentTarget.lastName.value,
        email: currentTarget.email.value,
        phone: currentTarget.phone.value,
        address: currentTarget.address.value,
        pickup: currPosition,
        role,
        cabDetails:
          role === "driver"
            ? {
                cabNumber: currentTarget.cabNumber?.value || "",
                color: currentTarget.cabColor?.value || "",
                seatingCapacity: currentTarget.seatingCapacity?.value || "",
                numberPlate: currentTarget.numberPlate?.value || "",
                model: currentTarget.model?.value || "",
              }
            : null,
        password: currentTarget.password.value,
      };
      signupUser(signupData);
      console.log(signupData);
    }
  }

  const RequestLocation = () => {
    window.navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setOpenSnack({
          open: true,
          message: "Please provide access to your location!",
          severity: "warning",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  function LiveDp(event: any) {
    // setProfilePic(event.target.files[0])
    // console.log(profilePic)
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e: any) => {
        setProfilePic(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  return (
    <Box sx={{ ...PageFlex, justifyContent: "center" }}>
      {/* FORM */}
      <Box
        component={"form"}
        sx={{
          ...ColFlex,
          gap: "25px",
          width: "100%",
          px: "5%",
          my: "2.5%",
        }}
        onSubmit={HandleSignup}
      >
        {/* HEADER */}
        <Box sx={{ ...ColFlex }}>
          <Typography variant="h4" fontWeight={600}>
            SIGNUP
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", fontWeight: 600 }}
          >
            Hey there 👋, Welcome.
          </Typography>
        </Box>
        <Box
          component={"img"}
          sx={{
            width: "75px",
            aspectRatio: 1,
            my: "25px",
            borderRadius: "100px",
          }}
          src={profilePic}
        />
        <Button onChange={LiveDp} variant="outlined" component="label">
          + ADD PROFILE PICTURE
          <input type="file" accept="image/png, image/gif, image/jpeg" hidden />
        </Button>
        <Box
          sx={{
            ...RowFlex,
            width: "100%",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <TextField
            required
            fullWidth
            name="firstName"
            label="first name"
            type="text"
            placeholder="Enter your first name"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            fullWidth
            name="lastName"
            label="last name"
            type="text"
            placeholder="Enter your last name"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box
          sx={{
            ...RowFlex,
            width: "100%",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <TextField
            required
            fullWidth
            name="email"
            label="email"
            type="email"
            placeholder="Enter your email"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            fullWidth
            name="phone"
            label="phone"
            type="number"
            placeholder="Enter your phone number"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box
          sx={{
            ...RowFlex,
            width: "100%",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <TextField
            required
            fullWidth
            name="address"
            label="address"
            type="text"
            placeholder="Enter your address"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box
          sx={{
            ...RowFlex,
            width: "100%",
            justifyContent: "space-between",
            gap: "50px",
          }}
        >
          <Button
            onClick={() => RequestLocation()}
            sx={{ width: "100%" }}
            color="secondary"
            variant="contained"
          >
            Get Current Location
          </Button>
          <RadioGroup
            name="SignupAs"
            value={role}
            onChange={(e: any) => setRole(e.target.value)}
            sx={{
              ...RowFlex,
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <Typography sx={{ mr: "auto" }}>Register as: </Typography>
            <FormControlLabel
              required
              value="employee"
              control={<Radio />}
              label="Employee"
            />
            <FormControlLabel
              required
              value="driver"
              control={<Radio />}
              label="Driver"
            />
            <FormControlLabel
              required
              value="admin"
              control={<Radio />}
              label="Admin"
            />
          </RadioGroup>
        </Box>
        <Box
          sx={{
            ...RowFlex,
            width: "100%",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <TextField
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            placeholder="Password"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="confirm password"
            type="password"
            placeholder="Confirm Password"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        {role == "driver" && (
          <>
            <Typography variant="h5">Cab Details</Typography>
            <Box
              sx={{
                ...RowFlex,
                width: "100%",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                required={role == "driver"}
                fullWidth
                name="cabNumber"
                label="cab number"
                type="cab number"
                placeholder="Cab Number"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box
              sx={{
                ...RowFlex,
                width: "100%",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                required={role == "driver"}
                fullWidth
                name="cabColor"
                label="cab color"
                type="cab color"
                placeholder="Cab Color"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required={role == "driver"}
                fullWidth
                name="seatingCapacity"
                label="seating capacity"
                type="number"
                placeholder="Seating Capacity"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box
              sx={{
                ...RowFlex,
                width: "100%",
                justifyContent: "space-between",
                gap: "15px",
              }}
            >
              <TextField
                required={role == "driver"}
                fullWidth
                name="numberPlate"
                label="number plate"
                type="text"
                placeholder="Number plate"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                required={role == "driver"}
                fullWidth
                name="model"
                label="model"
                type="text"
                placeholder="Cab Model"
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </>
        )}
        <Button
          sx={{ width: "75%" }}
          type="submit"
          disabled={loginStatus === "pending"}
          color="primary"
          variant="contained"
        >
          Signup
        </Button>

        <Typography
          variant="body2"
          sx={{ color: "text.secondary", fontWeight: 600 }}
        >
          OR
        </Typography>
        <Button
          sx={{ width: "75%" }}
          onClick={() => navigate("/")}
          color="secondary"
          variant="outlined"
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}

export default Signup;
