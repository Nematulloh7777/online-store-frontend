import { useEffect } from "react";
import AppRouter from "./components/AppRouter"
import Header from "./components/Header/Header"
import { fetchMe } from "./redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks/hooksRedux";
import Drawer from "./components/UI/Drawer/Drawer";
import { closeDrawer, openDrawer, toggleDrawer } from "./redux/slices/drawerSlice";
import MobileHeader from "./components/MobileHeaderDown/MobileHeader";

const App = () => {
  const dispatch = useAppDispatch()
  const drawerOpen = useAppSelector(state => state.drawer.isOpen)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchMe())
    }
  }, [dispatch])


  return (
    <div className="bg-white dark:bg-[#0f172a] min-h-screen xl:min-h-min xl:rounded-[25px] xl:mb-10 xl:w-[85%] xl:m-auto xl:mt-14 xl:shadow-lg xl:shadow-white/75">
      <Drawer drawerClose={() => dispatch(closeDrawer())} isOpen={drawerOpen} />
      <Header drawerOpen={() => dispatch(openDrawer())} />
      <MobileHeader toggleDrawer={() => dispatch(toggleDrawer())} />
      
      <div className="p-5 mb-16 xl:mb-0 xl:p-12">
        <AppRouter />
      </div>
    </div>
  )
}

export default App