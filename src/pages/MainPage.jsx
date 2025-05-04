import React, {useContext, useEffect, useState} from "react";
import {Context} from "../index";
import PageTemplate from "../components/template/PageTemplate/PageTemplate";
import {Button, Input} from "antd";
import ServiceCard from "../components/ServiceCard";
import {observer} from "mobx-react-lite";

const MainPage = () => {

    const { store } = useContext(Context);
    const [query, setQuery] = useState("");

    useEffect(() => {
        store.services.loadServices();
    }, [store.services]);

    const handleSearch = () => {
        store.services.setSearchQuery(query);
        store.services.loadServices();
    };

    return (
        <PageTemplate title={"DualEasy"}>
            <div className="p-8 max-w-screen-xl mx-auto">
                <div className="flex gap-2 mb-6">
                    <Input
                        placeholder="Введите ключевые слова"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Поиск</Button>
                </div>

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
