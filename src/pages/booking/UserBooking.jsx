import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";
import {Button, Select} from "antd";
import {CloseOutlined, LinkOutlined} from "@ant-design/icons";

const {Option} = Select;


const UserBooking = () => {
    const {sharedId} = useParams();
    const {store} = useContext(Context);
    const title = "Booking";

    const [wishlistWithGifts, setWishlistWithGifts] = useState([]);

    const fetchWishlistsWithGifts = async () => {
        const wwg = await store.sharedStore.getBookings();
        setWishlistWithGifts(wwg);
    };

    const unbookB = async (id) => {
        await store.sharedStore.unbook(id);
        fetchWishlistsWithGifts()
    };

    useEffect(() => {
        fetchWishlistsWithGifts()
    }, [store.sharedStore]);

    const handleOpenLink = (link) => {
        if (link) {
            window.open(link, '_blank');
        }
    };


    return (
        <PageTemplate title={title}>
            {wishlistWithGifts?.data?.data?.map((wishlist) => (
                <div className={'flex flex-col gap-2'}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        padding: '10px',
                        marginTop: '20px',
                        borderColor: '#5087E1',
                        width: '80%',
                        wordWrap: 'break-word',
                        margin: '0 auto'
                    }}>

                        <div style={{width: "40%"}} className={'text-xl font-bold'}>
                            Owner wishlist: {wishlist.ownerName}
                        </div>
                        <div style={{width: "30%"}}>
                            <div className={'text-xl font-bold'}>{wishlist.title}</div>
                        </div>

                    </div>
                    {wishlist?.gifts?.map((gift) => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '15px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                padding: '10px',
                                borderColor: '#5087E1',
                                width: '70%',
                                wordWrap: 'break-word',
                                margin: '0 auto'
                            }}>

                                <div style={{width: "20%"}}>
                                    <div className={'text-xl font-bold'}>{gift.title}</div>
                                </div>

                                <div style={{width: "52%"}}>
                                    {gift.details}
                                </div>
                                <div style={{width: "20%"}}>
                                    {gift.status}
                                </div>

                                <div style={{width: "10%"}}>
                                    <Button icon={<LinkOutlined/>} onClick={() => handleOpenLink(gift.link)} style={{marginRight: '10px'}}/>
                                    <Button icon={<CloseOutlined/>} onClick={() => unbookB(gift.id)}/>
                                </div>
                            </div>
                        )
                    )}
                </div>
            ))}
        </PageTemplate>
    );
};

export default UserBooking;
