import PresentIcon from "../assets/img/svg/present.svg";
import PromotionsIcon from "../assets/img/svg/promotions.svg";
import PrizeImage from "../assets/img/banner/prize.png";
import CtrlLeft from "../assets/img/svg/ctrlLeft.svg";
import CtrlRight from "../assets/img/svg/ctrlRight.svg";

import DashboardBanner from "../assets/img/banner/dashboard.png";

import CryptoImg from "../assets/img/submenus/crypto_casino.png";
import JackpotImg from "../assets/img/submenus/jackpot.png";
import PokerImg from "../assets/img/submenus/poker.png";
import SportsGameImg from "../assets/img/submenus/sports_game.png";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import { useEffect, useState, useCallback } from "react";
import * as API from "../services/api";
import RegisterEmail from "./signs/RegisterEmail";
// import { LazyLoadImage } from "react-lazy-load-image-component";

export const Banner = (props) => {
    const [splideImages, setSplideImages] = useState([
        { name: "banner1", isPromotion: false, id: "" },
        { name: "banner2", isPromotion: false, id: "" },
        { name: "banner3", isPromotion: false, id: "" },
        { name: "banner4", isPromotion: false, id: "" },
        { name: "banner5", isPromotion: false, id: "" },
        { name: "banner6", isPromotion: false, id: "" },
        { name: "banner7", isPromotion: false, id: "" },
        { name: "banner8", isPromotion: false, id: "" },
        { name: "banner9", isPromotion: false, id: "" }
    ]);

    const [open, setOpen] = useState(false);
    const [type, setType] = useState("");
    const [promotionId, setPromotionId] = useState("");

    const page = props.page || "dashboard";

    const goToNextSlide = () => {};

    useEffect(() => {
        // get non expired promotions
        getPromotions();
    }, []);

    const getPromotions = useCallback(async () => {
        try {
            const res = await API.getAllPromotions();
            if (res.data.promotionsList && res.data.promotionsList.length) {
                let promotionSlide = []
                for (let promotion of res.data.promotionsList) {
                    console.log(promotion)
                    promotionSlide.push({ name: promotion.photo, isPromotion: true, id: promotion._id })
                }
                setSplideImages([...splideImages, ...promotionSlide])
            }
            console.log(res.data.promotionsList)
        } catch (error) {
            // Handle error appropriately (e.g., log it, show a user-friendly message)
            console.error("Error while fetching promotions:", error);
        }
    }, []);

    const signUp = (content) => {
        if (content.isPromotion) {
            console.log("this is my promotion")
            setPromotionId(content._id);
            setType("signup_email");
            setOpen(true);
        }
    }

    return page === "dashboard" ? (
        <div className="flex w-full bg-black">
            <img src={DashboardBanner} alt="Banner" className="w-full h-auto" />
        </div>
    ) : (
        <>
            <div className="md:flex items-center gap-2.5 px-2 md:px-8 mt-0 md:mt-12 bg-black">
                <div className="hidden py-2 w-1/5 flex-col gap-1 text-[14px] leading-[22px] text-[#DEE1E6]">
                    <div className="flex py-0.5 gap-1 items-center rounded bg-[#06121E] ">
                        <img
                            src={PresentIcon}
                            alt="Present"
                            width={36}
                            height={36}
                            className="p-[7px]"
                        />
                        <span>Bonus</span>
                    </div>
                    <div className="relative">
                        <img
                            src={PrizeImage}
                            alt="Prize"
                            className="w-full h-[100px]"
                        />
                        <div className="absolute top-0 left-[8%] w-[50%] h-full flex items-center leading-[18px]">
                            Exploration and Riches Awaits You
                        </div>
                    </div>
                    <div className="bg-white flex py-0.5 gap-1 items-center rounded">
                        <img
                            src={PromotionsIcon}
                            alt="Present"
                            width={36}
                            height={36}
                            className="p-[7px]"
                        />
                        <span>Promotions</span>
                    </div>
                </div>

                <div className="flex-grow w-full md:w-4/5">
                    <div className="flex gap-3 items-center">
                        {/* <span className="min-w-[36px] h-9 bg-[#9095A1] p-2 hidden md:block cursor-pointer">
              <img src={CtrlLeft} alt="CtrlLeft" className="w-full h-full" onClick={goToNextSlide} />
            </span> */}
                        <Splide
                            options={{
                                type: "loop",
                                gap: 8,
                                arrows: true,
                                perPage: 3,
                                breakpoints: {
                                    560: {
                                        perPage: 1,
                                    },
                                    1024: {
                                        perPage: 2,
                                    },
                                },
                                autoplay: true,
                                splideImages: 1,
                            }}
                        >
                            {splideImages.map((imgURL, key) => {
                                return (
                                    <SplideSlide key={key}>
                                        <img
                                            src={(imgURL.isPromotion) ? `${process.env.REACT_APP_BACKEND}/images/${imgURL?.name}` : require(`../assets/img/banner/${imgURL.name}.jpg`)}
                                            className="rounded-xl"
                                            onClick={() => signUp(imgURL)}
                                        />
                                    </SplideSlide>
                                );
                            })}
                        </Splide>
                        {/* <span className="min-w-[36px] w-9 h-9 bg-[#9095A1] p-2 hidden md:block cursor-pointer">
              <img src={CtrlRight} alt="CtrlRight" className="w-full h-full" />
            </span> */}
                    </div>
                </div>
            </div>

            {/* <div className="hidden md:flex-row md:flex justify-between w-full px-7 mt-10">
          <img src={CryptoImg} alt="cryptoImage" className="w-full md:w-[22%]"/>
          <img src={JackpotImg} alt="cryptoImage" className="w-full md:w-[22%]"   />
          <img src={PokerImg} alt="cryptoImage" className="w-full md:w-[22%]"   />
          <img src={SportsGameImg} alt="cryptoImage" className="w-full md:w-[22%]"   />
      </div> */}

            <RegisterEmail
                open={open}
                setOpen={setOpen}
                type={type}
                setType={setType}
                promotionId={promotionId}
            />
        </>
    );
};
