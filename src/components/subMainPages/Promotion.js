import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as API from "../../services/api";
import RegisterEmail from "../signs/RegisterEmail";

export const Promotion = () => {
    const { t } = useTranslation()

    useEffect(() => {
        // get all promotions
        getPromotions();
    }, []);

    const [promotionItems, setPromotionItems] = useState([]);
    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [promotionId, setPromotionId] = useState("");

    const getPromotions = useCallback(async () => {
        try {
            const res = await API.getAllPromotions(true);
            if (res.data.promotionsList) {
                setPromotionItems(res.data.promotionsList);
            }
            console.log(res.data.promotionsList)
        } catch (error) {
            // Handle error appropriately (e.g., log it, show a user-friendly message)
            console.error("Error while fetching promotions:", error);
        }
    }, []);

    return (
        <>
            <div className='mt-10 px-[32px] mb-8'>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {promotionItems && promotionItems.length && promotionItems.map((promotionItem, index) => (
                        <div key={index} className="w-auto  border-2 border-[var(--secondaryColor)] rounded">
                            <LazyLoadImage
                                src={`${process.env.REACT_APP_BACKEND}/images/${promotionItem?.photo}`}
                                alt={`Image ${index + 1}`}
                                className="w-full h-auto"
                                onClick={() => {
                                    setOpen(true);
                                    setType("signup_email");
                                    setPromotionId(promotionItem?._id)
                                }}
                            />
                        </div>
                    ))}
                </div>

            </div>
            <RegisterEmail
                open={open}
                setOpen={setOpen}
                type={type}
                setType={setType}
                promotionId={promotionId}
            />
        </>
    )
}
