import React, {useContext, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Context} from "../../index";
import PageTemplate from "../template/PageTemplate/PageTemplate";
import GiftCard from "../../pages/wishlist/GiftCard";
import Title from "antd/es/typography/Title";
import {Button, Input, Modal, Select} from "antd";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {CopyOutlined} from "@ant-design/icons";

const { Option } = Select;


const SelectWishlist = () => {
    const { wishlistId } = useParams();
    const { store } = useContext(Context);
    const [gifts, setGifts] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [editable, setEditable] = useState(false);
    const [editable2, setEditable2] = useState(false);

    const [currentTitle, setCurrentTitle] = useState('');
    const [currentDescription, setDescription] = useState(' ');

    const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Состояние модального окна удаления

    const [sharedModalVisible, setSharedModalVisible] = useState(false);
    const [sharedLink, setSharedLink] = useState(' ');
    const [linkMode, setLinkMode] = useState('booking'); // Режим ссылки (booking, editing, subscribing)
    const [giftName, setGiftName] = useState('');
    const [giftDetails, setGiftDetails] = useState('');
    const [giftLink, setGiftLink] = useState('');
    const title = "Gifts";

    const handleGiftNameChange = (e) => {
        setGiftName(e.target.value);
    };

    // Обработчик изменения деталей подарка
    const handleGiftDetailsChange = (e) => {
        setGiftDetails(e.target.value);
    };

    // Обработчик изменения ссылки подарка
    const handleGiftLinkChange = (e) => {
        setGiftLink(e.target.value);
    };
    const fetchGifts = async () => {
        const gifts = await store.wishlists.getMyGifts(wishlistId);
        setGifts(gifts);
    };

    const fetchWishlist = async () => {
        const wishlist = await store.wishlists.getWishlist(wishlistId);
        setWishlist(wishlist);
        setCurrentTitle(wishlist.title || '');
        setDescription(wishlist.description || ' ');
    };
    const handleCreateGift = async () => {
        // Выполнить запрос на создание подарка
        await store.wishlists.createGift({
            title: giftName,
            details: giftDetails,
            link: giftLink,
            listId: wishlist.id
        });
        await fetchGifts();
        await fetchWishlist();
        // Очистить форму после создания подарка
        setGiftName('');
        setGiftDetails('');
        setGiftLink('');
    };
    useEffect(() => {
        fetchGifts();
        fetchWishlist();
    }, [store.wishlists, wishlistId]);

    const handleTitleClick = () => {
        setEditable(true);
    };

    const handleTitleChange = (e) => {
        setCurrentTitle(e.target.value);
    };

    const handleTitleBlur = async () => {
        setEditable(false);
        if (currentTitle.trim() !== wishlist.title) {
            await store.wishlists.update(wishlistId, { title: currentTitle, description: wishlist.description });
        }
    };

    const descriptionClick = () => {
        setEditable2(true);
    };

    const descriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const descriptionBlur = async () => {
        setEditable2(false);
        if (currentDescription.trim() !== wishlist.description) {
            await store.wishlists.update(wishlistId, { title: wishlist.title, description: currentDescription });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleTitleBlur();
        }
    };

    const handleKeyPress2 = (e) => {
        if (e.key === 'Enter') {
            descriptionBlur();
        }
    };

    const handleDeleteButtonClick = () => {
        setDeleteModalVisible(true);
    };
    const navigate = useNavigate();

    const handleDeleteConfirm = async () => {
        await store.wishlists.delete(wishlistId);
        setDeleteModalVisible(false);
        navigate('/');
    };

    const handleDeleteCancel = () => {
        setDeleteModalVisible(false);
    };

    const deleteGift = async (id) => {
        await store.wishlists.deleteGift(id);
        fetchGifts();

    }
    const handleSharedButtonClick = () => {
        setSharedModalVisible(true);
    };

    const handleSharedCreate = async () => {
        const linkEntity = await store.sharedStore.getLink({ mode: linkMode, id: wishlistId });
        let link = ""
        if (linkEntity.accessMode === "booking") {
            link = `http://85.193.86.209:3000/shared/booking/${linkEntity.id}`;
        } else if (linkEntity.accessMode === "edit") {
            link = "Извините, данная функция пока в разработке"
        } else if (linkEntity.accessMode === "subscribe") {
            link = `http://85.193.86.209:3000/shared/subscribe/${linkEntity.id}`;
        }
        setSharedLink(link);
    };

    return (
        <PageTemplate title={title}>
            <div className={'flex flex-col gap-2'}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {editable ? (
                        <input
                            type="text"
                            value={currentTitle}
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            onKeyPress={handleKeyPress}
                            autoFocus
                        />
                    ) : (
                        <Title
                            level={2}
                            style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta', cursor: 'pointer'}}
                            onClick={handleTitleClick}
                        >
                            {currentTitle}
                        </Title>
                    )}
                </div>


                <div style={{width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: "70%"}}>
                        {editable2 ? (
                            <input
                                type="text"
                                value={currentDescription}
                                onChange={descriptionChange}
                                onBlur={descriptionBlur}
                                onKeyPress={handleKeyPress2}
                                autoFocus
                            />
                        ) : (
                            <Title
                                level={2}
                                style={{textAlign: 'center', fontSize: '24px', fontFamily: 'Anta', cursor: 'pointer'}}
                                onClick={descriptionClick}
                            >
                                {currentDescription}
                            </Title>
                        )}
                    </div>
                    <div>
                        <Button style={{fontFamily: "anta", fontSize: 18, lineHeight: "10px"}}
                                onClick={handleSharedButtonClick}>Shared</Button>
                    </div>
                </div>
                <div className={'flex flex-col gap-2'}>
                    {/* Форма для создания подарка */}
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Input
                            value={giftName}
                            rules={[
                                {
                                    max: 255,
                                    message: 'Максимальная длина 255 символов'
                                }
                            ]}
                            onChange={handleGiftNameChange}
                            placeholder="Название подарка"
                            style={{marginRight: '10px'}}
                            required
                        />
                        <Input
                            rules={[
                                {
                                    max: 1000,
                                    message: 'Максимальная длина 1000 символов'
                                }
                            ]}
                            value={giftDetails}
                            onChange={handleGiftDetailsChange}
                            placeholder="Детали подарка"
                            style={{marginRight: '10px'}}
                            required
                        />
                        <Input
                            rules={[
                                {
                                    max: 1000,
                                    message: 'Максимальная длина 1000 символов'
                                }
                            ]}
                            value={giftLink}
                            onChange={handleGiftLinkChange}
                            placeholder="Ссылка на подарок"
                            style={{marginRight: '10px'}}
                        />
                        <Button onClick={handleCreateGift}>Создать подарок</Button>
                    </div>

                    {/* Остальной код */}
                </div>

                <div>

                </div>
                {gifts?.map((gift) => (<GiftCard onDelete={() => deleteGift(gift.id)} key={gift.id} gift={gift}/>))}

                <Button style={{fontFamily: "anta", fontSize: 18, width: "50%", margin: "0 auto", lineHeight: "10px"}}
                        danger onClick={handleDeleteButtonClick}>Delete Wishlist</Button>

            </div>
            <Modal
                title="Delete Wishlist"
                open={deleteModalVisible}
                onOk={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            >
                <p>Are you sure you want to delete the wishlist and all its gifts?</p>
            </Modal>
            <Modal
                title="Create Shared Link"
                open={sharedModalVisible}
                onOk={handleSharedCreate}
                onCancel={() => setSharedModalVisible(false)}
                okText="Create"
                cancelText="Cancel"
            >
                <p>Choose link mode:</p>
                <Select
                    defaultValue="Booking"
                    style={{width: 120}}
                    onChange={value => setLinkMode(value)}
                >
                    <Option value="booking">Booking</Option>
                    <Option value="edit">Edit</Option>
                    <Option value="subscribe">Save </Option>
                </Select>
                <p>Here is your shared link:</p>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                    <Input
                        value={sharedLink}
                        readOnly
                    />
                    <CopyToClipboard text={sharedLink}>
                        <Button icon={<CopyOutlined />} />
                    </CopyToClipboard>

                </div>

            </Modal>
        </PageTemplate>
    );
};

export default SelectWishlist;
