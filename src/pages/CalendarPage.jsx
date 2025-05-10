import React, { useState, useContext } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import { Button } from "antd";
import { Context } from "../index"; // для доступа к store
import max from "dayjs/plugin/minMax";

dayjs.extend(max);
const SLOT_DURATION = 30;
const TOTAL_SLOTS = 24 * 60 / SLOT_DURATION;
const DAYS_COUNT = 7;

const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const generateWeekDays = () => {
    const today = dayjs().startOf("day");
    return Array.from({ length: DAYS_COUNT }, (_, i) => today.add(i, "day"));
};

const generateSlots = () => {
    return Array.from({ length: TOTAL_SLOTS }, (_, i) => {
        const start = dayjs().startOf("day").add(i * SLOT_DURATION, "minute");
        const end = start.add(SLOT_DURATION, "minute");
        return `${start.format("HH:mm")} - ${end.format("HH:mm")}`;
    });
};

const CalendarPage = () => {
    const days = generateWeekDays();
    const slots = generateSlots();
    const { store } = useContext(Context); // доступ к MobX store

    const [selectedSlots, setSelectedSlots] = useState([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [dragStart, setDragStart] = useState(null);
    const [dragCurrent, setDragCurrent] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (dayIndex, slotIndex) => {
        const day = days[dayIndex];
        if (isSlotInPast(day, slotIndex)) return;

        setIsDragging(true);
        setDragStart({ dayIndex, slotIndex });
        setDragCurrent({ dayIndex, slotIndex });
    };

    const handleMouseEnter = (dayIndex, slotIndex) => {
        if (!isDragging) return;
        setDragCurrent({ dayIndex, slotIndex });
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStart || !dragCurrent) return;

        const { dayIndex: startDay, slotIndex: startSlot } = dragStart;
        const { dayIndex: endDay, slotIndex: endSlot } = dragCurrent;

        if (startDay !== endDay) {
            resetDrag();
            return;
        }

        const day = days[startDay];
        const [from, to] = [startSlot, endSlot].sort((a, b) => a - b);

        const start = day.startOf("day").add(from * SLOT_DURATION, "minute");
        const end = day.startOf("day").add((to + 1) * SLOT_DURATION, "minute");

        const key = `${start.format("YYYY-MM-DDTHH:mm")}_${end.format("YYYY-MM-DDTHH:mm")}`;

        const exists = selectedSlots.find((s) => s.key === key);

        if (exists) {
            // Удалить слот
            setSelectedSlots(selectedSlots.filter((s) => s.key !== key));
        } else {
            // Добавить слот
            setSelectedSlots([
                ...selectedSlots,
                {
                    start: start.format("YYYY-MM-DDTHH:mm"),
                    end: end.format("YYYY-MM-DDTHH:mm"),
                    key,
                },
            ]);
        }

        setHasChanges(true);
        resetDrag();
    };


    const mergeSlots = (slots) => {
        // Преобразуем строки в dayjs-объекты
        const parsed = slots.map(slot => ({
            start: dayjs(slot.start),
            end: dayjs(slot.end),
        }));

        // Сортируем по дате начала
        const sorted = parsed.sort((a, b) => a.start.unix() - b.start.unix());

        const merged = [];
        for (const slot of sorted) {
            const last = merged[merged.length - 1];
            if (!last) {
                merged.push({ ...slot });
            } else {
                // Если слоты в одном дне и пересекаются или смежны
                const sameDay = slot.start.isSame(last.start, "day");
                const isOverlappingOrTouching = !slot.start.isAfter(last.end);

                if (sameDay && isOverlappingOrTouching) {
                    last.end = dayjs.max(last.end, slot.end);
                } else {
                    merged.push({ ...slot });
                }
            }
        }

        // Вернём обратно в string
        return merged.map(({ start, end }) => ({
            start: start.format("YYYY-MM-DDTHH:mm"),
            end: end.format("YYYY-MM-DDTHH:mm"),
            key: `${start.format("YYYY-MM-DDTHH:mm")}_${end.format("YYYY-MM-DDTHH:mm")}`,
        }));
    };


    const resetDrag = () => {
        setIsDragging(false);
        setDragStart(null);
        setDragCurrent(null);
    };

    const isSlotInPast = (day, slotIndex) => {
        const now = dayjs();
        const slotTime = day.startOf("day").add(slotIndex * SLOT_DURATION, "minute");
        return day.isSame(now, "day") && slotTime.isBefore(now);
    };

    const getSlotMeta = (dayIndex, slotIndex) => {
        const day = days[dayIndex];
        const time = day.startOf("day").add(slotIndex * SLOT_DURATION, "minute").format("YYYY-MM-DDTHH:mm");

        for (const s of selectedSlots) {
            if (s.start <= time && time < s.end) {
                const startSlot = dayjs(s.start).diff(day.startOf("day"), "minute") / SLOT_DURATION;
                const endSlotExclusive = dayjs(s.end).diff(day.startOf("day"), "minute") / SLOT_DURATION;

                const isFirst = slotIndex === startSlot;
                const isLast = slotIndex === endSlotExclusive - 1;

                return {
                    inSlot: true,
                    isFirst,
                    isLast,
                };
            }
        }

        return {
            inSlot: false,
            isFirst: false,
            isLast: false,
        };
    };

    const handleSave = async () => {
        const slotData = selectedSlots.map(({ start, end }) => ({ start, end }));
        try {
            await store.services.createSlots(slotData);
            setHasChanges(false);
        } catch (error) {
            console.error("Ошибка при отправке слотов:", error);
        }
    };

    return (
        <PageTemplate title="Выбор рабочего времени">
            <div
                className="p-6 max-w-screen-xl mx-auto overflow-x-auto select-none"
                onMouseUp={handleMouseUp}
            >
                <div className="grid grid-cols-7 gap-4 min-w-[1200px] text-black">
                    {days.map((day, dayIndex) => (
                        <div key={dayIndex}>
                            <div className="text-center font-semibold p-2 bg-gray-50">
                                {dayNames[day.day()]}, {day.format("DD.MM")}
                            </div>
                            {slots.map((label, slotIndex) => {
                                const inPast = isSlotInPast(day, slotIndex);
                                const { inSlot, isFirst, isLast } = getSlotMeta(dayIndex, slotIndex);

                                return (
                                    <div
                                        key={slotIndex}
                                        className={classNames(
                                            "p-2 text-sm text-center transition-all duration-150",
                                            "cursor-pointer select-none text-black",
                                            inPast && "bg-gray-200 text-gray-400 cursor-not-allowed",
                                            !inPast && !inSlot && "hover:bg-blue-100 bg-white border border-gray-300 rounded-md mb-1",
                                            inSlot && "bg-blue-50 border-blue-500",
                                            inSlot && isFirst && "rounded-t-md border-t-2 border-l-2 border-r-2",
                                            inSlot && isLast && "rounded-b-md border-b-2 border-l-2 border-r-2",
                                            inSlot && !isFirst && !isLast && "border-l-2 border-r-2 border-t-0 border-b-0"
                                        )}
                                        onMouseDown={() => handleMouseDown(dayIndex, slotIndex)}
                                        onMouseEnter={() => handleMouseEnter(dayIndex, slotIndex)}
                                    >
                                        {label}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <Button type="primary" disabled={!hasChanges} onClick={handleSave}>
                        Сохранить
                    </Button>
                </div>
            </div>
        </PageTemplate>
    );
};

export default CalendarPage;
