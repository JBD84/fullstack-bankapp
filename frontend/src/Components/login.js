import React , { useState } from 'react';
import Card from './card';
import { useFormik } from 'formik';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { ToolTips, Header } from '../utils/tools';
import { auth, logInWithEmailAndPassword, signInWithGoogle } from '../utils/fir-login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { GoogleLoginButton } from "react-social-login-buttons";

import { LoadingPage } from '../utils/tools';
import { ButtonGroup } from 'react-bootstrap';

function Login() {

    const [btndisabled, setBtnDisabled] = useState(true);
    const [user, loading] = useAuthState(auth);

    const loginWithGoogle = async () => {
        await signInWithGoogle()
    };
        // if return is true ==> go to the bridge function that connects to the backend (i.e. accountsummary.js?)

    const loginManually = async (userData) => {
        await logInWithEmailAndPassword(userData.email, userData.password);
    };

    const formik = useFormik({
        initialValues: {
            email: "", //currState.user.email,
            password: "", // currState.user.password,
        },
        onSubmit: (values, {resetForm}) => {
            loginManually(values);
         },
        validate,
    });
    
    function validate (values) {
        let errors = {};
        let disableBtn = false;

        if (!values.email) {
            errors.email = 'Field required';
             disableBtn = true;
       } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Email should be in the correct format';
            disableBtn = true;
            // Adding another branch, check whether email is in users
        }; 
      
        if (!values.password) {
          errors.password = 'Field required';
          disableBtn = true;
        } else if (values.password.length < 8) {
            errors.password = 'Password length must be 8 characters or longer';
            // Adding another branch, check whether password is in ctx
            disableBtn = true;
        };
        
        setBtnDisabled(disableBtn);
        return errors;
    };
    
    return (
        <Card 
            bgcolor="danger"
            txtcolor="white"
            header=<Header/>
            title="ACCESS YOUR ACCOUNT"
            text="Access your restricted area to manage your account"
            body={user ? (
                <Navigate replace to="/accountsummary" >
                </Navigate>
                ) : (
                <>
                { loading ? <LoadingPage /> : <></>}
                <form onSubmit={formik.handleSubmit}>
                    Email address<br/>
                    <input type="input" className="form-control" id="email" placeholder="Enter email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} autoComplete="off"/> {formik.touched.email && formik.errors.email ? (<div id="emailError" style={{color:'red'}}>{formik.errors.email}</div>) : null}<br/>
                    Password<br/>
                    <input type="password" autoComplete="off" className="form-control" id="password" placeholder="Enter password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}/>{formik.touched.password && formik.errors.password ? (<div id="pswError" style={{color: 'red'}}autoComplete="off">{formik.errors.password}</div>) : null}<br/>
                    <button data-tip data-for="existAccTip" type="submit" className="btn btn-warning" disabled={btndisabled}> Login</button>
                    <ToolTips></ToolTips>
                </form> 
                <hr/>
                    <GoogleLoginButton onClick={loginWithGoogle} />
                    <hr/>
                <ButtonGroup vertical>
                    <Link to="/reset" className="btn btn-warning">Forgot Password</Link>
                   <Link to="/createaccount"className="btn btn-warning" > Don't have an account? <br/>Register now</Link>
                </ButtonGroup>
                </>
                )
            }
        />
    );
}


export default Login;