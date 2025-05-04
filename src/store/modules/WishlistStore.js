import {makeAutoObservable} from "mobx";
import type AppStore from "../AppStore";
import $api from "../../http";
import {message} from "antd";


export default class WishlistStore {

    rootStore: AppStore;
    constructor(rootStore: AppStore) {
        makeAutoObservable(this);
        this.rootStore = rootStore;
    }



    getAll = async() => {
        try {
            const response = await $api.get('/wishlist');
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    getMyGifts = async(id) => {
        try {
            const response = await $api.get(`/gift/wishlist/${id}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    getWishlist = async(id) => {
        try {
            const response = await $api.get(`/wishlist/${id}`);
            return response.data;
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    delete = async(id) => {
        try {
            await $api.delete(`/wishlist/${id}`);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }


    update = async (id, data) => {
        try {
            const json = JSON.stringify(data);
            await $api.put(`/wishlist/${id}`, json);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    create = async (data) => {
        try {
            console.log(data)
            await $api.post(`/wishlist`, data);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
    }

    createGift = async (values) => {
        try {
            const json = JSON.stringify({
                link: values.link,
                details: values.details,
                title: values.title,
                listId: values.listId
            });
            console.log(json)
            await $api.post(`/gift`, json);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    updateGift = async (values) => {
        try {
            const json = JSON.stringify({
                link: values.link,
                details: values.details,
                title: values.title
            });
            console.log(json)
            await $api.put(`/gift/${values.id}`, json);
            message.success('Success');
            return true
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }

    deleteGift = async (id) => {
        try {
            await $api.delete(`/gift/${id}`);
            message.success('Success');
        } catch (e) {
            this.rootStore.httpError(e);
        }
        return "Not link";
    }
}