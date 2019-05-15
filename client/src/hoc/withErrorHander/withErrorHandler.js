import React, {useState, useEffect} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux';

//higher order component that wraps components and uses axios interceptors to provide error handling
const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, setError] = useState(null);
        
        //initializes axios interceptors for components wrapped
        const reqInterceptor = axios.interceptors.request.use(req => {
            setError(null);
            return req;
        });
        const resInterceptor = axios.interceptors.response.use(res => res, err => {
            setError(err);
        });
        

        //unmounts interceptors when not needed to improve performance
        useEffect(()=> {
            return () => {
                axios.interceptors.request.eject(reqInterceptor);
                axios.interceptors.request.eject(resInterceptor);
            }
        }, [reqInterceptor, resInterceptor]);
            
        
        //sets errors to null when user closes modal
        const errorConfirmedHandler = () => {
            setError(null);
        }

     
        return (
            <Aux>
                <Modal 
                    show={error}
                    modalClosed={errorConfirmedHandler}>
                    {error ?  error : null}
                </Modal>
                <WrappedComponent {...props}/>
            </Aux>

        );
        
    } 
} 

export default withErrorHandler;