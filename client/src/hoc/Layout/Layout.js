import React, {useState} from 'react';
import {connect} from 'react-redux';

import Aux from '../Aux';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

//higher order component that gives the whole app its look
const layout = props => {
    const [siedDrawerIsVisible, setSideDrawerisVisible] = useState(false);
    
    const sideDrawerClosedHandler = () => {
        setSideDrawerisVisible(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerisVisible(!siedDrawerIsVisible); 
    }

    return (
        <Aux>
            <Toolbar 
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHandler}/>
            <SideDrawer 
                isAuth={props.isAuthenticated}
                open={siedDrawerIsVisible} 
                closed = {sideDrawerClosedHandler} />
            <main className={styles.Content}>
                {props.children}
            </main>
        </Aux>
    )
    
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    };
};

export default connect(mapStateToProps)(layout);