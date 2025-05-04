import { Card, Rate } from "antd";
import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/services/${service.id}`);
    };

    return (
        <Card bodyStyle={{ padding: 24 }} style={{ marginBottom: 16, cursor: "pointer" }} onClick={handleClick}>
            <div className="flex gap-6">
                <div style={{ width: 220, height: 220, flexShrink: 0, overflow: "hidden", borderRadius: 12 }}>
                    <img
                        src={service.mainPhoto || "/placeholder.png"}
                        alt={service.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                </div>

                <div className="flex flex-col justify-between w-full">
                    <h2 className="text-2xl font-semibold text-center mb-2">{service.name}</h2>
                    <p className="text-gray-500 mb-4">{service.description}</p>
                    <div className="flex justify-between items-end mt-auto">
                        <div className="text-xl font-medium">{service.price} ₽</div>
                        <Rate disabled defaultValue={Number(service.rating || 0)} />
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ServiceCard;
