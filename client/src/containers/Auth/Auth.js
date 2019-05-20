import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import styles from './Auth.module.css';
import * as actions from '../../store/actions/index';

//renders the login page
const auth = props => {
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Email Address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });
    
    const [isSignUp, setIsSignUp] = useState(true);
        


    //checks to see if you're currently building a burger and not coming from the main page
    //directs you either to burger builder to create a burger
    //or to the checkout page if you already have built a burger and need to login to continue
    useEffect(()=> {
        if (!props.buildingBurger && props.authRedirectPath !== '/') {
                    props.onSetAuthRedirectPath();
                }
    }, []);
    
    

    //check if inputs are valid
    const checkValidity= (value, rules) => {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.minLength && isValid;
        }

        return isValid;
    }

    //changes inputs when typing
    const inputChangeHandler = (event, controlName) => {
        const updatedControls = {
            ...controls,
            [controlName]: {
                ...controls[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            }
        };
        setControls(updatedControls);
        
    }

    //called when Submit button is clicked, passes on login credentials
    //changes state to let app know that user is logged in
    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value, controls.password.value, isSignUp);
    }
       
    //gathers which input is needed from state above
    const formElementsArray = [];
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        });
    }
    //maps each imput and renders it in the proper order
    let form = formElementsArray.map(formElement => (
        <Input 
            key={formElement.id} 
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            valueType={formElement.id}                        
            changed={(event) => inputChangeHandler(event, formElement.id)} />
    ));
    
    //provides a message that lets the user know mode they are in
    let message = (!isSignUp) ? <h3>Welcome Back! Log in for Burger!</h3> : <h3>Sign Up to order a Delicious Burger!</h3>;
    
    //provides a spinner if the app is retrieving credentials
    if (props.loading) {
        form = <Spinner/>
    }

    //provides an error message during login if error occurs
    let errorMessage = null;
    if (props.error) {
        errorMessage = (
            <p className={styles.ErrorMessage}>{props.error}</p>
        )            
    }

    //redirects to the correct path after login
    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath}/>
    }
        
    return (
        <div className={styles.Auth}>
            {authRedirect}
            {errorMessage}
            <div className={styles.wrapper}>
                <button 
                    onClick={() => setIsSignUp(false)}
                    className={styles.button}>Log In</button>
                <button 
                    onClick={() => setIsSignUp(true)}
                    className={styles.button}>Sign Up</button>
            </div>
            {message}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success" >SUBMIT</Button>
            </form>
        </div>
    );    
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(actions.auth(email, password, isSignUp)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(auth);