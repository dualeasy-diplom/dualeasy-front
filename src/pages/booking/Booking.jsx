import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import Title from "antd/es/typography/Title";
import {Select} from "antd";
import BookingCard from "../../components/booking/BookingCard";

const {Option} = Select;


const Booking = () => {
    const {sharedId} = useParams();
    const {store} = useContext(Context);
    const title = "Услуги";

    const [wishlistWithGifts, setWishlistWithGifts] = useState([]);

    const fetchWishlistWithGifts = async () => {
        console.log(sharedId)
        const wwg = await store.sharedStore.getWishlist(sharedId);
        setWishlistWithGifts(wwg);
    };

    const book = async (id) => {
        await store.sharedStore.book({uuid: sharedId, giftId: id});
        fetchWishlistWithGifts();
    };

    useEffect(() => {
        fetchWishlistWithGifts()
    }, [store.sharedStore]);


    return (
        <PageTemplate title={title}>
            <div className={'flex flex-col gap-2'}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Title
                        level={2}
                        style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta'}}
                    >
                        {wishlistWithGifts.title}
                    </Title>
                </div>
                <Title
                    level={2}
                    style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta'}}
                >
                    {wishlistWithGifts.description}
                </Title>

                {wishlistWithGifts?.gifts?.map((gift) => (<BookingCard onBook={() => {
                    book(gift.id)
                }} key={gift.id} gift={gift}/>))}
            </div>


        </PageTemplate>
    );
};

export default Booking;
