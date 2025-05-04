import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import ServiceCardForOwner from "../components/ServiceCardForOwner";
import {observer} from "mobx-react-lite";
import {Button, Form, Input, InputNumber, Modal} from "antd";

const MyServices = () => {
    const {store} = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [editMode, setEditMode] = useState(false);
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        store.services.loadMyServices();
    }, [store.services]);

    // Открыть модалку на создание
    const showCreateModal = () => {
        setEditMode(false);
        setEditingService(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    // Открыть модалку на редактирование
    const handleEdit = (service) => {
        setEditMode(true);
        setEditingService(service);
        form.setFieldsValue(service);
        setIsModalOpen(true);
    };

    // Удалить услугу
    const handleDelete = async (id) => {
        await store.services.deleteService(id);
        await store.services.loadMyServices();
    };

    // Обработка отправки формы (создание или обновление)
    const handleSubmit = async (values) => {
        if (editMode && editingService) {
            await store.services.updateService(editingService.id, values);
        } else {
            await store.services.createService(values);
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditMode(false);
        setEditingService(null);
        await store.services.loadMyServices();
    };

    // Закрыть модалку
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditMode(false);
        setEditingService(null);
    };

    return (
        <PageTemplate title={"DualEasy"}>
            <div className="p-8 max-w-screen-xl mx-auto">
                <div className="flex justify-end mb-6">
                    <Button type="primary" onClick={showCreateModal}>
                        Создать новую услугу
                    </Button>
                </div>

                <div className="grid gap-4">
                    {store.services.services.map((service) => (
                        <ServiceCardForOwner
                            key={service.id}
                            service={service}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                <Modal
                    title={editMode ? "Редактировать услугу" : "Создать новую услугу"}
                    open={isModalOpen}
                    onCancel={handleCancel}
                    onOk={() => form.submit()}
                    okText={editMode ? "Сохранить" : "Создать"}
                    cancelText="Отмена"
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item name="name" label="Название" rules={[{required: true}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="description" label="Описание" rules={[{required: true}]}>
                            <Input.TextArea rows={3}/>
                        </Form.Item>
                        <Form.Item name="address" label="Адрес">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="mainPhoto" label="Ссылка на фото">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="price" label="Цена" rules={[{required: true}]}>
                            <InputNumber min={0} style={{width: "100%"}}/>
                        </Form.Item>
                        <Form.Item name="categoryId" label="ID категории">
                            <InputNumber min={0} style={{width: "100%"}}/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </PageTemplate>
    );
};

export default observer(MyServices);
