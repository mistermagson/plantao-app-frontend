import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { setCookie, parseCookies } from "nookies";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import MDInput from "/components/MDInput";
import MDButton from "/components/MDButton";
import BasicLayout from "/pagesComponents/authentication/components/BasicLayout";
import bgImage from "/assets/images/bg-sign-in-basic.jpeg";

function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { token } = parseCookies();
        if (token) {
            router.push("/"); // Redirecionar se já estiver autenticado
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            });

            if (res.ok) {
                const data = await res.json();
                setCookie(null,"auth_token", data.token, {
                    maxAge: 1800, // 30 minutos (tempo de expiração do token)
                    path: "/"
                });
                router.push("/"); // Redirecionar para a página principal após o login
            } else {
                console.log("Erro ao autenticar:", res.statusText);
            }
        } catch (error) {
            console.error("Erro ao enviar solicitação:", error);
        }
        setLoading(false);
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
                            <MDInput
                                type="email"
                                value={formData.email}
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth
                                onChange={handleChange}
                            />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput
                                type="password"
                                value={formData.password}
                                id="password"
                                name="password"
                                label="Password"
                                fullWidth
                                onChange={handleChange}
                            />
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