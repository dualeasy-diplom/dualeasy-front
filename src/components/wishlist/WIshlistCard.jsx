import React from 'react';
import {Link} from "react-router-dom";

const WishlistCard = ({wishlist}) => {
    return (

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
                pathname: `/wishlists/${wishlist?.id}`,
            }}>

                {wishlist?.title}
            </Link>
        </div>

    );
};

export default WishlistCard;
