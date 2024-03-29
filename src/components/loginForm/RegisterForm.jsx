import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";


export default function() {
    const [note, setNote] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [cPassword, setCPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();


    const checkNumber = () => {
        let num = Number(number);
        if (num > 6000000000 && num < 9999999999) {
            return true;
        } else {
            setNote('Invalid number!');
            return false;
        }
    };


    const checkPassword = () => {
        if (password.length < 8) {
            setNote('Password must have atleast 8 characters!');
            return false;
        }
        if (password === cPassword) {
            return true;
        } else {
            setNote('Password not same!');
            return false;
        }
    }


    const checkName = () => {
        if (name.length > 2) {
            return true;
        } else {
            setNote('Name not valid!');
            return false;
        }
    }


    const handleSubmit = async (e) => {
        setIsLoading(true);

        e.preventDefault();
        if (!(checkNumber() && checkPassword() && checkName())) {
            setIsLoading(false);
            return;
        }

        setNote('');

        let uri = `https://sgtd.onrender.com/add-user`;

        let data;
        await axios({
            method: 'post',
            url: uri,
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            data: {
                'number': number,
                'password': password
            }
        }).then(async (res) => {
            data = res.data;
        });

        if (!data.status) {
            setNote(data.message);
            return;
        }
        
        uri = `https://sgtd.onrender.com/update-user`;

        await axios({
            method: 'post',
            url: uri,
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            data: {
                'number': number,
                'name': name,
                'email': email,
                'position': 0
            }
        }).then(async (res) => {
            data = res.data;
        });

        if (data.status) {
            setNote('Added');
            setNumber('');
            setPassword('');
            setCPassword('');
            setName('');
            setEmail('');
        } else {
            setNote(data.message);
        }

        setIsLoading(false);
    };


    return (
        <div className = "">
            <div className = "text-3xl font-bold text-center">
                Register
            </div>
            <form className = "mt-10">
                <div className = "flex justify-between">
                    <label for = 'number'>Number</label>
                    <input type="text" name="number" placeholder = "Enter your number..." 
                        value = { number } onChange = { (e) => setNumber(e.target.value) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>
                <div className = "mt-2 flex justify-between">
                    <label for = 'password'>Password</label>
                    <input type="password" name="password" placeholder = "Enter your password..." 
                        value = { password } onChange = { (e) => setPassword(e.target.value) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>
                <div className = "mt-2 flex justify-between">
                    <label for = 'c_password'>Confirm Password</label>
                    <input type="password" name="c_password" placeholder = "Enter your password..." 
                        value = { cPassword } onChange = { (e) => setCPassword(e.target.value) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>
                <div className = "mt-2 flex justify-between">
                    <label for = 'name'>Name</label>
                    <input type="text" name="name" placeholder = "Enter your name..." 
                        value = { name } onChange = { (e) => setName(e.target.value) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>
                <div className = "mt-2 flex justify-between">
                    <label for = 'email'>Email</label>
                    <input type="text" name="email" placeholder = "Enter your email..." 
                        value = { email } onChange = { (e) => setEmail(e.target.value) }
                        className = "ms-5 border-2 border-stone-600 px-2 py-1 rounded-md" 
                    />
                </div>
                <div className = "mt-5 flex flex-col">
                    <button onClick = { handleSubmit }
                        className = "px-5 py-2 font-bold rounded-md bg-stone-300 self-center"
                    >
                        {
                            isLoading?
                                <BounceLoader size = { 21 } color = "orange" />
                                :   
                                "Register"
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