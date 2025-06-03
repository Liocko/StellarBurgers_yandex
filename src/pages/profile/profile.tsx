import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { AppDispatch, useDispatch, useSelector } from '../../services/store';
import userEvent from '@testing-library/user-event';
import { getUser, updateUser } from '../../services/slices/userSlice';
import { TRegisterData } from '@api';
import { TUser } from '@utils-types';

export const Profile: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(state => state.user.user || { name: '', email: '' });

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const values: Partial<TRegisterData> = {
      ...(formValue.name != user.name 
        ? { name: formValue.name  }
        : {}),
      ...(formValue.email != user.email 
        ? { email: formValue.email  }
        : {}),
      ...(formValue.password.length > 0
        ? { password: formValue.password  }
        : {})
      };
    dispatch(updateUser(values));
    setFormValue((prevState) => ({
      ...prevState,
      password: ''
    }));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
