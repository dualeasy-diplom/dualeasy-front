import React from "react";
import { Card, Tag } from "antd";

const statusColor = {
    BOOKED: "blue",
    CONFIRMED: "green",
    COMPLETED: "default",
};

const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const statusLabel = {
    BOOKED: "Ожидает подтверждения",
    CONFIRMED: "Подтверждено",
    COMPLETED: "Завершено",
};

const BookedSlotCard = ({ slot, onClick }: { slot: any, onClick: () => void }) => {
    return (
        <Card
            hoverable
            onClick={onClick}
            className="cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition"
        >
            <div className="flex gap-6">
                {/* Фото */}
                <img
                    src={slot.servicePhoto || "/placeholder.png"}
                    alt={slot.serviceName}
                    style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8 }}
                />

                {/* Контент */}
                <div className="flex flex-col justify-between flex-grow">
                    <div>
                        <h3 className="text-xl font-semibold">{slot.serviceName}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Время: {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                        </p>
                        {slot.note && (
                            <p className="text-sm text-gray-500 mt-1">
                                Пожелания: {slot.note}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-4">
                        <Tag color={statusColor[slot.status] || "default"}>
                            {statusLabel[slot.status] || slot.status}
                        </Tag>
                        {slot.servicePrice && (
                            <div className="text-sm text-gray-700 font-medium">
                                {slot.servicePrice} ₽
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default BookedSlotCard;
