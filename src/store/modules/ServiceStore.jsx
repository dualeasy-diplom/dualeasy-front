import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";

export default class ServiceStore {
    rootStore: AppStore;
    services = [];
    searchQuery = "";

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
    }

    loadServices = async () => {
        try {
            const endpoint = this.searchQuery
                ? `/search?keyword=${encodeURIComponent(this.searchQuery)}`
                : "/services";

            const response = await $api.get(endpoint);
            this.services = response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

    loadMyServices = async () => {
        try {
            const response = await $api.get("/services/service/client/my");
            this.services = response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

    createService = async (data) => {
        try {
            await $api.post("/services/create", data); // убедись, что endpoint и формат соответствуют
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    updateService = async (id, data) => {
        try {
            await $api.put(`/services/edit/${id}`, data);
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    deleteService = async (id) => {
        try {
            await $api.delete(`/services/${id}`);
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    getServiceById = async (id) => {
        try {
            const response = await $api.get(`/services/service/${id}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return null;
        }
    }

    getFeedbacksByServiceId = async (id) => {
        try {
            const response = await $api.get(`/feedback/service/${id}`); // этот путь у тебя уже есть
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            return [];
        }
    };

    leaveFeedback = async ({serviceId, score, text}) => {
        try {
            await $api.post("/feedback", {
                serviceId,
                score,
                text: text || null,
            });
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

    createSlots = async (slots: { start: string, end: string }[]) => {
        const payload = {
            slots: slots.map(s => ({
                startTime: s.start,
                endTime: s.end,
            })),
        };
        try {
            await $api.post("/slots", payload);
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

    // В ServiceStore.ts
    getSlotsByOwner = async (ownerId: string) => {
        try {
            const response = await $api.get(`/slots/owner/${ownerId}`);
            return response.data; // ожидается, что это массив CalendarSlot
        } catch (e) {
            this.rootStore.httpError(e);
            return [];
        }
    };

    bookSlot = async (
        slotId: number,
        serviceId: number,
        note?: string,) => {
        try {
            const response = await $api.post(`/slots/${slotId}/book`, {
                serviceId,
                note: note || null,
            });
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
            throw e;
        }
    };


    bookedSlots = [];

    loadBookedSlots = async () => {
        try {
            const response = await $api.get("/slots/owner/booked");
            this.bookedSlots = response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

}
