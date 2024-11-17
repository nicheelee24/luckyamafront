import React, { useEffect, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import * as API from "../../services/api";
import RegisterEmail from "../signs/RegisterEmail";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
			setType("signup_email");
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
					toast.success(response.data.msg, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,

						draggable: true,
						progress: undefined,
						theme: "light",
					});
				} else if(response.data.res == "warning") {
					toast.warning(response.data.msg, {
						position: "top-right",
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,

						draggable: true,
						progress: undefined,
						theme: "light",
					});
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

	return (
		<>
			<div className='mt-10 px-[32px] mb-8'>
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
