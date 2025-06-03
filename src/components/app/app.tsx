import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { RedirectedRoute } from '../protected-route';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getUser } from '../../services/slices/userSlice';

const App = () =>{ 
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate(); 

  const { isAuthChecked } = useSelector(state => state.user);


  useEffect(()=> {
    if(!isAuthChecked)
      dispatch(getUser());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/login' element={<RedirectedRoute type='login'><Login /></RedirectedRoute>} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/profile' element={<RedirectedRoute type='protected'><Profile /></RedirectedRoute>} />
        <Route path='/profile/orders' element={<RedirectedRoute type='protected'><ProfileOrders /></RedirectedRoute>} />
        <Route path='*' element={<NotFound404 />} />

        <Route path='/ingredients/:id' element={<ConstructorPage />} />
        <Route path='/feed/:number' element={<Feed />} />
        <Route
            path='/profile/orders/:number'
            element={
              <RedirectedRoute type='protected'>
                  <ProfileOrders />
              </RedirectedRoute>
            }
           />
      </Routes>
      <Routes>
        <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={() => {navigate('/feed')}}>
                <OrderInfo type='feed' />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => {navigate('/')}}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <RedirectedRoute type='protected'>
                <Modal title={''} onClose={() => {navigate('/profile/orders')}}>
                  <OrderInfo type='profile'/>
                </Modal>
              </RedirectedRoute>
            }
           />
      </Routes>
    </div>
  );
};

export default App;
