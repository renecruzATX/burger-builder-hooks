import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

import Order from '../../components/Order/Order';
import axios from 'axios';
//import withErrorHandler from '../../hoc/withErrorHander/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import OrderDeets from '../../containers/Orders/OrderDeets/OrderDeets';
import ConfirmDelete from '../../containers/Orders/ConfirmDelete/ConfirmDelete';

//renders past orders on the Orders page
const orders = props => {
    const [showOrders, setShowOrders] = useState(false);    
        
    const [deleteOrders, setDeleteOrders] = useState(null);

    //initializes the orders from the server
    useEffect(()=>{
        props.onFetchOrders(props.token);
    }, []);
        
    

    //sets the order props so a modal can be shown of the order details
    const orderDetailsHandler = (order) => {
        props.onSetOrderId(order.order);
        setShowOrders(true);       
    };

    //Sets conditions for a Modal to pop up confirming the deletion of an order
    const confirmDeleteHandler = (order) => {
        props.onSetOrderId(order._id);
        props.onConfirmDelete(true);        
        setShowOrders(true);
        setDeleteOrders(null);       
    };

    //deletes the selected order
    const deletOrderHandler = () => {
        axios.delete('/orders/' + props.orderId)
                .then(response => {                    
                    setDeleteOrders(response.data)
                })
                .catch(error => error);                  
    }

    //closes any modals and resets all states related to the orders
    const closeModalHandler = () => {
        props.onConfirmDelete(false);
        setShowOrders(false);
        setDeleteOrders(null);
        props.onSetOrderId(0);
    }


    let orderDeets = null;
    if (props.orderId && !props.confDelete) {
        orderDeets = <OrderDeets order={props.orderId}/>
    }

    let confirmDelete = null;
    if (props.confDelete) {
        confirmDelete = <ConfirmDelete deleteOrder={()=>deletOrderHandler()}/>
    }

    let orders = <Spinner/>;
    if (!props.loading) {
        orders = props.orders.map(order =>(
            <div key={(order.id * 7)}>
                <Order 
                key={order.id}
                ingredients={order.order.ingredients}
                price = {+order.order.price}
                orderDetails={()=>orderDetailsHandler(order)}
                orderDelete={()=>confirmDeleteHandler(order)}/>                        
            </div>
        ))
    };
    //??????
    if (deleteOrders) {
        window.alert('Order Deleted!!!!');
        closeModalHandler();        
        props.onFetchOrders(props.token);
    };  

    return (
        <div>
            
            <Modal show={showOrders} modalClosed={closeModalHandler}>
                {orderDeets}
                {confirmDelete}
            </Modal>
            {orders}
        </div>
    );
    
};

const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        orderId: state.order.orderId,
        confDelete: state.order.confDelete
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token) => dispatch(actions.fetchOrders(token)),
        onSetOrderId: (orderId) => dispatch(actions.setOrderId(orderId)),
        onConfirmDelete: (confDelete) => dispatch(actions.confirmDelete(confDelete))
    };
};

//export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
export default connect(mapStateToProps, mapDispatchToProps)(orders);