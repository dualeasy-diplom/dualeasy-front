import {Card, Rate, Button, Popconfirm, Tooltip} from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const ServiceCardForOwner = ({service, onEdit, onDelete}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/services/${service.id}`);
    };

    return (
        <Card bodyStyle={{ padding: 24 }} style={{ marginBottom: 16, cursor: "pointer" }} onClick={handleClick}>
            <div className="flex gap-6">
                {/* Фото */}
                <div
                    style={{
                        width: 220,
                        height: 220,
                        flexShrink: 0,
                        overflow: "hidden",
                        borderRadius: 12,
                    }}
                >
                    <img
                        src={service.mainPhoto || "/placeholder.png"}
                        alt={service.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: 8,
                        }}
                    />
                </div>

                {/* Информация */}
                <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-semibold">{service.name}</h2>
                        <div className="flex gap-2">
                            <Tooltip title="Редактировать">
                                <Button
                                    icon={<EditOutlined />}
                                    type="text"
                                    onClick={() => onEdit(service)}
                                />
                            </Tooltip>
                            <Tooltip title="Удалить">
                                <Popconfirm
                                    title="Удалить услугу?"
                                    onConfirm={() => onDelete(service.id)}
                                    okText="Да"
                                    cancelText="Нет"
                                >
                                    <Button
                                        icon={<DeleteOutlined />}
                                        type="text"
                                        danger
                                    />
                                </Popconfirm>
                            </Tooltip>
                        </div>
                    </div>

                    <p className="text-gray-500 mt-2">{service.description}</p>

                    {service.address && (
                        <div className="text-gray-600 text-sm mt-1">
                            <strong>Адрес:</strong> {service.address}
                        </div>
                    )}

                    <div className="flex justify-between items-end mt-auto pt-4">
                        <div className="text-xl font-medium">{service.price} ₽</div>
                        <Rate disabled defaultValue={Number(service.rating || 0)} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCardForOwner;
