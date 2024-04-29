import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AuthCheck = (props) => {
    const router = useRouter();
    const [cookies, setCookies] = useCookies(["auth_token"]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (!cookies.auth_token) {
            router.push("/authentication/login");
        } else {
            setIsLoggedIn(true);
        }
    }, [cookies, router]);

    return isLoggedIn ? props.children : null;
}

export default AuthCheck;