import React, {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../../components/template/PageTemplate/PageTemplate";


const SubscriptionsWishlists = () => {
    const {store} = useContext(Context);
    const [wishlists, setWishlists] = useState([]);


    const fetchWishlists = async () => {
        const wishlists = await store.sharedStore.getAll();

        setWishlists(wishlists)
    };
    useEffect(() => {
        fetchWishlists();
    }, [store.wishlists, setWishlists]);


    return (
        <PageTemplate title={"Saves"}>
            <div className={'scroll-auto'} style={{textAlign: "center"}}>
                <div className={'flex flex-col gap-2'}>

                    {wishlists?.map((wishlist) => (
                        <div style={{
                            marginBottom: '20px',
                            border: '1px solid #ccc',
                            borderRadius: '10px',
                            padding: '10px',
                            borderColor: '#5087E1',
                            width: '80%',
                            wordWrap: 'break-word',
                            margin: '0 auto'
                        }}>
                            <Link to={{
                                pathname: `/subscriptions/${wishlist?.id}`
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-around'
                                }}>
                                    <div>Wishlist by {wishlist?.ownerName}</div>

                                    <div>Title: {wishlist?.title}</div>
                                </div>
                            </Link>
                        </div>

                    ))}
                </div>
            </div>
        </PageTemplate>
    );
};

export default SubscriptionsWishlists;
