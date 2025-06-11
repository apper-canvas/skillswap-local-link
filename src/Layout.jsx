import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routes } from './config/routes';

export default function Layout() {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-16">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-full"
        >
          <Outlet />
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-surface-200 z-40">
        <div className="flex items-center justify-around px-4 py-2">
          {Object.values(routes).map(route => {
            const isActive = location.pathname === route.path;
            return (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                  }
                `}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center"
                >
                  <ApperIcon 
                    name={route.icon} 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-gray-500'}
                  />
                  <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                    {route.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}