import { useRouter } from "next/router";
import {useEffect, useState} from "react";
import { setCookie, parseCookies } from "nookies";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "/components/MDBox";
import MDTypography from "/components/MDTypography";
import MDInput from "/components/MDInput";
import MDButton from "/components/MDButton";
import BasicLayout from "/components/pagesComponents/authentication/components/BasicLayout";
import { tipoUsuario } from "../../../utils/sistemaUtils";

function LoginForm({cookies, authToken}) {
    const router = useRouter();
    const [loginCredentials, setLoginCredentials] = useState({
        email: "",
        password: "",
    });
    const [authenticationStatus, setAuthenticationStatus] = useState("pending");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginCredentials({...loginCredentials, [name]: value });
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter" && loginCredentials.email && loginCredentials.password) {
            handleSubmit(event);
        }
    };

    useEffect((ctx) => {
        const token  = parseCookies(ctx);
        if (token.tipo === "admin") {
            router.push("/escalas");
        }
        else{
            router.push("/plantoes");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setAuthenticationStatus("loading");

        try {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ username: loginCredentials.email, password: loginCredentials.password }),
            });

            if (response.ok) {
                setAuthenticationStatus("success");
                const data = await response.json();
                const tipo = await tipoUsuario(data.email);

                const cookieOptions = {
                    maxAge: 1 * 60 * 60,
                    path: '/',
                    secure: process.env.NODE_ENV!== 'development',
                };

                setCookie(null, "auth_token", data.token, cookieOptions);
                setCookie(null, "user_email", data.email, cookieOptions);
                setCookie(null, "user_tipo", tipo, cookieOptions);

                if (tipo === "admin") {
                    router.push("/escalas/adicionaescalas");
                } else {
                    router.push("/plantoes");
                }
            } else {
                setAuthenticationStatus("error");
                alert("Login failed!");
                console.log(response);
            }
        } catch (error) {
            setAuthenticationStatus("error");
            console.error("Error sending request:", error);
        }
    };

    const renderError = () => {
        if (authenticationStatus === "error") {
            return (
                <MDBox mt={2} ml={1}>
                    <MDTypography variant="caption" color="error" fontWeight="medium">
                        Email ou senha incorretos. Tente novamente.
                    </MDTypography>
                </MDBox>
            );
        }
        return null;
    };

    const renderLoading = () => {
        if (authenticationStatus === "loading") {
            return (
                <MDBox mt={2} ml={1}>
                    <MDTypography variant="caption" color="info" fontWeight="medium">
                        Aguarde, processando...
                    </MDTypography>
                </MDBox>
            );
        }
        return null;
    };

    return (
        <BasicLayout>
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
                        <MDBox mb={3}>
                            <MDInput
                                type="email"
                                value={loginCredentials.email}
                                id="email"
                                name="email"
                                label="Usuário"
                                fullWidth
                                onChange={handleInputChange}
                                error={authenticationStatus === "error" &&!loginCredentials.email}
                                helperText={
                                    authenticationStatus === "error" &&!loginCredentials.email
                                        ? "Informe seu endereço de email"
                                        : null
                                }
                            />
                        </MDBox>
                        <MDBox>
                            <MDInput
                                type="password"
                                value={loginCredentials.password}
                                id="password"
                                name="password"
                                label="Senha"
                                fullWidth
                                onChange={handleInputChange}
                                error={authenticationStatus === "error" &&!loginCredentials.password}
                                helperText={
                                    authenticationStatus === "error" &&!loginCredentials.password
                                        ? "Informe sua senha"
                                        : null
                                }
                            />
                        </MDBox>
                        {renderError()}
                        {renderLoading()}
                        <MDBox mt={3} mb={1}>
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