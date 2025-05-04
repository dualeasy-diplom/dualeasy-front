import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../template/PageTemplate/PageTemplate";
import Title from "antd/es/typography/Title";

import SubscriptionGiftCard from "../save/SubscriptionGiftCard";


const SelectSubscriptionWishlist = () => {
    const {wishlistId} = useParams();
    const {store} = useContext(Context);
    const [gifts, setGifts] = useState([]);

    const [currentTitle, setCurrentTitle] = useState('');
    const [currentDescription, setDescription] = useState(' ');


    const title = "Gifts";


    useEffect(() => {
        const fetchGifts = async () => {
            const gifts = await store.wishlists.getMyGifts(wishlistId);
            setGifts(gifts);
        };

        const fetchWishlist = async () => {
            const wishlist = await store.wishlists.getWishlist(wishlistId);
            setCurrentTitle(wishlist.title || '');
            setDescription(wishlist.description || ' ');
        };

        fetchGifts();
        fetchWishlist();
    }, [wishlistId, store.wishlists]); // Добавляем wishlistId в массив зависимостей


    return (
        <PageTemplate title={title}>
            <div className={'flex flex-col gap-2'}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Title
                        level={2}
                        style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta'}}
                    >
                        Title: {currentTitle}
                    </Title>
                </div>


                <div style={{width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                    <Title
                        level={2}
                        style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta'}}
                    >
                        Description: {currentDescription}
                    </Title>
                </div>


                <div>

                </div>
                {gifts?.map((gift) => (
                    <SubscriptionGiftCard key={gift.id} gift={gift}/>))}
            </div>
        </PageTemplate>
    );
};

export default SelectSubscriptionWishlist;
