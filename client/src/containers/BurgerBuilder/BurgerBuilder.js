import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHander/withErrorHandler';
import axios from 'axios';
import * as actions from '../../store/actions/index';

//renders the main burger builder container where the burger is built and ordered
const burgerBuilder = props => {
    const [purchasing, setPurchasing] = useState(false);
    
    //initializes the ingredients from the server
    useEffect(()=> {
        props.onInitIngredients();
    }, []);

    //lets the app know that there are ingredients in the burger and are available to purchase
    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
        .map(igKey=>{
            return ingredients[igKey];
        })
        .reduce((sum, el)=>{
            return sum + el;
        }, 0);
        return sum > 0;
    }

    //moves to the checkout summary page if submit button is clicked    
    const purchaseHandler = () => {
        if (props.isAuthenticated) {
            setPurchasing(true);
        }else{
            props.onSetAuthRedirectPath('/checkout');
            props.history.push('/login');
        };
    };

    //cancels order if cancel button is clicked
    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }

    //continues to gather order info 
    const purchaseContinueHandler = () => {
        props.onInitPurchase();                    
        props.history.push('/checkout');
    }
    
    
    const disabledInfo = {
        ...props.ings
    };
    for (let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <=0
    }
    let orderSummary = null;        
    
    let burger = props.error ? <p>Ingredients can't be loaded!</p> : <Spinner/>;

    if (props.ings) {
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo} 
                    purchaseable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuthenticated}
                    price={props.price} />
            </Aux>
        );
        orderSummary = <OrderSummary                         
            ingredients={props.ings}
            price={props.price}
            purchaseCancelled={purchaseCancelHandler}
            purchaseContinued={purchaseContinueHandler} />
    }
            
    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );
    
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchtoProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    };
}

export default connect(mapStateToProps, mapDispatchtoProps)(withErrorHandler(burgerBuilder, axios));