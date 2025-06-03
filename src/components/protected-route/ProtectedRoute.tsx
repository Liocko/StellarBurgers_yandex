import { Preloader } from "@ui";
import { useSelector } from "../../services/store";
import { FC } from "react";
import { Navigate } from "react-router-dom";

type RedirectedRouteProps = {
    type: 'protected' | 'login',
    children: React.ReactElement;
};

export const RedirectedRoute: FC<RedirectedRouteProps> = ({ type, children }: RedirectedRouteProps) => {
     const { isAuthChecked, isLoading, user } = useSelector(state => state.user);

    if (!isAuthChecked || isLoading) {
        return <Preloader />;
    }

    if (!user && type == 'protected') {
        return  <Navigate to='/login' />;
    } else if (user && type == 'login') {
        return <Navigate to='/' />;
    }
    return children;
};