import React, {useContext, useEffect} from 'react';
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Context} from "../../index";
import {Button, Card} from "antd";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

const LoginPage = () => {
    const {store} = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.isAuth) {
            navigate('/');
        }
    }, [navigate, store.isAuth]);

    return (
        <PageTemplate>
            <Card className="max-w-lg mx-auto mt-48" title="Вход в аккаунт">

                <Button
                    className="w-full flex items-center justify-center gap-2"
                    type="primary"
                    size="large"
                    loading={store.users.isLoading}
                    onClick={() => {
                        store.users.login();
                    }}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Yandex_icon.svg/2048px-Yandex_icon.svg.png"
                        alt="Yandex"
                        className="w-5 h-5"
                    />
                    Авторизоваться через Яндекс
                </Button>

            </Card>
        </PageTemplate>
    );
};

export default observer(LoginPage);