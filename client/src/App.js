import React, { useEffect, Suspense } from 'react';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index'; 

const Checkout = React.lazy(()=>{
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(()=>{
  return import('./containers/Orders/Orders');
});

const Auth = React.lazy(()=>{
  return import('./containers/Auth/Auth')
});

const app = props => {
  //checks to see if user is already logged in
  useEffect(()=>{
    props.onTryAutoSignup();
  }, []);
 
  //renders routes that don't need authentication
  let routes = (
    <Switch>
      <Route path="/login" render={()=> <Auth/>}/>
      <Route path="/" exact component={BurgerBuilder}/>
      <Redirect to="/"/>
    </Switch>
  );
  //if user is authenticated, renders all routes available
  if (props.isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={()=> <Checkout/>}/>
        <Route path="/orders" render={()=> <Orders/>}/>
        <Route path="/logout" component={Logout}/>
        <Route path="/login" render={()=> <Auth/>}/>
        <Route path="/" exact component={BurgerBuilder}/>
        <Redirect to="/"/>
      </Switch>
    );
  };

  //Layout is the container that lay out the rest of the app
  return (
    <div>
      <Layout>
        <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense> 
      </Layout>
    </div>
  );  
}

//grabbing state from the redux store for this container
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

//changes state if necessary to the Redux store
const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

//connect function from Redux interferes with React Router so withRouter() allows it to work 
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(app));
