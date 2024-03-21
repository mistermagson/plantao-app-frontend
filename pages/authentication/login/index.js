import { useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import MDInput from "/components/MDInput";
import MDButton from "/components/MDButton";
import BasicLayout from "/pagesComponents/authentication/components/BasicLayout";
import bgImage from "/assets/images/bg-sign-in-basic.jpeg";


function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            if (res.ok) {
                const data = await res.json();
                window.location.href = '/plantoes';
                console.log(data);
            } else {
                console.error("Erro ao autenticar:", res.statusText);
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação:", error);
        }
    };

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
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                    <MDBox component="form" role="form">
                        <MDBox mb={2}>
                            <MDInput type="email" value={formData.email} id="email" name="email" label="Email" fullWidth onChange={handleChange} />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="password" value={formData.password} id="password" name="password" label="Password" fullWidth onChange={handleChange} />
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                            <MDButton variant="gradient" color="dark" fullWidth onClick={handleSubmit}>
                                LOGIN
                            </MDButton>
                        </MDBox>
                    </MDBox>
                </MDBox>
            </Card>
        </BasicLayout>
    );
}

export default LoginForm;
