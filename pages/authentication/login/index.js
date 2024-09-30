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
import bgImage from "/assets/images/bg-sign-in-basic.jpeg";
import MDProgress from "../../../components/MDProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import {tipoUsuario} from "../../../utils/sistemaUtils";

function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loginStatus, setLoginStatus] = useState("pendente");

    /*useEffect((ctx) => {
        const token  = parseCookies(ctx);
        if (token.tipo === "admin") {
            router.push("/escalas"); // Redirecionar se já estiver autenticado
        }
        else{
            router.push("/plantoes");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

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

    const handleSubmit = async (e, ctx) => {
        e.preventDefault();

        setLoginStatus("loading"); // Set loading state
        //await new Promise((resolve) => setTimeout(resolve, 3000));
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
                const tipo = await tipoUsuario(data.email);

                setCookie(null, "auth_token", data.token, {
                    maxAge: time, // 30 minutos (tempo de expiração do token)
                    path: "/",
                });
                setCookie(null, "user_email", (data.email), {
                    maxAge: time, // 30 minutos (tempo de expiração do token)
                    path: "/",
                });
                setCookie(null, "user_tipo", (tipo), {
                    maxAge: time, // 30 minutos (tempo de expiração do token)
                    path: "/",
                });
                setLoginStatus("sucesso");

                /*if(tipo ==="admin"){router.push("/escalas/adicionaescalas");}
                else {router.push("/plantoes");} // Redire}cionar para a página principal após o login*/

                const allowedEmails = ["cmsantan@trf3.jus.br", "mmmagal@trf3.jus.br", "omperei@trf3.jus.br"];
                if (formData.email && !allowedEmails.includes(formData.email)) {
                    router.push("/plantoes");
                }
                else{
                    router.push("/escalas/adicionaescalas");
                }


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
        if (loginStatus === "loading") {
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
                        <MDBox mb={3}>
                            <MDInput
                                type="email"
                                value={formData.email}
                                id="email"
                                name="email"
                                label="Email ou nome de usuário"
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
                        <MDBox >
                            <MDInput
                                type="password"
                                value={formData.password}
                                id="password"
                                name="password"
                                label="Senha"
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
                        {renderLoading()} {/* Display loading indicator */}
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