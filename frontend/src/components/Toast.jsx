import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import { useNotificationStore } from '../store/useStore';

const Toast = ({ notification }) => {
  const { removeNotification } = useNotificationStore();

  const icons = {
    success: <FiCheckCircle className="w-5 h-5 text-green-400" />,
    error: <FiAlertCircle className="w-5 h-5 text-red-400" />,
    warning: <FiAlertCircle className="w-5 h-5 text-yellow-400" />,
    info: <FiInfo className="w-5 h-5 text-blue-400" />
  };

  const bgColors = {
    success: 'bg-green-900/20 border-green-800 text-green-200',
    error: 'bg-red-900/20 border-red-800 text-red-200',
    warning: 'bg-yellow-900/20 border-yellow-800 text-yellow-200',
    info: 'bg-blue-900/20 border-blue-800 text-blue-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md ${
        bgColors[notification.type]
      }`}
    >
      {icons[notification.type]}
      <div className="flex-1">
        <p className="font-semibold">{notification.title}</p>
        {notification.message && (
          <p className="text-sm opacity-90">{notification.message}</p>
        )}
      </div>
      <button
        onClick={() => removeNotification(notification.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity"
      >
        <FiX className="w-5 h-5" />
      </button>
    </motion.div>
  );
};

const ToastContainer = () => {
  const { notifications } = useNotificationStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Toast key={notification.id} notification={notification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;