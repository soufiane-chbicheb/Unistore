<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; padding: 20px; color: #333;">

    <h2 style="color: #e74c3c;">⚠️ Job Failed — Needs Attention</h2>

    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f8f8f8;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order ID</td>
            <td style="padding: 10px; border: 1px solid #ddd;">#{{ $order->id }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $order->user->name }}</td>
        </tr>
        <tr style="background: #f8f8f8;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Customer Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ $order->user->email }}</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order Total</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${{ $order->total }}</td>
        </tr>
        <tr style="background: #f8f8f8;">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Failed At</td>
            <td style="padding: 10px; border: 1px solid #ddd;">{{ now() }}</td>
        </tr>
    </table>

    <h3 style="color: #e74c3c;">Error Details:</h3>
    <div style="background: #fff3f3; border-left: 4px solid #e74c3c; padding: 15px; margin: 10px 0;">
        <p style="margin: 0; font-weight: bold;">{{ $exception->getMessage() }}</p>
    </div>

    <div style="background: #f8f8f8; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 12px; color: #666;">
            File: {{ $exception->getFile() }} <br>
            Line: {{ $exception->getLine() }}
        </p>
    </div>

    <h3>What to do:</h3>
    <ol>
        <li>Check the error details above</li>
        <li>Fix the issue</li>
        <li>Run: <code>php artisan queue:retry all</code></li>
    </ol>

</body>
</html>