import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";


export default function (props) {
    const [isBook, setIsBook] = useState(false);
    const [data, setData] = useState([]);
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const position = useSelector((state) => state.position);
    const [areConfirm, setAreConfirm] = useState(false);


    async function handleChange() {
        try {
            if (props.data['status']) {
                await setIsBook(true);
                await setData(props.data['data']);
            }
            else {
                await setIsBook(false);
                await setData([]);
            }
        } catch (e) {
        }
    };


    const handleConfirmDelete = (e) => {
        e.preventDefault();
        setAreConfirm(true);
    }


    const handleConfirmNo = (e) => {
        e.preventDefault();
        setAreConfirm(false);
    }


    useEffect(() => {
        handleChange();
        setAreConfirm(false);
    }, [props])


    return (
        <div className = "self-center mt-5 p-5 text-xl font-bold">
            { props.isLoading ? 
                <div>
                    <BounceLoader size = { 40 } color = "orange" />
                </div>
                :
                <div>
                    { isBook ? 
                        <div className = "flex flex-col align-center">
                            <div className = "bg-rose-300 text-center px-4 py-2 rounded">Booked</div>
                            {
                                data.map((item, index) => {
                                    return (
                                        <div key = { index } className = "mt-5">
                                            <div className = "text-center font-medium">
                                                <div className = "">
                                                    { item.title.toUpperCase() }
                                                </div>
                                                <div>
                                                    <div>Host: { item.host }</div>
                                                    <div>Booker: { item.booker_name }</div>
                                                    <div>Booker Number: { item.booker_number }</div>
                                                </div>
                                            </div>
                                            {
                                                (position === 1) && (
                                                    (areConfirm) ?
                                                        <div>
                                                            <button className = "mt-4 rounded-md border-stone-800 border-4 px-2 py-1"
                                                                onClick = {(e) => props.handleDelete(e, item.event_id)}>
                                                                Yes
                                                            </button>
                                                            <button className = "ml-2 mt-4 rounded-md border-stone-800 border-4 px-2 py-1"
                                                                onClick = {(e) => handleConfirmNo(e)}>
                                                                No
                                                            </button>
                                                        </div>
                                                        :
                                                        <button className = "mt-4 rounded-md border-stone-800 border-4 px-2 py-1"
                                                            onClick = {(e) => handleConfirmDelete(e)}>
                                                            Delete
                                                        </button>
                                                )
                                            }
                                        </div>
                                    )
                                })
                            }
                        </div>
                        :
                        <div className = "bg-green-300 px-4 py-2 rounded">
                            No Bookings
                        </div>
                    }
                </div>
            }
        </div>
    )
}