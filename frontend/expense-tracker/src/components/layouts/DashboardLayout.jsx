import React, { useContext, useState } from 'react'
import Navbar from './Navbar';
import SideMenu from "./SideMenu"
import {UserContext} from "../../context/UserContext"

const DashboardLayout = ({children, activeMenu}) => {

    const {user} = useContext(UserContext);
    const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className=''>
      <Navbar
        activeMenu={activeMenu}
        openSideMenu={openSideMenu}
        onToggleSideMenu={() => setOpenSideMenu(prev => !prev)}
      />

      {user && (
        <div className='flex'>
            {/* Sidebar for desktop */}
            <div className='max-[1080px]:hidden'>
                <SideMenu activeMenu={activeMenu}/>
            </div>

            {/* Sidebar for mobile/tablet when toggled open (overlay with backdrop) */}
            {openSideMenu && (
              <div
                className='min-[1080px]:hidden fixed top-[61px] left-0 right-0 bottom-0 z-40 bg-black/30 backdrop-blur-sm'
                onClick={() => setOpenSideMenu(false)}
              >
                <div className='h-full' onClick={(e) => e.stopPropagation()}>
                  <SideMenu activeMenu={activeMenu}/>
                </div>
              </div>
            )}

            <div className={`grow mx-5 min-w-0`}>{children}</div>
        </div>
      )}
    </div>
  )
}

export default DashboardLayout
