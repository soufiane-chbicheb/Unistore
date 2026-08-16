import { User, MapPin, Package, Truck, CreditCard, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { Order } from '@/admin/types/ordersTypes';
import { Badge } from '../../../../../components/ui/badge';
import { Button } from '@/components/ui/button';

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, open, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Order #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User size={18} /> Customer Information
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                {order.avatar}
              </div>
              <div>
                <div className="font-medium">{order.customer}</div>
                <div className="text-sm text-muted-foreground">
                  {order.customer.toLowerCase().replace(' ', '.')}@email.com
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} /> Shipping Address
            </h3>
            <div className="text-sm text-muted-foreground">
              <p>123 Fashion Street</p>
              <p>New York, NY 10001</p>
              <p>United States</p>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package size={18} /> Order Items ({order.items})
            </h3>
            <div className="space-y-2">
              {Array.from({ length: order.items }).map((_, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0">
                  <span>Fashion Item {i + 1}</span>
                  <span className="font-medium">${Math.floor(order.total / order.items)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Truck size={18} /> Shipping
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Method:</span> Standard Shipping</div>
                <div><span className="text-muted-foreground">Carrier:</span> FedEx</div>
                <div><span className="text-muted-foreground">Tracking:</span> FDX123456789</div>
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <CreditCard size={18} /> Payment
              </h3>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Method:</span> Credit Card</div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className={order.payment === 'Success' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}>
                    {order.payment}
                  </Badge>
                </div>
                <div><span className="text-muted-foreground">Total:</span> <span className="font-bold">${order.total}</span></div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock size={18} /> Order Timeline
            </h3>
            <div className="flex gap-3">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div className="flex-1 text-sm">
                <div className="font-medium">Order Placed</div>
                <div className="text-muted-foreground">{formatDate(order.date)}</div>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-3">Internal Notes</h3>
            <textarea
              className="w-full p-3 border rounded-lg text-sm resize-none"
              rows={3}
              placeholder="Add internal notes about this order..."
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button type="button">Mark as Shipped</Button>
            <Button type="button" variant="secondary">Mark as Delivered</Button>
            <Button type="button" variant="secondary">Cancel Order</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
