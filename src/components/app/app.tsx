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
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getAllIngredients } from '../../services/ingredientSlice';
import { getUser } from '../../services/userSlice';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  FeedInfo
} from '@components';
import { ProtectedRoute } from '../protected-route';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = location.state?.background;
  const goBack = () => navigate(-1);

  useEffect(() => {
    dispatch(getAllIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        {/* Не защищённые маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route
          path='/ingredients/:id'
          element={<IngredientDetails title='Детали ингредиента' />}
        />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:id' element={<OrderInfo title />} />
        {/* Защищённые маршруты */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:id'
          element={
            <ProtectedRoute>
              <OrderInfo title />
            </ProtectedRoute>
          }
        />

        {/* Маршруты для неавторизованных пользователей */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Обработка 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                children={<IngredientDetails />}
                title='Детали ингредиента'
                onClose={goBack}
              />
            }
          />
          <Route
            path='/feed/:id'
            element={
              <Modal
                children={<OrderInfo />}
                title={`#${location.pathname.split('/')[2]}`}
                onClose={goBack}
              />
            }
          />
          <Route
            path='/profile/orders/:id'
            element={
              <ProtectedRoute>
                <Modal
                  children={<OrderInfo />}
                  title={`#${location.pathname.split('/')[3]}`}
                  onClose={goBack}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
