import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import {
    Button, Card, Rate, Spin, Avatar,
    Modal, Form, Input, Collapse, message
} from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/ru';
dayjs.locale('ru');
const { Panel } = Collapse;

const ServicePage = () => {
    const { store } = useContext(Context);
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [slotsByDay, setSlotsByDay] = useState({});
    const [selectedSlotId, setSelectedSlotId] = useState(null);
    const [note, setNote] = useState("");
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

    const loadSlots = async () => {
        try {
            const slots = await store.services.getSlotsByOwner(service.clientId);
            const grouped = {};
            slots.forEach(s => {
                const date = dayjs(s.startTime).format("dddd, DD.MM");
                if (!grouped[date]) grouped[date] = [];
                grouped[date].push(s);
            });
            setSlotsByDay(grouped);
            setIsBookingModalOpen(true);
        } catch (e) {
            message.error("Не удалось загрузить слоты");
        }
    };

    const handleLeaveFeedback = async (values) => {
        if (!store.user) {
            message.warning("Авторизуйтесь, чтобы оставить отзыв");
            return;
        }

        await store.services.leaveFeedback({
            serviceId: Number(id),
            score: values.rating,
            text: values.comment,
        });
        setIsFeedbackModalOpen(false);
        form.resetFields();
        await loadData();
    };

    const handleBook = async () => {
        if (!store.user) {
            message.warning("Авторизуйтесь, чтобы записаться на услугу");
            return;
        }

        if (!selectedSlotId) return;

        try {
            await store.services.bookSlot(selectedSlotId, service.id, note);
            message.success("Вы успешно записались на услугу");
            setIsBookingModalOpen(false);
            setSelectedSlotId(null);
            setNote("");
        } catch (e) {
            message.error("Ошибка при записи на услугу");
        }
    };

    if (loading || !service) {
        return <Spin size="large" className="flex justify-center mt-20" />;
    }

    return (
        <PageTemplate title={" "}>
            <div className="p-8 max-w-screen-xl mx-auto">
                <Card>
                    <div className="flex flex-wrap gap-6">
                        <div style={{ width: 220, height: 220, flexShrink: 0 }}>
                            <img
                                src={service.mainPhoto || "/placeholder.png"}
                                alt={service.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: 8,
                                    cursor: "pointer"
                                }}
                                onClick={() => setIsImageModalOpen(true)}
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
                            <div className="mt-2 flex gap-3">
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (!store.user) {
                                            message.warning("Авторизуйтесь, чтобы записаться на услугу");
                                        } else {
                                            loadSlots();
                                        }
                                    }}
                                >
                                    Записаться на услугу
                                </Button>
                                <Button
                                    type="default"
                                    style={{ backgroundColor: '#52c41a', color: '#fff' }}
                                    href={`tel:${service.phone || '88005553535'}`}
                                >
                                    Позвонить
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-medium mb-2">Описание</h3>
                        <p className="text-gray-700 whitespace-pre-line">{service.description}</p>
                    </div>

                    <div className="mt-10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-medium">Отзывы</h3>
                            <Button
                                onClick={() => {
                                    if (!store.user) {
                                        message.warning("Авторизуйтесь, чтобы оставить отзыв");
                                    } else {
                                        setIsFeedbackModalOpen(true);
                                    }
                                }}
                            >
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
                                                <Avatar src={f.userInfo?.photoUrl}>
                                                    {f.userInfo?.name?.[0]}
                                                </Avatar>
                                                <div>
                                                    <span className="font-semibold">{f.userInfo?.name || "Аноним"}</span>
                                                    <Rate disabled defaultValue={Number(f.rating || 0)} />
                                                    <div className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white border rounded px-3 py-2">
                                            <p className="text-gray-700 mb-0">{f.feedback || "Без комментария"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            <Modal
                open={isImageModalOpen}
                footer={null}
                onCancel={() => setIsImageModalOpen(false)}
                centered
                width="auto"
            >
                <img
                    src={service.mainPhoto || "/placeholder.png"}
                    alt="Увеличенное изображение"
                    style={{ width: "100%", height: "auto", maxWidth: "90vw", maxHeight: "80vh" }}
                />
            </Modal>

            <Modal
                open={isFeedbackModalOpen}
                title="Оставить отзыв"
                onCancel={() => setIsFeedbackModalOpen(false)}
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

            <Modal
                open={isBookingModalOpen}
                title="Выберите слот для записи"
                onCancel={() => setIsBookingModalOpen(false)}
                onOk={handleBook}
                okButtonProps={{ disabled: !selectedSlotId }}
                okText="Записаться"
                cancelText="Отмена"
            >
                <Collapse accordion>
                    {Object.entries(slotsByDay).map(([day, slots]) => (
                        <Panel header={day} key={day}>
                            {slots.map(slot => (
                                <div
                                    key={slot.id}
                                    className={`border px-4 py-2 rounded mb-2 cursor-pointer ${selectedSlotId === slot.id ? "bg-blue-100 border-blue-500" : "hover:bg-gray-50"}`}
                                    onClick={() => setSelectedSlotId(slot.id)}
                                >
                                    {dayjs(slot.startTime).format("HH:mm")} - {dayjs(slot.endTime).format("HH:mm")}
                                </div>
                            ))}
                        </Panel>
                    ))}
                </Collapse>

                {selectedSlotId && (
                    <Form layout="vertical" className="mt-4">
                        <Form.Item label="Пожелания к услуге">
                            <Input.TextArea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </PageTemplate>
    );
};

export default observer(ServicePage);