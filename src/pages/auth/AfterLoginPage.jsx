import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../index";

const AfterLoginPage = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        console.log(token)
        if (token) {
            localStorage.setItem("token", token);
            store.loadUser(token); // загружаем пользователя по токену
            navigate("/"); // или на профиль, если хочешь
        } else {
            navigate("/login");
        }
    }, [store, navigate]);

    return <div className="text-center p-10">Авторизация через Яндекс...</div>;
};

export default AfterLoginPage;
