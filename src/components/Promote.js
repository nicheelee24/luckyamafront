import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Promote = () => {
    const [loginid, setLoginId] = useState("LK934534534");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchMyInfo();
    }, []);

    const fetchMyInfo = async () => {
        try {
            setLoading(true);
            const token = window.localStorage.getItem("token");

            const options = {
                method: "GET",
                url: process.env.REACT_APP_BACKEND + "/api/auth",
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-auth-token": token,
                },
            };

            await axios
                .request(options)
                .then(function (response) {
                    console.log("responseeeeeeeeeee"+response.data);
                    const user = response.data;
                    setLoginId(user.name);
                    
                })
                .catch(function (error) {
                    console.log(error);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error fetching mybets:", error);
        }
    };

   

    

    return (
        <div className="max-w-[1200px] m-auto w-full mt-[30px] px-4 md:px-0">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg text-[var(--secondaryColor)] font-semibold">
                    Promote
                </h1>
                <div className="flex items-center">
                    {/* <input type="date" className="border p-1 rounded mr-2" defaultValue={fromDate}/>
                      <span>to</span>
                      <input type="date" className="border p-1 rounded mx-2" defaultValue={toDate}/> */}
                    {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Go
                      </button> */}
                </div>
            </div>

            <div className="overflow-x-auto relative sm:rounded-lg mt-4">
                <div className="flex flex-col md:flex-row w-full text-sm text-left gap-6">
                    <div className="w-full md:w-1/2">
                        <h3 className="text-lg text-white border-[var(--logoutBg)] border-b-[4px] mb-4 font-bold">
                            Available Promotion Offers
                        </h3>

                        <div className="flex gap-8">
                            <div className="w-1/2">
                               
                               

                               

                                

                             
                            </div>

                            <div className="w-1/2">
                                

                                {/* 
                                <div className="sub-info-group mt-4 border-b border-black">
                                    <span className="text-[var(--textPrimaryColor)]">Amount</span>
                                    <p className="p-2 text-[var(--textSecondaryColor)]">THB</p>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                       

                       

                       

                      
                    </div>
                </div>
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
    );
};
