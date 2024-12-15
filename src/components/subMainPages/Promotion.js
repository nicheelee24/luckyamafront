import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as API from "../../services/api";
import Login from '../signs/Login';
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import check_icon from "../../assets/img/check.svg";

export const Promotion = () => {
	const { t } = useTranslation()

	useEffect(() => {
		// get all promotions
		getPromotions();
		isLogin && getUserInfo();
	}, []);

	const [promotionItems, setPromotionItems] = useState([]);
	const [open, setOpen] = useState(false);
	const [type, setType] = useState("");
	const [promotionId, setPromotionId] = useState("");
	const [userInfo, setUserInfo] = useState({});
	const [modalOpen, setModalOpen] = useState({isopen:false,message:'',header:''});

	const isLogin = useSelector((state) => state.loginState.isLogin);
	const dispatch = useDispatch();

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

	const getUserInfo = useCallback(async () => {
		const res = await API.getUserInfo();
		if(res?.data) {
			 setUserInfo(res.data);
		}
	}, [])

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
					//window.location.reload(true,5000);
				} else if(response.data.res == "warning") {
					setModalOpen({isopen:true,message:response.data.msg,header:'Warning'});
					//window.location.reload(true,5000);
				}
			})
			.catch(function (error) {
				console.error(error);

				toast.error("Failed.", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,

					draggable: true,
					progress: undefined,
					theme: "light",
				});
			});
	}

	const closeModal = () => setModalOpen({isopen:false,message:'',header:''});
	return (
		<>
			<div className='mt-10 px-[32px] mb-8'><p style={{color:'rgba(239, 176, 52, 1)',marginBottom:'20px',fontSize:'larger',fontWeight:'bolder'}}>Promotions</p>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
					{promotionItems && promotionItems.length && promotionItems.map((promotionItem, index) => (
						promotionItem.status == 'yes' && <div key={index} className="w-auto  border-2 border-[var(--secondaryColor)] rounded cursorPointer">
							<LazyLoadImage
								src={`https://bundaii.com/ama-bundai/uploads/${promotionItem?.photo}`}
								alt={`Image ${index + 1}`}
								className="w-full h-auto"
								onClick={() => {
									 handlePromotionCode(promotionItem?._id,userInfo._id);
									// setOpen(true);
									// setType("signup_email");
									// setPromotionId(promotionItem?._id)
								}}
							/>
							<div className='text-white p-4  flex flex-col justify-between'>
							<p >{promotionItem?.details}</p>
							{userInfo?.promotionId === promotionItem?._id ?
							 	<p className='flex items-center justify-center mt-7 gap-2 text-[var(--logoutBg)]'><img src={check_icon} alt="eye icon" className='h-7 w-7'/>Current active promotion</p>
							  	:
								<div className='flex items-center justify-center '>
								<button className="bg-[var(--logoutBg)] text-black mt-2 font-bold py-2 px-4 rounded" onClick={()=>handlePromotionCode(promotionItem?._id,userInfo._id)}>
									Apply this promotion
								</button>
								</div>
							}
							</div>
						</div>
					))}
				</div>
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					theme="light"
				/>		
			</div>
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
	  <Login
                open={open}
                setOpen={setOpen}
                type={type}
                setType={setType}
            />
		</>
	)
}
