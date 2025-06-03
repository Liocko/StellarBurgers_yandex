import { userSlice, loginUser, getUser, updateUser, logoutUser, registerUser } from '../src/services/slices/userSlice';
import { TUser } from '../src/utils/types';
import { TLoginData, TAuthResponse, TRegisterData } from '../src/utils/burger-api';
// five
jest.mock('../src/utils/burger-api', () => ({
    loginUserApi: jest.fn(),
    registerUserApi: jest.fn(),
    logoutApi: jest.fn(),
    getUserApi: jest.fn(),
    updateUserApi: jest.fn()
}));

const createTestUser = (overrides = {}): TUser => ({
    email: 'testuser@stellar-burgers.com',
    name: 'Тестовый Пользователь',
    ...overrides
});

const createApiResponse = (user: TUser, success = true): TAuthResponse => ({
    success,
    user,
    accessToken: 'Bearer test-jwt-token',
    refreshToken: 'test-refresh-token',
});

describe('Слайс управления пользователем', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const testCredentials: TLoginData = {
        email: 'testuser@stellar-burgers.com',
        password: 'securePassword123',
    };

    const testUser = createTestUser();
    const testApiResponse = createApiResponse(testUser);

    describe('Асинхронные операции авторизации', () => {
        it('должен корректно устанавливать состояние загрузки при начале запроса входа', () => {
            const baseState = userSlice.getInitialState();
            const loadingState = userSlice.reducer(
                baseState, 
                loginUser.pending('request-123', testCredentials)
            );
    
            expect(loadingState.isLoading).toBe(true);
            expect(loadingState.isAuthChecked).toBe(true);
            expect(loadingState.user).toBeNull();
        });
    
        it('должен правильно обновлять состояние при успешном входе пользователя', async () => {
            const loginUserApi = require('../src/utils/burger-api').loginUserApi;
            loginUserApi.mockResolvedValue(testApiResponse);
    
            const baseState = userSlice.getInitialState();
            const successState = userSlice.reducer(
                baseState, 
                loginUser.fulfilled(testUser, 'request-123', testCredentials)
            );
            
            expect(successState.user).toEqual(testUser);
            expect(successState.isLoading).toBe(false);
            expect(successState.isAuthChecked).toBe(true);
        });

        it('должен устанавливать флаг ошибки при неудачной авторизации', () => {
            const errorMessage = 'Неверный логин или пароль';
            const baseState = userSlice.getInitialState();
            const errorState = userSlice.reducer(
                baseState, 
                loginUser.rejected(new Error(errorMessage), 'request-123', testCredentials)
            );
        
            expect(errorState.isLoading).toBe(false);
            expect(errorState.isAuthChecked).toBe(true);
            expect(errorState.user).toBeNull();
        });
    });

    describe('Управление сессией пользователя', () => {
        it('должен сбрасывать данные пользователя при выходе из системы', () => {
            const logoutApi = require('../src/utils/burger-api').logoutApi;
            logoutApi.mockResolvedValue({ success: true });

            const authState = {
                ...userSlice.getInitialState(),
                user: testUser,
                isAuthChecked: true
            };
            
            const logoutState = userSlice.reducer(
                authState, 
                logoutUser.fulfilled(undefined, 'request-123')
            );

            expect(logoutState.user).toBeNull();
            expect(logoutState.isLoading).toBe(false);
            expect(logoutState.isAuthChecked).toBe(true);
        });
    });

    describe('Получение данных пользователя', () => {
        it('должен корректно устанавливать состояние загрузки при запросе данных', () => {
            const baseState = userSlice.getInitialState();
            const loadingState = userSlice.reducer(
                baseState, 
                getUser.pending('request-123')
            );
    
            expect(loadingState.isLoading).toBe(true);
        });
    
        it('должен правильно сохранять данные пользователя при успешном запросе', () => {
            const getUserApi = require('../src/utils/burger-api').getUserApi;
            getUserApi.mockResolvedValue({ success: true, user: testUser });
    
            const baseState = userSlice.getInitialState();
            const successState = userSlice.reducer(
                baseState, 
                getUser.fulfilled({ success: true, user: testUser }, 'request-123')
            );
          
            expect(successState.user).toEqual(testUser);
            expect(successState.isLoading).toBe(false);
            expect(successState.isAuthChecked).toBe(true);
        });
        
        it('должен корректно обрабатывать ошибки при запросе данных пользователя', () => {
            const errorMessage = 'Ошибка сети';
            const baseState = userSlice.getInitialState();
            const errorState = userSlice.reducer(
                baseState, 
                getUser.rejected(new Error(errorMessage), 'request-123')
            );
        
            expect(errorState.isLoading).toBe(false);
            expect(errorState.isAuthChecked).toBe(true);
        });
    });
    
    describe('Обновление данных пользователя', () => {
        it('должен обновлять информацию о пользователе при успешном запросе', () => {
            const updateData = { name: 'Обновленное Имя' };
            const updatedUser = { ...testUser, ...updateData };
            
            const updateUserApi = require('../src/utils/burger-api').updateUserApi;
            updateUserApi.mockResolvedValue({ success: true, user: updatedUser });
            
            const initialUserState = {
                ...userSlice.getInitialState(),
                user: testUser
            };
            
            const updatedState = userSlice.reducer(
                initialUserState,
                updateUser.fulfilled({ success: true, user: updatedUser }, 'request-123', updateData)
            );
            
            expect(updatedState.user).toEqual(updatedUser);
            expect(updatedState.isLoading).toBe(false);
        });
    });
    
    describe('Регистрация нового пользователя', () => {
        const registerData: TRegisterData = {
            email: 'new@stellar-burgers.com',
            password: 'securePassword123',
            name: 'Новый Пользователь'
        };
        
        it('должен корректно обрабатывать успешную регистрацию', () => {
            const newUser = createTestUser({
                email: registerData.email,
                name: registerData.name
            });
            
            const registerResponse = createApiResponse(newUser);
            
            const registerUserApi = require('../src/utils/burger-api').registerUserApi;
            registerUserApi.mockResolvedValue(registerResponse);
            
            const baseState = userSlice.getInitialState();
            const registeredState = userSlice.reducer(
                baseState,
                registerUser.fulfilled(newUser, 'request-123', registerData)
            );
            
            expect(registeredState.isLoading).toBe(false);
        });
    });
});
