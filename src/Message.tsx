import React, { useState, useEffect } from 'react';
import './Message.css';

interface MessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  content: string;
  duration?: number;
  onClose?: () => void;
}

let messageContainer: HTMLDivElement | null = null;
let messageId = 0;

const Message: React.FC<MessageProps> = ({ type, content, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // 等待动画完成
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`message message-${type} ${visible ? 'message-enter' : 'message-leave'}`}>
      <span className="message-icon">{getIcon()}</span>
      <span className="message-content">{content}</span>
    </div>
  );
};

// 创建消息容器
const createMessageContainer = () => {
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    document.body.appendChild(messageContainer);
  }
  return messageContainer;
};

// 消息API
const message = {
  success: (content: string, duration?: number) => {
    showMessage('success', content, duration);
  },
  error: (content: string, duration?: number) => {
    showMessage('error', content, duration);
  },
  warning: (content: string, duration?: number) => {
    showMessage('warning', content, duration);
  },
  info: (content: string, duration?: number) => {
    showMessage('info', content, duration);
  }
};

const showMessage = (type: 'success' | 'error' | 'warning' | 'info', content: string, duration = 3000) => {
  const container = createMessageContainer();
  const id = `message-${++messageId}`;
  
  const messageElement = document.createElement('div');
  messageElement.id = id;
  container.appendChild(messageElement);

  const handleClose = () => {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
    // 如果没有消息了，移除容器
    if (container.children.length === 0) {
      container.remove();
      messageContainer = null;
    }
  };

  // 使用React渲染
  import('react-dom/client').then(({ createRoot }) => {
    const root = createRoot(messageElement);
    root.render(
      <Message
        type={type}
        content={content}
        duration={duration}
        onClose={handleClose}
      />
    );
  });
};

export default Message;
export { message };