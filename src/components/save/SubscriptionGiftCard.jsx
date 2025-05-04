import {Button} from "antd";
import {LinkOutlined} from '@ant-design/icons';

const SubscriptionGiftCard = ({gift}) => {

    const handleOpenLink = () => {
        if (gift.link) {
            window.open(gift.link, '_blank');
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            justifyContent: 'space-between',
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '10px',
            borderColor: '#5087E1',
            width: '80%',
            fontSize: '20px',
            wordWrap: 'break-word',
            margin: '0 auto'
        }}>
            <div style={{width: "30%"}}>
                <div className={'text-xl font-bold'}>{gift.title}</div>
            </div>

            <div style={{width: "65%"}}>
                {gift.details}
            </div>

            <div style={{width: "5%"}}>
                <Button icon={<LinkOutlined/>} onClick={handleOpenLink} style={{marginRight: '10px'}}/>
            </div>
        </div>
    );
};

export default SubscriptionGiftCard;
