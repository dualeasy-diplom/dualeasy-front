import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";


export default class SharedStore {

    rootStore: AppStore;

    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }


    getLink = async (values) => {
        try {
            const json = JSON.stringify({
                wishlistId: values.id,
                accessMode: values.mode
            });
            console.log(json)
            let res = await $api.post(`/link`, json);
            return res.data
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    getWishlist = async (id) => {
        try {
            let res = await $api.get(`/shared/${id}`);
            return res.data
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }


    book = async (value) => {
        try {
            let res = await $api.post(`/booking/book/${value.uuid}/${value.giftId}`);
            return res.data
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    unbook = async (giftId) => {
        try {
            await $api.post(`/booking/unbook/${giftId}`);
            message.success('Success');

        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    subscribe = async (uuid) => {
        try {
            await $api.post(`/subscribe/${uuid}`);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }


    getBookings = async () => {
        try {
            return await $api.get(`/booking`);
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    getAll = async(id) => {
        try {
            const response = await $api.get(`/subscriptions`);
            console.log(response)
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }


}