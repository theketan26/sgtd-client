import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";


export default function() {
    const summaries = ['wedding', 'birthday', 'surajpuja', 'uthawna', 'pagdi', 'samajik', 'political', 'other'];
    const [note, setNote] = useState('');
    const [data, setData] = useState({
        "date": "",
        "days": "1",
        "desc": {
            "title": "wedding",
            "host": {
                "name": "",
                "number": "0",
                "alt_number": "0",
                "address": ""
            },
            "booker": {
                "name": "",
                "number": "0"
            },
            "referer": {
                "name": "",
                "number": "0"
            }
        },
        "payment": {
            "deposit": "0",
            "mode": "cash",
            "date": "",
        },
        "extra": ""
    });
    const [isLoading, setIsLoading] = useState(false);


    const checkDate = () => {
        let temp_date = new Date(data.date);
        if (temp_date > new Date()) {
            return true;
        } else {
            setNote('Invalid date!');
            return false;
        }
    }


    const checkDay = () => {;
        if (data.days > 0) {
            return true;
        } else {
            setNote('Invalid days!');
            return false;
        }
    }


    const checkHostName = () => {
        if (data.desc.host.name.length >= 3) {
            return true;
        } else {
            setNote('Invalid host name!');
            return false;
        }
    }


    const checkHostNumber = () => {
        let num = Number(data.desc.host.number);
        if (num > 6000000000 && num < 9999999999) {
            return true;
        } else {
            setNote('Invalid host number!');
            return false;
        }
    }


    const checkPaymentDeposit = () => {
        if (data.payment.deposit >= 0) {
            return true;
        } else {
            setNote('Invalid payment deposit!');
            return false;
        }
    }


    const handleSubmit = async (e) => {
        setIsLoading(true);

        e.preventDefault();
        if (!(checkDate() && 
                checkHostName() && 
                checkHostNumber() && 
                checkDay() && 
                checkPaymentDeposit()
                )) {
            setIsLoading(false);
            return;
        }

        setNote('');

        var result = null;
        const uri = `${process.env.REACT_APP_SERVER}/add-event/`;
        const token = localStorage.getItem('accessToken');
        const userData = JSON.parse(localStorage.getItem('userData'));
        var reqData = data;

        reqData.days = Number(reqData.days)
        reqData.payment.deposit = Number(reqData.payment.deposit)
        reqData.desc.host.number = Number(reqData.desc.host.number)
        reqData.desc.host.alt_number = Number(reqData.desc.host.alt_number)
        reqData.desc.booker.number = Number(reqData.desc.booker.number)
        reqData.desc.referer.number = Number(reqData.desc.referer.number)

        reqData = JSON.stringify(reqData);

        await axios({
            method: 'post',
            url: uri,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: reqData
        }).then(async (res) => {
            result = res.data;
        });

        if (result) {
            alert(`${data.desc.title.toLocaleUpperCase()} booking added successfully!`);
        } else {
            alert(`${data.desc.title.toLocaleUpperCase()} booking failed!`);
        }

        setIsLoading(false);
    };


    return (
        <div className = "">
            <div className = "text-3xl font-bold text-center">
                Book a Date
            </div>
            <form className = "mt-10">
                {/* Date field */}
                <div className = "flex justify-between">
                    <label htmlFor = 'date'>Date</label>
                    <input type = "date" name = "date"
                        value = { data['date'] } onChange = { (e) => setData({
                            ...data,
                            'date': e.target.value
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Title field */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'summary'>Title</label>
                    <select className = "px-4 py-2"
                        onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data['desc'],
                                'title': e.target.value
                            }
                        }) }
                        value = { data['desc']['title'] }
                    >
                        {
                            summaries.map((sum) => {
                                return (
                                    <option key = { sum } value = { sum }>
                                        { sum.toLocaleUpperCase() }
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                {/* Days */}
                {/* <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'days'>Days</label>
                    {/* <input type = "number" name = "days" placeholder = "Enter number of days..." 
                        value = { data.days } onChange = { (e) => setData({
                            ...data,
                            'days': e.target.value
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    /> 

                    <select className = "px-4 py-2"
                        onChange = { (e) => setData({
                            ...data,
                            'days': e.target.value
                        }) }
                        value = { data.days }
                    >
                        <option value = "0.5">Half</option>
                        <option value = "1">1</option>
                        <option value = "2">2</option>
                        <option value = "3">3</option>
                    </select>
                </div> 
                */}

                {/* Host name */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'host_name'>Host Name</label>
                    <input type = "text" name = "host_name" placeholder = "Enter name of host..." 
                        value = { data.desc.host.name } onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data.desc,
                                'host': {
                                    ...data.desc.host,
                                    'name': e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Host number */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'host_number'>Host Number</label>
                    <input type = "number" name = "host_number" placeholder = "Enter number of host..." 
                        value = { data.desc.host.number } onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data.desc,
                                'host': {
                                    ...data.desc.host,
                                    'number': e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Host alt number */}
                <div className = "mt-2 flex justify-between">   
                    <label htmlFor = 'host_alt_number'>Host Number 2</label>
                    <input type = "number" name = "host_alt_number" placeholder = "Enter alternate number..." 
                        value = { data.desc.host.alt_number } onChange = { (e) => setData({
                            ...data,
                            "desc": {
                                ...data.desc,
                                "host": {
                                    ...data.desc.host,
                                    "alt_number": e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Host address */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'host_address'>Host Address</label>
                    <input type = "text" name = "host_address" placeholder = "Enter address of host..." 
                        value = { data.desc.host.address } onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data.desc,
                                'host': {
                                    ...data.desc.host,
                                    'address': e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Referer name */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'referer_name'>Referer Name</label>
                    <input type = "text" name = "referer_name" placeholder = "Enter name of referer..." 
                        value = { data.desc.referer.name } onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data.desc,
                                'referer': {
                                    ...data.desc.referer,
                                    'name': e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Referer number */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'referer_number'>Referer Number</label>
                    <input type = "number" name = "referer_number" placeholder = "Enter number of referer..." 
                        value = { data.desc.referer.number } onChange = { (e) => setData({
                            ...data,
                            'desc': {
                                ...data.desc,
                                'referer': {
                                    ...data.desc.referer,
                                    'number': e.target.value
                                }
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Payment deposit */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'payment_deposit'>Payment Deposit</label>
                    <input type = "number" name = "payment_deposit" placeholder = "Enter desposit amount..." 
                        value = { data.payment.deposit } onChange = { (e) => setData({
                            ...data,
                            'payment': {
                                ...data.payment,
                                'deposit': e.target.value
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Payment mode */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'payment_mode'>Payment Mode</label>
                    <select className = "px-4 py-2"
                        onChange = { (e) => setData({
                            ...data,
                            'payment': {
                                ...data.payment,
                                'mode': e.target.value
                            }
                        }) }
                        value = { data.payment.mode }
                    >
                        <option value = "cash">Cash</option>
                        <option value = "online">Online</option>
                        <option value = "hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Payment date */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'payment_date'>Payment Date</label>
                    
                    <input type = "date" name = "date"
                        value = { data.payment.date } onChange = { (e) => setData({
                            ...data,
                            'payment': {
                                ...data.payment,
                                'date': e.target.value
                            }
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Extra detail */}
                <div className = "mt-2 flex justify-between">
                    <label htmlFor = 'extra'>Extra Details</label>
                    <input type = "text" name = "extra"
                        value = { data.extra } onChange = { (e) => setData({
                            ...data,
                            'extra': e.target.value
                        }) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>

                {/* Submit button */}
                <div className = "mt-5 flex flex-col">
                    <button onClick = { handleSubmit }
                        className = "px-5 py-2 font-bold rounded-md bg-stone-300 self-center"
                    >
                        {
                            isLoading? 
                                <BounceLoader size = { 21 } color = "orange" />
                                : 
                                'Book'
                        }
                    </button>
                </div>

                <div className = "mt-5 text-center text-rose-700">
                    { note }
                </div>
            </form>
        </div>
    )
}