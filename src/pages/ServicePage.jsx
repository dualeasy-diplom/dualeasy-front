import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import {
    Button, Card, Rate, Spin, Avatar,
    Modal, Form, Input, Tooltip
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const ServicePage = () => {
    const { store } = useContext(Context);
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const loadData = async () => {
        setLoading(true);
        const serviceData = await store.services.getServiceById(id);
        const feedbackData = await store.services.getFeedbacksByServiceId(id);
        setService(serviceData);
        setFeedbacks(feedbackData);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [id, store.services]);

    const handleLeaveFeedback = async (values) => {
        await store.services.leaveFeedback({
            serviceId: Number(id),
            score: values.rating,
            text: values.comment,
        });
        setIsModalOpen(false);
        form.resetFields();
        await loadData();
    };

    const currentUserId = store.user.clientId;

    if (loading || !service) {
        return <Spin size="large" className="flex justify-center mt-20" />;
    }

    return (
        <PageTemplate title={" "}>
            <div className="p-8 max-w-screen-xl mx-auto">
                <Card>
                    {/* Верх */}
                    <div className="flex flex-wrap gap-6">
                        <div style={{ width: 220, height: 220, flexShrink: 0 }}>
                            <img
                                src={service.mainPhoto || "/placeholder.png"}
                                alt={service.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1">
                            <h2 className="text-2xl font-semibold">{service.name}</h2>
                            <div className="flex items-center gap-2">
                                <span>Рейтинг:</span>
                                <Rate disabled defaultValue={Number(service.rating || 0)} />
                            </div>
                            <div className="text-lg">
                                <strong>Цена:</strong> {service.price} ₽
                            </div>
                            <Button type="primary" className="mt-2 w-fit">Записаться на услугу</Button>
                        </div>
                    </div>

                    {/* Описание */}
                    <div className="mt-8">
                        <h3 className="text-xl font-medium mb-2">Описание</h3>
                        <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                    </div>

                    {/* Отзывы */}
                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium">Отзывы</h3>
                            <Button type="default" onClick={() => setIsModalOpen(true)}>
                                Оставить отзыв
                            </Button>
                        </div>

                        {feedbacks.length === 0 ? (
                            <p className="text-gray-500">Отзывов пока нет.</p>
                        ) : (
                            <div className="space-y-4">
                                {feedbacks.map((f, idx) => (
                                    <div key={idx} className="border rounded-xl p-4 bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar src={f.userInfo?.photoUrl} alt={f.userInfo?.name}>
                                                    {f.userInfo?.name?.[0]}
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{f.userInfo?.name || "Аноним"}</span>
                                                    <Rate disabled defaultValue={Number(f.rating || 0)} />
                                                    <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            {f.userInfo?.id === currentUserId && (
                                                <div className="flex gap-2">
                                                    <Tooltip title="Редактировать">
                                                        <Button type="text" icon={<EditOutlined />} />
                                                    </Tooltip>
                                                    <Tooltip title="Удалить">
                                                        <Button type="text" danger icon={<DeleteOutlined />} />
                                                    </Tooltip>
                                                </div>
                                            )}
                                        </div>
                                        <div className="bg-white border rounded px-3 py-2">
                                            <p className="text-gray-700 whitespace-pre-line mb-0">
                                                {f.feedback || "Без комментария"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Модалка: оставить отзыв */}
            <Modal
                open={isModalOpen}
                title="Оставить отзыв"
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form layout="vertical" form={form} onFinish={handleLeaveFeedback}>
                    <Form.Item
                        name="rating"
                        label="Оценка"
                        rules={[{ required: true, message: "Укажите рейтинг" }]}
                    >
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item name="comment" label="Комментарий (необязательно)">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </PageTemplate>
    );
};

export default observer(ServicePage);
