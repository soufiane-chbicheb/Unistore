<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Received - #{{ $order->order_number }}</title>
    <style>
        body { font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
        .wrapper { width: 100%; padding: 40px 0; }
        .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
        .header { background: #111827; color: white; padding: 40px 32px; text-align: left; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header .badge { display: inline-block; background: #4f46e5; color: white; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; margin-top: 10px; text-transform: uppercase; }
        .content { padding: 32px; }
        .admin-note { background-color: #fefce8; border-left: 4px solid #eab308; padding: 16px; margin-bottom: 24px; border-radius: 0 8px 8px 0; font-size: 14px; color: #854d0e; }
        .section-title { font-size: 16px; font-weight: 700; text-transform: uppercase; color: #6b7280; margin-bottom: 12px; letter-spacing: 0.05em; border-bottom: 1px solid #f3f4f6; padding-bottom: 8px; }
        .order-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .summary-item { margin-bottom: 16px; }
        .label { font-size: 12px; color: #9ca3af; font-weight: 600; margin-bottom: 4px; }
        .value { font-size: 15px; font-weight: 700; color: #111827; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
        .items-table th { text-align: left; font-size: 12px; color: #9ca3af; text-transform: uppercase; padding-bottom: 12px; border-bottom: 1px solid #f3f4f6; }
        .items-table td { padding: 12px 0; border-bottom: 1px solid #f9fafb; vertical-align: top; }
        .total-section { margin-top: 24px; border-top: 2px solid #f3f4f6; padding-top: 16px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .grand-total { font-size: 20px; font-weight: 800; color: #4f46e5; margin-top: 8px; }
        .address-box { background: #f9fafb; padding: 20px; border-radius: 12px; margin-bottom: 24px; }
        .btn-wrapper { text-align: center; margin-top: 32px; }
        .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; padding: 14px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; }
        .footer { text-align: center; padding: 32px; color: #9ca3af; font-size: 12px; border-top: 1px solid #f3f4f6; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <h1>NEW ORDER RECEIVED</h1>
                <div class="badge">Awaiting Fulfillment</div>
            </div>

            <div class="content">
                <div class="admin-note">
                    <strong>Admin Notification:</strong> A new order has been placed on the store. Please review the details below and proceed with fulfillment in the admin panel.
                </div>

                <div class="order-summary">
                    <div class="summary-item">
                        <div class="label">Order Number</div>
                        <div class="value">#{{ $order->order_number }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Date & Time</div>
                        <div class="value">{{ $order->created_at->format('M d, Y H:i') }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Customer</div>
                        <div class="value">{{ $order->address->first_name }} {{ $order->address->last_name }}</div>
                    </div>
                    <div class="summary-item">
                        <div class="label">Payment Method</div>
                        <div class="value">{{ ucfirst($order->payment_method ?? 'N/A') }}</div>
                    </div>
                </div>

                <h2 class="section-title">Order Items</h2>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($order->items as $item)
                        <tr>
                            <td>
                                <div class="value">{{ $item->productVariant->product->name ?? 'Unknown Product' }}</div>
                                <div style="font-size: 12px; color: #6b7280;">{{ $item->productVariant->name ?? '' }}</div>
                            </td>
                            <td style="text-align: center;">{{ $item->quantity }}</td>
                            <td style="text-align: right;">{{ $order->currency }} {{ number_format($item->price, 2) }}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>

                <div style="display: table; width: 100%;">
                    <div style="display: table-cell; width: 55%; vertical-align: top; padding-right: 20px;">
                        <h2 class="section-title">Shipping Address</h2>
                        <div class="address-box">
                            <p style="margin: 0; font-size: 14px;">
                                <strong>{{ $order->address->first_name }} {{ $order->address->last_name }}</strong><br>
                                {{ $order->address->address_line1 }}<br>
                                {{ $order->address->city }}, {{ $order->address->state }} {{ $order->address->postal_code }}<br>
                                {{ $order->address->country }}<br><br>
                                <strong>Email:</strong> {{ $order->address->email }}<br>
                                <strong>Phone:</strong> {{ $order->address->phone }}
                            </p>
                        </div>
                    </div>
                    <div style="display: table-cell; width: 45%; vertical-align: top;">
                        <h2 class="section-title">Totals</h2>
                        <div class="total-section">
                            <div class="total-row">
                                <span>Subtotal</span>
                                <span>{{ $order->currency }} {{ number_format($order->total_amount - $order->shipping_cost - $order->tax + $order->discount_amount, 2) }}</span>
                            </div>
                            <div class="total-row">
                                <span>Shipping</span>
                                <span>{{ $order->currency }} {{ number_format($order->shipping_cost, 2) }}</span>
                            </div>
                            <div class="total-row">
                                <span>Tax</span>
                                <span>{{ $order->currency }} {{ number_format($order->tax, 2) }}</span>
                            </div>
                            @if($order->discount_amount > 0)
                            <div class="total-row" style="color: #059669;">
                                <span>Discount</span>
                                <span>-{{ $order->currency }} {{ number_format($order->discount_amount, 2) }}</span>
                            </div>
                            @endif
                            <div class="total-row grand-total">
                                <span>Total</span>
                                <span>{{ $order->currency }} {{ number_format($order->total_amount, 2) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="btn-wrapper">
                    <a href="{{ config('app.url') }}/admin/orders/{{ $order->id }}" class="btn">Process Order in Dashboard</a>
                </div>
            </div>

            <div class="footer">
                This is an automated notification from your store: <strong>{{ config('app.name') }}</strong>
            </div>
        </div>
    </div>
</body>
</html>
