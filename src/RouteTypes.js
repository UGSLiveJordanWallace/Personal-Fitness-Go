import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const BasicRoute = ({ component: Component, ...rest }) => {

    const { currentUser } = useAuth();

    return (
        <Route {...rest}
            render={props => {
                return currentUser ? <Redirect to="/table-of-contents"/> : <Component {...props}/>
        }}
        >
        </Route>
    )
}

export const PrivateRoute = ({ component: Component, ...rest }) => {

    const { currentUser } = useAuth();

    return (
        <Route {...rest}
            render={props => {
                return currentUser ? <Component {...props} /> : <Redirect to="/" /> 
        }}>
        </Route>
    )
}

export default BasicRoute;