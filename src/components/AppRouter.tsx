import { Route, Routes } from 'react-router-dom';
import { allRoutes } from '../router/routes';
import { FC } from 'react';

const AppRouter: FC = () => {
    return (
        <Routes>
            {allRoutes.map(route=> (
                <Route
                    key={route.path}
                    path={route.path}
                    element={<route.component />}
                />
            ))}
        </Routes>
    );
};

export default AppRouter;