import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { setLoginState } from "../../redux/reducers/loginState";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../../assets/css/login.css";

import eye_icon from "../../assets/img/eye-icon.svg";
import gmail_icon from "../../assets/img/gmail_sign.svg";
import facebook_icon from "../../assets/img/facebook_sign.svg";
import apple_icon from "../../assets/img/apple_sign.svg";
import twitter_icon from "../../assets/img/twitter_sign.svg";
import telegram_icon from "../../assets/img/telegram_sign.svg";
import whatsapp_icon from "../../assets/img/whatsapp_sign.svg";

import * as API from "../../services/api";
import TransactionHistory from "./TransactionHistory";
import { redirect } from "react-router-dom";

// import useSocket from '../../hooks/useSocket';

export default function Deposit({ open, setOpen, type, setType }) {
    const { t } = useTranslation();

    // const { socket, socketConnected } = useSocket();

    const dispatch = useDispatch();
    const [checkProviderState, setProviderState] = useState(null)
    const [checkState, setCheckState] = useState(null)
    const [amount, setAmount] = useState(100);
    const [bbn, setBbn] = useState("");
    const [provider, setProvider] = useState("");
    const [paymethod, setPayMethod] = useState("");
    const [channeltype, setChannelType] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const cancelButtonRef = useRef(null);
    const amountRef = useRef(null);
    const bbnRef = useRef(null);
    const payMethodRef = useRef(null);
    const channelTypeRef = useRef(null);
    const providerRef = useRef(null);
    const providersList = [
        "BigPayz",
        "SmartPay"
    ];
    const payMethods = [
        "QR Prompt Pay",
        "Bank"
    ];
    const bankLists = [
        "BKKB",
        "KSKB",
        "KSAB",

    ];
    //for spay
    const channelTypes = [
        "Bank",
        "PromptPay",
        "TruePay",

    ];

    const handleAmountChange = (e) => {
        const amount = e.target.value;
        setAmount(amount);
    };
    const handleBBNChange = (e) => {
        const bbn = e.target.value;
        setBbn(bbn);
    };
    const handlePayMethodChange = (e) => {
        setCheckState(!checkState);
        const paymethod = e.target.value;
        setPayMethod(paymethod);
    };
    const handleChannelTypeChange = (e) => {
        const channeltype = e.target.value;
        setChannelType(channeltype);
    };
    const handleProviderChange = (e) => {
        setProviderState(!checkProviderState);
        const provider = e.target.value;
        setProvider(provider);
    };

    //smartpayz provider
    const handleDepositClick_smartpay = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "content-type": "application/json",
                "x-auth-token": window.localStorage.getItem("token"),
            },
        };

       // var providerr = providerRef.current.value;

        let url = '';

        var currency;
        var platform;
        let data = [];
       
            url = process.env.REACT_APP_BACKEND + "/api/pay/smartpay";
            data = [
                amountRef.current.value,
                channelTypeRef.current.value

            ]
        


        await axios
            .post(
                url,
                data,
                config
            )
            .then(function (response) {
                let resp = response.data;
                console.log("bank apii response..." + resp);
                
                    window.open(resp.PayUrl, "_self");
                
            })
            .catch(function (err) {
                console.log(err);

                toast.error("Login or function error.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                debugger;
            });
    };

    //bigpayz provider
    const handleDepositClick = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "content-type": "application/json",
                "x-auth-token": window.localStorage.getItem("token"),
            },
        };

        let url = '';
        var paymeth = payMethodRef.current.value;
        var currency;
        var platform;
        let data = [];
        if (paymeth != 'Bank') {
            url = process.env.REACT_APP_BACKEND + "/api/pay/deposit_bigpay_qr";
            data = [
                amountRef.current.value

            ]
        }
        else {
            url = process.env.REACT_APP_BACKEND + "/api/pay/deposit_bigpay_bank";
            data = [
                amountRef.current.value,
                bbnRef.current.value

            ]
        }


        await axios
            .post(
                url,
                data,
                config
            )
            .then(function (response) {
                let resp = response.data;
                let redirectt = resp.PayUrl.split("=");


                if (resp.code == '0') {

                    if (resp.method == 'bank') {
                        window.open(redirectt[1] + '=' + redirectt[2], "_self");
                    }
                    else {
                        window.open(resp.PayUrl, "_self");
                    }

                }
                else {

                    toast.warning("API Response Code: " + resp.code + "-" + resp.msg, {
                        position: "top-right",
                        autoClose: 10000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });










                }
            })
            .catch(function (err) {
                console.log(err);

                toast.error("Login or function error.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                debugger;
            });
    };

    const onReset = (e) => {
        e.preventDefault();
        setType("reset");
    };

    const failLogIn = () =>
        toast.error(t("Valid input"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,

            draggable: true,
            progress: undefined,
            theme: "light",
        });

    const failConnection = () =>
        toast.error(t("Signup first"), {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,

            draggable: true,
            progress: undefined,
            theme: "light",
        });

    const onLogin = async (e) => {
        e.preventDefault();
        const amount = amountRef.current.value;

        console.log(amount);

    };

    return (
        <Transition.Root show={open && type === "deposit"} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[10]"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
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
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="overflow-auto md:overflow-hidden flex flex-col md:flex-row bg-[#181637] w-[617px] h-[auto] border border-[#2c2a4a] rounded-[12px]">
                                <div className="right-side px-8 py-10 text-left w-full bg-white" >
                                    <form
                                        action="#"
                                        className="flex flex-col h-full"
                                    >
                                        <h1 className="mb-12  !text-xl md:text-2xl text-black font-bold">
                                            {t("Deposit")}
                                        </h1>
                                      
                                         <div className="input-wrapper mt-5">
                                            <label htmlFor="paymethod" className="!text-black font-semibold">
                                                {t("Select Channel")}
                                            </label>
                                            <select

                                                value={paymethod}
                                                onChange={handlePayMethodChange}
                                                ref={payMethodRef}
                                                id="paymthod"
                                                className="rounded-lg px-6 mt-3"
                                                autoFocus
                                            >
                                                
                                                {payMethods.map((chanl) => (
                                                    <option
                                                        key={chanl}
                                                        value={chanl}
                                                    >
                                                        {t(chanl)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div><br/>
                                        {checkState && (  <div className="input-wrapper mt-5">
                                            <label htmlFor="bbn" className="!text-black font-semibold">
                                                {t("Select Payment Bank")}
                                            </label>
                                            <select

                                                value={bbn}
                                                onChange={handleBBNChange}
                                                ref={bbnRef}
                                                id="bbn"
                                                className="rounded-lg px-6 mt-3"
                                                autoFocus
                                            >
                                                {<option value="">{t("Select Bank")}</option>}
                                                {bankLists.map((bnk) => (
                                                    <option
                                                        key={bnk}
                                                        value={bnk}
                                                    >
                                                        {t(bnk)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>)}
                                       
                                       <br />
                                        <div className="input-wrapper">
                                            <label htmlFor="amount" className="text-black font-bold">
                                                {t("Amount")}
                                            </label>
                                            {/* <label htmlFor='email'>{t("Email / Phone Number")}</label> */}
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={handleAmountChange}
                                                style={{
                                                    borderColor:
                                                        amount === ""
                                                            ? ""
                                                            : "#939393",
                                                }}
                                                placeholder={t("Amount")}
                                                // placeholder='Jackrose11@gmail.com'
                                                ref={amountRef}
                                                id="amount"
                                                className="rounded-lg px-6 mt-3 !text-black placeholder-black border"
                                                autoFocus
                                            />
                                        </div>

                                        <button
                                            className={`btn-f1-1 rounded-lg mt-12`}
                                            onClick={(e) =>
                                                handleDepositClick(e)
                                            }
                                        >
                                            {t("Deposit")}
                                        </button>

                                        <TransactionHistory type={"deposit"} />
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
