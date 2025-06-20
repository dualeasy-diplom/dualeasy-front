import React, {useContext, useEffect, useState} from "react";
import st from "./PageTemplate.module.css";
import {Link} from "react-router-dom";
import {Button, Dropdown} from "antd";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
    LoginOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const PageTemplate = ({children, title}) => {
    const {store} = useContext(Context);
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!store.isAuth) {
            setItems([]);
            return;
        }

        const tmp = [
            {
                icon: <UserOutlined/>,
                label: <Link to={`/users/${store.user?.username}`}>Мой Профиль</Link>,
            },
            {
                icon: <SettingOutlined/>,
                label: <Link to="/users/settings">Настройки</Link>,
            },
            {
                type: "divider",
            },
        ];

        if (store.isAdmin()) {
            tmp.push(
                {type: "divider"},
                {
                    icon: <TeamOutlined/>,
                    label: <Link to="/users">Пользователи</Link>,
                },
                {type: "divider"}
            );
        }

        tmp.push({
            label: <Link to="/logout">Выйти</Link>,
            icon: <LogoutOutlined/>,
            danger: true,
        });

        setItems(tmp);
    }, [store]);

    return (
        <div className={st.pageContainer}>
            <div className={st.goHome}>
                <Link to="/"><Button type="dashed">На главную</Button></Link>
                <Button type="dashed" onClick={() => window.history.back()}>Назад</Button>
            </div>
            <div className={st.goPosts}>
                {store.isAuth ? (<>
                        <Link to="/bookings"><Button type="dashed">Мои записи</Button></Link>
                        <Link to="/my"><Button type="dashed">Мои услуги</Button></Link>
                        <Dropdown placement="bottomRight" overlayStyle={{width: "220px", paddingTop: "10px",}}
                                  menu={{items}}>
                            <Button type="default">{store.user.username}</Button>
                        </Dropdown>
                    </>
                ) : (
                    <Link to="/login">
                        <Button type="primary" icon={<LoginOutlined/>}>
                            Войти
                        </Button>
                    </Link>
                )}
            </div>
            {title && <div className={st.header}>{title}</div>}
            <div className={st.content}>{children}</div>
        </div>
    );
};

export default observer(PageTemplate);
