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
        password: "",
    });
    const [loginStatus, setLoginStatus] = useState("pendente");

    useEffect(() => {
        const { token } = parseCookies();
        if (token) {
            router.push("/"); // Redirecionar se já estiver autenticado
        }
    }, [router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && formData.email && formData.password) {
            handleSubmit(event); // Submit the form if Enter is pressed and both fields are filled
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoginStatus("pendente");

        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                const time = 3600;
                setCookie(null, "auth_token", data.token, {
                    maxAge: time, // 30 minutos (tempo de expiração do token)
                    path: "/",
                });
                setCookie(null, "user_email", (data.email), {
                    maxAge: time, // 30 minutos (tempo de expiração do token)
                    path: "/",
                });
                setLoginStatus("sucesso");
                router.push("/"); // Redirecionar para a página principal após o login
            } else {
                setLoginStatus("erro");
                console.log("Erro ao autenticar:", res.statusText);
            }
        } catch (error) {
            setLoginStatus("erro");
            console.error("Erro ao enviar solicitação:", error);
        }
    };

    const renderError = () => {
        if (loginStatus === "erro") {
            return (
                <MDBox mt={2} mb={1}>
                    <MDTypography variant="caption" color="error" fontWeight="medium">
                        Email ou senha incorretos. Tente novamente.
                    </MDTypography>
                </MDBox>
            );
        }
        return null;
    };
    return (
        <BasicLayout >
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
                    <MDBox component="form" role="form" onKeyPress={handleKeyPress}>
                        <MDBox mb={2}>
                            <MDInput
                                type="email"
                                value={formData.email}
                                id="email"
                                name="email"
                                label="Email"
                                fullWidth
                                onChange={handleChange}
                                error={loginStatus === "erro" && !formData.email} // Set error state for missing email
                                helperText={
                                    loginStatus === "erro" && !formData.email
                                        ? "Informe seu endereço de email"
                                        : null
                                } // Display error message for missing email
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
                                error={loginStatus === "erro" && !formData.password} // Set error state for missing password
                                helperText={
                                    loginStatus === "erro" && !formData.password
                                        ? "Informe sua senha"
                                        : null
                                } // Display error message for missing password
                            />
                        </MDBox>
                        {renderError()} {/* Display error message for invalid credentials */}
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