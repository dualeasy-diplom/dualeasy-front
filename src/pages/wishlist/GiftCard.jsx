import {Button, Input, Modal} from "antd";
import {DeleteOutlined, EditOutlined, LinkOutlined} from '@ant-design/icons';
import {useContext, useState} from "react";
import {Context} from "../../index";

const GiftCard = ({gift, onDelete}) => {
    const {store} = useContext(Context);
    const [visible, setVisible] = useState(false);
    const [editedGift, setEditedGift] = useState({
        title: gift.title,
        details: gift.details,
        link: gift.link
    });
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const handleEditClick = () => {
        setVisible(true);
    };

    const handleDeleteClick = () => {
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        onDelete()
        setDeleteModalVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleSave = async () => {
        let res = store.wishlists.updateGift( {
                title: editedGift.title,
                details: editedGift.details,
                link: editedGift.link,
                id: gift.id
            }
        )
        if (res) {
            gift.details = editedGift.details
            gift.title = editedGift.title
            gift.link = editedGift.link
        }
        setVisible(false);
        

    };

    const handleChange = (e, key) => {
        setEditedGift({...editedGift, [key]: e.target.value});
    };

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
            wordWrap: 'break-word',
            margin: '0 auto'
        }}>

            <div style={{width: "20%"}}>
                <div className={'text-xl font-bold'}>{gift.title}</div>
            </div>

            <div style={{width: "67%"}}>
                {gift.details}
            </div>

            <div style={{width: "12%"}}>
                <Button icon={<LinkOutlined/>} onClick={handleOpenLink} style={{marginRight: '10px'}}/>
                <Button icon={<EditOutlined/>} onClick={handleEditClick} style={{marginRight: '10px'}}/>
                <Button icon={<DeleteOutlined/>} onClick={handleDeleteClick}/>
            </div>

            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={() => setDeleteModalVisible(false)}
                okText="Delete"
                cancelText="Cancel"
            >
                Are you sure you want to delete this gift?
            </Modal>

            <Modal
                title="Edit Gift"
                open={visible}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={handleSave}>Save</Button>,
                ]}
            >
                <Input
                    value={editedGift.title}
                    onChange={(e) => handleChange(e, 'title')}
                    placeholder="Enter title"
                />
                <Input
                    value={editedGift.details}
                    onChange={(e) => handleChange(e, 'details')}
                    placeholder="Enter details"
                />
                <Input
                    value={editedGift.link}
                    onChange={(e) => handleChange(e, 'link')}
                    placeholder="Enter link"
                />
            </Modal>
        </div>
    );
};

export default GiftCard;
