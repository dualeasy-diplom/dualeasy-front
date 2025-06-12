import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import {Button, Input} from "antd";
import ServiceCard from "../components/ServiceCard";
import {observer} from "mobx-react-lite";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MainPage = () => {
    const {store} = useContext(Context);
    const [query, setQuery] = useState("");

    useEffect(() => {
        store.services.loadServices();
        store.services.loadCategories();
    }, [store.services]);

    const handleSearch = () => {
        store.services.setSearchQuery(query);
        store.services.loadServices();
    };

    const [priceFrom, setPriceFrom] = useState("");
    const [priceTo, setPriceTo] = useState("");
    const [ratingFrom, setRatingFrom] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const categories = store.services.categories;
    const sliderSettings = {
        dots: false,
        infinite: categories.length > 5,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    infinite: categories.length > 4,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    infinite: categories.length > 3,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    infinite: categories.length > 2,
                }
            }
        ]
    };

    return (
        <PageTemplate title={"DualEasy"}>
            <div className="p-8 max-w-screen-xl mx-auto">

                {/* Карусель категорий */}
                {categories.length > 0 && (
                    <div className="mb-6">
                        <Slider {...sliderSettings}>
                            {categories.map((cat) => (
                                <div key={cat.id} className="px-2">
                                    <div
                                        className="flex flex-col items-center p-3 transition rounded-xl"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                    >
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className="w-24 h-24 object-cover rounded-lg mb-2"
                                            style={{
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                                border: "none"
                                            }}
                                        />
                                        <div className="text-sm font-semibold text-black text-center">{cat.name}</div>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}

                {/* Поиск */}
                <div className="flex gap-2 mb-4">
                    <Input
                        placeholder="Введите ключевые слова"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onPressEnter={handleSearch}
                        style={{ flex: 1 }}
                    />
                    <Button onClick={handleSearch}>Поиск</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold w-20 text-gray-700">Цена от:</label>
                        <Input
                            placeholder="500"
                            value={priceFrom}
                            onChange={(e) => setPriceFrom(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold w-20 text-gray-700">Цена до:</label>
                        <Input
                            placeholder="3000"
                            value={priceTo}
                            onChange={(e) => setPriceTo(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold w-24 text-gray-700">Рейтинг от:</label>
                        <select
                            className={`w-full h-[32px] px-2 rounded border border-gray-300 ${
                                ratingFrom === "" ? "text-gray-400" : "text-black"
                            }`}
                            value={ratingFrom}
                            onChange={(e) => setRatingFrom(e.target.value)}
                        >
                            <option value="">Не выбрано</option>
                            {[1, 2, 3, 4, 5].map(rate => (
                                <option key={rate} value={rate}>{rate}+</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-semibold w-20 text-gray-700">Категория:</label>
                        <select
                            className={`w-full h-[32px] px-2 rounded border border-gray-300 ${
                                selectedCategory === "" ? "text-gray-400" : "text-black"
                            }`}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Все</option>
                            {store.services.categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>


                {/* Услуги */}
                <div className="grid gap-4">
                    {store.services.services.map((service) => (
                        <ServiceCard key={service.id} service={service}/>
                    ))}
                </div>
            </div>
        </PageTemplate>
    );
};

export default observer(MainPage);
