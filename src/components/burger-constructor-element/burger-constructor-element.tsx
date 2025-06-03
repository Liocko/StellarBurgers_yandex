import { FC, memo, useRef } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { AppDispatch, useDispatch } from '../../services/store';
import { moveIngredient, removeIngredient } from '../../services/slices/burgerConstructorSlice';
import { useDrag, useDrop } from 'react-dnd';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch: AppDispatch = useDispatch();

    const handleMoveDown = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index + 1}));
    };

    const handleMoveUp = () => {
      dispatch(moveIngredient({ fromIndex: index, toIndex: index - 1}));
    };

    const handleClose = () => {
      dispatch(removeIngredient(index));
    };


    const ref = useRef<HTMLLIElement>(null);

    
    const [, drag] = useDrag({
      type: 'ingredient',
      item: { index },
    });


    const [, drop] = useDrop({
      accept: 'ingredient',
      hover: (item: { index: number }) => {
        if (!ref.current || item.index === index) {
          return;
        }
        console.log({ fromIndex: item.index, toIndex: index});
        dispatch(moveIngredient({ fromIndex: item.index, toIndex: index}));
        item.index = index;
      },
    });
    
    drag(drop(ref));

    return (
        <BurgerConstructorElementUI
          ref={ref}
          ingredient={ingredient}
          index={index}
          totalItems={totalItems}
          handleMoveUp={handleMoveUp}
          handleMoveDown={handleMoveDown}
          handleClose={handleClose}
        />
    );
  }
);
