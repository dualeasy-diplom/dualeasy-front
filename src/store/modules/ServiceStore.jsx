import { makeAutoObservable } from "mobx";
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
            const response = await $api.get("/services");
            console.log(response)
            this.services = response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    };

    loadMyServices = async () => {
        try {
            const response = await $api.get("/services/service/client/my");
            console.log(response)
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

    leaveFeedback = async ({ serviceId, score, text }) => {
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
}
