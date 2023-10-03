import { useState } from "react";

import Link from "next/link";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// NextJS Material Dashboard 2 PRO components
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import MDInput from "/components/MDInput";
import MDButton from "/components/MDButton";

// Authentication layout components
import BasicLayout from "/pagesComponents/authentication/components/BasicLayout";

// Images
import bgImage from "/assets/images/bg-sign-in-basic.jpeg";


function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = e =>{
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]:value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        console.log(formData)
    }

    return (
        <BasicLayout image={bgImage}>
            <Card>
                <MDBox
                    variant="gradient"
                    bgColor="dark"
                    borderRadius="lg"
                    coloredShadow="dark"
                    mx={2}
                    mt={-3}
                    p={2}
                    mb={1}
                    textAlign="center"
                >
                    <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                        Autenticar
                    </MDTypography>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        sx={{ mt: 1, mb: 2 }}
                    >



                    </Grid>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="email" value={formData.email} id="email" name="email" label="Email" fullWidth onChange={handleChange}/>
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" value={formData.password} id="password" name="password" label="Password" fullWidth onChange={handleChange}/>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" ml={-1}>

                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton variant="gradient" color="dark" fullWidth onClick={handleSubmit}>
                                LOGIN
                            </MDButton>
                        </MDBox>
                        <MDBox mt={3} mb={1} textAlign="center">

                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default LoginForm;
