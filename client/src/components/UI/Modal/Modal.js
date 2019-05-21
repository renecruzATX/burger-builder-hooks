import React from 'react';
import styles from './Modal.module.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

//renders when the orderSummary is required
const modal = props => {
    //keeps orderSummary from updating the state until it is necessary, improving performance
    /*shouldComponentUpdate(nextProps, nextState) {
        return nextProps.show !== props.show || nextProps.children !== props.children;        
    } */   
    


    return (
        <Aux>
            <Backdrop show={props.show} clicked={props.modalClosed}/>
            <div 
                className={styles.Modal}
                style={{
                    transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
                    opacity: props.show ? '1': '0'
                }}>
                {props.children}
            </div>
        </Aux>
    );    
}

export default React.memo(
    modal, 
    (prevProps, nextProps) => 
        nextProps.show === prevProps.show && 
        nextProps.children === prevProps.children
);