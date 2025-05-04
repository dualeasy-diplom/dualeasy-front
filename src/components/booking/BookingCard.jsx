import { Button } from "antd";
import { GiftOutlined, LinkOutlined } from '@ant-design/icons';

const BookingCard = ({ gift, onBook}) => {

    const handleOpenLink = () => {
        if (gift.link) {
            window.open(gift.link, '_blank');
        }
    };



    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            borderColor: '#5087E1',
            width: '80%',
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

            <div style={{width: "8%"}}>
                <Button icon={<LinkOutlined/>} onClick={handleOpenLink} style={{marginRight: '10px'}}/>
                <Button icon={<GiftOutlined/>} onClick={onBook}/>
            </div>
            <br/>

        </div>
    );
};

export default BookingCard;
