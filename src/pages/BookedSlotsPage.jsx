import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import BookedSlotCard from "../components/BookedSlotCard";
import { useNavigate } from "react-router-dom";

const BookedSlotsPage = () => {
    const { store } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        store.services.loadBookedSlots();
    }, [store.services]);

    return (
        <PageTemplate title="Мои записи">
            <div className="p-6 max-w-screen-xl mx-auto grid gap-4">
                {store.services.bookedSlots.map((slot) => (
                    <BookedSlotCard
                        key={slot.slotId}
                        slot={slot}
                        onClick={() => navigate(`/services/${slot.serviceId}`)}
                    />
                ))}
            </div>
        </PageTemplate>
    );
};

export default observer(BookedSlotsPage);
