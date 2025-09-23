import React, { use, useEffect } from 'react'
import { useLocation,useNavigate } from 'react-router-dom'

function RefreshHandler({setIsAuthenticated}) {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            if (location.pathname === '/'  || location.pathname === '/auth') {
                navigate('/dash', { replace: false });
            }
        }
        
    }, [location, token, setIsAuthenticated, navigate]);    

  return (
    null
  )
}
export default RefreshHandler