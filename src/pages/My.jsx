import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import ServiceCardForOwner from "../components/ServiceCardForOwner";
import {observer} from "mobx-react-lite";
import {Button, Form, Input, InputNumber, Modal, Upload, message} from "antd";
import {UploadOutlined} from "@ant-design/icons";

const MyServices = () => {
    const {store} = useContext(Context);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [editMode, setEditMode] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        store.services.loadMyServices();
    }, [store.services]);

    const showCreateModal = () => {
        setEditMode(false);
        setEditingService(null);
        setFileList([]);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setEditMode(true);
        setEditingService(service);
        form.setFieldsValue(service);
        setFileList([]);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        await store.services.deleteService(id);
        await store.services.loadMyServices();
    };

    const handleSubmit = async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        if (values.address) formData.append("address", values.address);
        formData.append("price", values.price);
        if (values.categoryId) formData.append("categoryId", values.categoryId);

        if (fileList.length > 0) {
            formData.append("mainPhoto", fileList[0].originFileObj);
        }

        try {
            if (editMode && editingService) {
                message.warning("Редактирование с фото не реализовано");
            } else {
                await store.services.createService(formData);
            }

            setIsModalOpen(false);
            form.resetFields();
            setEditMode(false);
            setEditingService(null);
            await store.services.loadMyServices();
        } catch (e) {
            message.error("Ошибка при сохранении услуги");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditMode(false);
        setEditingService(null);
        setFileList([]);
    };

    return (
        <PageTemplate title={"DualEasy"}>
            <div className="p-8 max-w-screen-xl mx-auto">
                <div className="flex justify-end gap-4 mb-6">
                    <Button onClick={() => message.info('Форма изменения расписания ещё не реализована')}>
                        Изменить расписание
                    </Button>
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
                        <Form.Item label="Фото">
                            <Upload
                                beforeUpload={() => false}
                                fileList={fileList}
                                onChange={({fileList}) => setFileList(fileList)}
                                maxCount={1}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined/>}>Загрузить фото</Button>
                            </Upload>
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
