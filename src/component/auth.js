import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import { Link } from "react-router-dom";
import { signup, signin } from "../actions/auth";
import {Password} from 'primereact/password';
import classNames from 'classnames';

const Auth = () => {

    const initialState = {
        name:'',
        email:'',
        password:'',
        confirmpassword:''
    };

    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [submitted, setSubmitted] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (e) => {
        setSubmitted(true);
        
        e.preventDefault();
        console.log(formData);

        if(isSignup){
            dispatch(signup(formData, history));
        }
        else{
            dispatch(signin(formData, history));
        }
    }

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]:e.target.value});
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    const googleSuccess = async(res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({type:'AUTH', data: {result, token}});
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (error) => {
        console.log(error);
        console.log("Google Sign In was Unsuccessful");
    }

    return ( 
        <div className={isSignup? 'signup':'login'}>
            <Card className="cardname" title={isSignup? 'Register': 'Login'} style={{ width: '30rem'}}>
                <form className="p-fluid" onSubmit={handleSubmit}>
                {
                    isSignup && (
                    <>
                        <div className="p-field">
                        <label htmlFor="name">Name*</label>
                        <div className="p-col">
                            <InputText 
                            id="name" 
                            type="text"
                            className={classNames({ 'p-invalid': submitted && !formData.name })}
                            // value={user.companyname}
                            onChange={handleChange}
                            name="name"
                            required 
                            autoFocus
                            />
                            {submitted && !formData.name && <small className="p-error">Name is required.</small>}
                        </div>
                    </div><br/>
                    </>
                )
            }
             <div className="p-field">
                        <label htmlFor="email">Email*</label>
                        <div className="p-col p-input-icon-right">
                                <InputText 
                                type="email"
                                id="email" 
                                name="email"
                                onChange={handleChange}
                                required 
                                className={classNames({ 'p-invalid': submitted && !formData.email })}
                                />
                                {submitted && !formData.name && <small className="p-error">Email is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label htmlFor="password">Password*</label>
                        <div className="p-col p-input-icon-right">
                            <Password
                            id="password"
                            name="password" 
                            type="password"
                            onChange={handleChange}
                            feedback={false}
                            toggleMask
                            required 
                            className={classNames({ 'p-invalid': submitted && !formData.password })}
                            />
                            {submitted && !formData.password && <small className="p-error">Password is required.</small>}
                        </div>
                    </div><br/>

                    {
                        isSignup && 
                        <>
                        <div className="p-field">
                        <label htmlFor="confirmpassword">Repeat Password*</label>
                        <div className="p-col p-input-icon-right">
                            <Password
                            id="confirmpassword"
                            name="confirmpassword" 
                            type="password"
                            onChange={handleChange}
                            feedback={false}
                            toggleMask
                            required 
                            className={classNames({ 'p-invalid': submitted && !formData.confirmpassword })}
                            />
                            {submitted && !formData.confirmpassword && <small className="p-error">Password is required.</small>}
                        </div>
                    </div><br/>
                    </>
                    }
                    
                   <Button type="submit" label={isSignup? 'Register': 'Sign In'} className="p-button-raised p-button-sm p-button-info" style={{width:"217px", marginRight: '.5em', marginBottom: '.5em'}}/>
                   <GoogleLogin
                        clientId="94683189831-492mg4ah6li7bc3d67j0ehgai33mkp9e.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button 
                            label="Google"
                            icon = "pi pi-google"
                            className="p-button-raised p-button-sm p-button-danger"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            style={{width:"217px", marginRight: '.5em', marginBottom: '.5em'}}/>
                        )}
                       onSuccess={googleSuccess}
                       onFailure={googleFailure} 
                       cookiePolicy="single_host_origin"
                    />
                   <Link onClick={switchMode} className="back-button">
                        {isSignup? 'Already have an account? Sign In': "Don't have account? Register"}
                   </Link>
                </form>    
            </Card>        
        </div>
     );
}
 
export default Auth;