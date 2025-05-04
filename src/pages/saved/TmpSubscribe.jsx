import React, {useContext, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Button, Modal} from "antd";

const TmpSubscribe = () => {
    const { sharedId } = useParams();
    const { store } = useContext(Context);
    const [modalVisible, setModalVisible] = useState(true); // Состояние видимости модального окна
    const navigate = useNavigate();

    const handleSubscribe = async () => {
        try {
            await store.sharedStore.subscribe(sharedId); // Выполняем подписку
            navigate("/");
        } catch (error) {
            console.error("Error subscribing:", error);
            // Обрабатываем ошибку
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false); // Закрываем модальное окно
        navigate("/subscriptions"); // Переходим на главную страницу
    };

    return (
        <PageTemplate title=" ">
            <Modal
                title="Subscribe Confirmation"
                open={modalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="cancel" onClick={handleCloseModal}>
                        Cancel
                    </Button>,
                    <Button key="subscribe" type="primary" onClick={handleSubscribe}>
                        Save
                    </Button>,
                ]}
            >
                Are you sure you want to save to this wishlist?
            </Modal>
        </PageTemplate>
    );
};

export default TmpSubscribe;
