<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            max-width: 500px;
            width: 100%;
            padding: 48px 40px;
            text-align: center;
            animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
        }

        .icon.success {
            background: #d4edda;
            color: #28a745;
        }

        .icon.error {
            background: #f8d7da;
            color: #dc3545;
        }

        .icon.warning {
            background: #fff3cd;
            color: #ffc107;
        }

        h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #1a202c;
        }

        .message {
            font-size: 16px;
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .btn {
            display: inline-block;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
            border: none;
            outline: none;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
            margin-left: 12px;
        }

        .btn-secondary:hover {
            background: #cbd5e0;
        }

        .footer {
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e2e8f0;
            font-size: 14px;
            color: #718096;
        }

        .footer a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .container {
                padding: 32px 24px;
            }

            h1 {
                font-size: 24px;
            }

            .btn {
                padding: 12px 24px;
                font-size: 14px;
            }

            .btn-secondary {
                margin-left: 0;
                margin-top: 12px;
                display: block;
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        @if($status === 'success')
            <div class="icon success">
                ✓
            </div>
            <h1>Email Verified Successfully!</h1>
            <p class="message">
                Your email has been verified successfully. You can now access all features of your account.
            </p>
            <a href="{{ config('app.frontend_url') }}/login" class="btn btn-primary">
                Go to Login
            </a>
        @elseif($status === 'already_verified')
            <div class="icon warning">
                ℹ
            </div>
            <h1>Already Verified</h1>
            <p class="message">
                Your email has already been verified. You can proceed to login.
            </p>
            <a href="{{ config('app.frontend_url') }}/login" class="btn btn-primary">
                Go to Login
            </a>
        @else
            <div class="icon error">
                ✕
            </div>
            <h1>Verification Failed</h1>
            <p class="message">
                {{ $message ?? 'The verification link is invalid or has expired. Please request a new verification email.' }}
            </p>
            <a href="{{ config('app.frontend_url') }}/login" class="btn btn-primary">
                Go to Login
            </a>
            <a href="{{ config('app.frontend_url') }}/register" class="btn btn-secondary">
                Register Again
            </a>
        @endif

        <div class="footer">
            Need help? <a href="{{ config('app.frontend_url') }}/contact">Contact Support</a>
        </div>
    </div>
</body>
</html>
