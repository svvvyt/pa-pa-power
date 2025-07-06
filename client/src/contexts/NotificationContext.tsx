import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Box,
  IconButton,
  Typography,
  Collapse,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (
    message: string,
    type?: NotificationType,
    options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>
  ) => void;
  showSuccess: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => void;
  showError: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => void;
  showWarning: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => void;
  showInfo: (message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
  maxNotifications?: number;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutRefs = useRef<Map<string, number>>(new Map());

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Clear timeout if it exists
    const timeout = timeoutRefs.current.get(id);
    if (timeout) {
      window.clearTimeout(timeout);
      timeoutRefs.current.delete(id);
    }
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      
      // Limit the number of notifications
      if (newNotifications.length > maxNotifications) {
        const removedNotification = newNotifications.pop();
        if (removedNotification) {
          const timeout = timeoutRefs.current.get(removedNotification.id);
          if (timeout) {
            window.clearTimeout(timeout);
            timeoutRefs.current.delete(removedNotification.id);
          }
        }
      }
      
      return newNotifications;
    });

    // Auto-dismiss if not persistent and duration is set
    if (!notification.persistent && notification.duration !== 0) {
      const timeout = window.setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration || 5000);
      
      timeoutRefs.current.set(notification.id, timeout);
    }
  }, [maxNotifications, removeNotification]);

  const showNotification = useCallback((
    message: string,
    type: NotificationType = 'info',
    options: Partial<Omit<Notification, 'id' | 'message' | 'type'>> = {}
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      id,
      type,
      message,
      duration: 5000,
      persistent: false,
      ...options,
    };
    
    addNotification(notification);
  }, [addNotification]);

  const showSuccess = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => {
    showNotification(message, 'success', options);
  }, [showNotification]);

  const showError = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => {
    showNotification(message, 'error', { duration: 7000, ...options });
  }, [showNotification]);

  const showWarning = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => {
    showNotification(message, 'warning', options);
  }, [showNotification]);

  const showInfo = useCallback((message: string, options?: Partial<Omit<Notification, 'id' | 'message' | 'type'>>) => {
    showNotification(message, 'info', options);
  }, [showNotification]);

  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => window.clearTimeout(timeout));
    timeoutRefs.current.clear();
    setNotifications([]);
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <SuccessIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
        return <InfoIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return '#30d158';
      case 'error':
        return '#ff453a';
      case 'warning':
        return '#ff9f0a';
      case 'info':
        return '#0a84ff';
      default:
        return '#0a84ff';
    }
  };

  const contextValue: NotificationContextType = {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      
      {/* Notification Stack */}
      <Box
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
        }}
      >
        {notifications.map((notification, index) => (
          <Collapse key={notification.id} in={true} timeout={300}>
            <Box
              sx={{
                bgcolor: 'rgba(28, 28, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${getNotificationColor(notification.type)}`,
                borderRadius: 2,
                p: 2,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                minWidth: 300,
                maxWidth: 400,
                transform: `translateX(${index * 10}px)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: `translateX(${index * 10 - 5}px)`,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <Box
                  sx={{
                    color: getNotificationColor(notification.type),
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  {getNotificationIcon(notification.type)}
                </Box>
                
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {notification.title && (
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#ffffff',
                        fontWeight: 600,
                        mb: 0.5,
                        lineHeight: 1.2,
                      }}
                    >
                      {notification.title}
                    </Typography>
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#8e8e93',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {notification.message}
                  </Typography>
                  
                  {notification.action && (
                    <Box sx={{ mt: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: getNotificationColor(notification.type),
                          cursor: 'pointer',
                          fontWeight: 600,
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                        onClick={notification.action.onClick}
                      >
                        {notification.action.label}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <IconButton
                  size="small"
                  onClick={() => removeNotification(notification.id)}
                  sx={{
                    color: '#8e8e93',
                    p: 0.5,
                    '&:hover': {
                      color: '#ffffff',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          </Collapse>
        ))}
      </Box>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}; 