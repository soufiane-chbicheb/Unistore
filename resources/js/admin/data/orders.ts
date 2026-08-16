import { Order } from "../types/ordersTypes";


export const generateOrders = (): Order[] => [
  { id: 'ER84781', date: '2024-10-01', customer: 'Kristin Watson', avatar: 'KW', items: 2, total: 839, payment: 'Success', delivery: 'N/A', status: 'delivered' },
  { id: 'ER84782', date: '2024-10-02', customer: 'Leslie Alexander', avatar: 'LA', items: 4, total: 374, payment: 'Pending', delivery: 'N/A', status: 'pending' },
  { id: 'ER84783', date: '2024-10-03', customer: 'Guy Hawkins', avatar: 'GH', items: 5, total: 485, payment: 'Success', delivery: 'N/A', status: 'shipped' },
  { id: 'ER84784', date: '2024-10-04', customer: 'Robert Fox', avatar: 'RF', items: 8, total: 824, payment: 'Success', delivery: 'N/A', status: 'processing' },
  { id: 'ER84785', date: '2024-10-05', customer: 'Cody Fisher', avatar: 'CF', items: 2, total: 285, payment: 'Pending', delivery: 'N/A', status: 'pending' },
  { id: 'ER84786', date: '2024-10-06', customer: 'Bessie Cooper', avatar: 'BC', items: 1, total: 537, payment: 'Success', delivery: 'N/A', status: 'delivered' },
  { id: 'ER84787', date: '2024-10-07', customer: 'Albert Flores', avatar: 'AF', items: 5, total: 426, payment: 'Pending', delivery: 'N/A', status: 'cancelled' },
  { id: 'ER84788', date: '2024-10-08', customer: 'Ralph Edwards', avatar: 'RE', items: 1, total: 386, payment: 'Pending', delivery: 'N/A', status: 'pending' },
  { id: 'ER84789', date: '2024-10-09', customer: 'Jenny Wilson', avatar: 'JW', items: 3, total: 657, payment: 'Success', delivery: 'N/A', status: 'returned' },
  { id: 'ER84790', date: '2024-10-10', customer: 'Devon Lane', avatar: 'DL', items: 6, total: 942, payment: 'Success', delivery: 'N/A', status: 'shipped' },
  { id: 'ER84791', date: '2024-10-11', customer: 'Wade Warren', avatar: 'WW', items: 3, total: 562, payment: 'Success', delivery: 'N/A', status: 'delivered' },
  { id: 'ER84792', date: '2024-10-12', customer: 'Esther Howard', avatar: 'EH', items: 7, total: 718, payment: 'Pending', delivery: 'N/A', status: 'processing' },
];
