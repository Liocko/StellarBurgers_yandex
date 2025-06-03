import { FC, useMemo } from 'react';
import { TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { clearConstructor, postOrder } from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(state => 
    state.burgerConstructor.constructorItems
  );

  const user = useSelector(state => 
    state.user.user
  );

  const orderRequest = useSelector(state => 
    state.burgerConstructor.orderRequest
  );

  const orderModalData =  useSelector(state => 
    state.burgerConstructor.orderModalData
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if(!user) {
      navigate('/login');
      return;
    }
    dispatch(postOrder([...constructorItems.ingredients.map(item => item._id), constructorItems.bun._id]));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );


  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
