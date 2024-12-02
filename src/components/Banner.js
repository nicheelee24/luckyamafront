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
import Login from "./signs/Login";
import { useSelector } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import check_icon from "../assets/img/check.svg";
import axios from "axios";
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
    const [userInfo, setUserInfo] = useState({});
	const [modalOpen, setModalOpen] = useState({isopen:false,message:'',header:''});
    const isLogin = useSelector((state) => state.loginState.isLogin);

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
                    promotion.status == 'yes' && promotionSlide.push({ name: promotion.photo, isPromotion: true, id: promotion._id })
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
        if (content.isPromotion || !isLogin) {
            console.log("this is my promotion")
            setPromotionId(content._id);
            setType("login");
            setOpen(!isLogin);
        }
    }
    useEffect(() => {
		// get all promotions
		getPromotions();
		isLogin && getUserInfo();
	}, []);

	const getUserInfo = useCallback(async () => {
		const res = await API.getUserInfo();
		if(res?.data) {
			 setUserInfo(res.data);
		}
	}, [])

    useEffect(() => {
        getPromotions();
        if (isLogin) {
            getUserInfo();
        } else {
            setUserInfo({});
        }
    }, [isLogin]);

	const handlePromotionCode = useCallback(async (promotion_id,user_id) => {
		if (isLogin && promotion_id && user_id) {
			savePromotionToUser(promotion_id,user_id);
		} else {
			setOpen(true);
			setType("login");
			setPromotionId(promotion_id)
		}
	}, [])

	const savePromotionToUser = async (promotion_id,user_id) => {
		const options = {
			method: "POST",
			url: process.env.REACT_APP_BACKEND + "/api/saveuserpromotion",
			headers: { "content-type": "application/x-www-form-urlencoded" },
			data: {
				promotion_id: promotion_id,
				user_id: user_id
			},
		};
		await axios
			.request(options)
			.then(function (response) {
				if (response.data.res == "sucess") {
					setModalOpen({isopen:true,message:response.data.msg,header:'Sucess'});
				} else if(response.data.res == "warning") {
					setModalOpen({isopen:true,message:response.data.msg,header:'Warning'});
				}
			})
			.catch(function (error) {
				console.error(error);
			});
	}
    const closeModal = () => setModalOpen({isopen:false,message:'',header:''});

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
                                        <div className="relative">
                                            <img
                                                src={(imgURL.isPromotion) ? `https://bundaii.com/ama-bundai/uploads/${imgURL?.name}` : require(`../assets/img/banner/${imgURL.name}.jpg`)}
                                                className="rounded-xl" style={{height:'200px',width:'475px'}}
                                                onClick={() => signUp(imgURL)}
                                            />
                                                <div  className="absolute lg:left-36 bottom-2">
                                               
                                                    {(userInfo?.promotionId === imgURL?.id && imgURL?.isPromotion) ?
                                                        <p className='flex items-center justify-center mt-7 gap-2 text-[var(--logoutBg)] bg-black mt-2 font-bold py-2 px-4 rounded'><img src={check_icon} alt="eye icon" className='h-5 w-5'/>Current active promotion</p>
                                                        : (userInfo?.promotionId !== imgURL?.id && imgURL?.isPromotion) 
                                                        ?
                                                        <div className='flex items-center justify-center '>
                                                            <button className="bg-[var(--logoutBg)] text-black mt-2 font-bold py-2 px-4 rounded" onClick={()=>handlePromotionCode(imgURL?.id,userInfo._id)}>
                                                                Apply this promotion
                                                            </button>
                                                        </div>
                                                         :
                                                         null}
                                               </div>
                                        </div>
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
      		<Transition appear show={modalOpen?.isopen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                        >
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl transition-all">
                            <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                            >
                            {modalOpen?.header}
                            </Dialog.Title>
                            <div className="mt-4">
                            <p className="text-sm text-gray-500">
                            {modalOpen?.message}
                            </p>
                            </div>
                            <div className="mt-6">
                            <button
                                className="px-4 py-2 bg-[var(--logoutBg)] text-black rounded hover:bg-red-700"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                            </div>
                        </Dialog.Panel>
                        </Transition.Child>
                    </div>
			    </Dialog>
            </Transition>
        {!isLogin && 
        <Login
           open={open}
           setOpen={setOpen}
           type={type}
           setType={setType}
        />}
       
        </>
    );
};
