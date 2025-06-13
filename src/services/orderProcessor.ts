import { getProcessingOrders, updateOrderStatus } from './orderService';

// Auto-complete orders after 5 minutes
export const startOrderProcessor = () => {
  const processOrders = async () => {
    try {
      const processingOrders = await getProcessingOrders();
      
      for (const order of processingOrders) {
        await updateOrderStatus(order.id, 'completed');
        console.log(`Order ${order.id} auto-completed`);
      }
    } catch (error) {
      console.error('Order processor error:', error);
    }
  };

  // Process orders immediately on start
  setTimeout(() => {
    processOrders();
  }, 1000);
  
  // Then check every minute
  setInterval(processOrders, 60000);
};