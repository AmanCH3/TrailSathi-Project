// utils/emailTemplates.js

exports.resetPasswordOtpTemplate = ({ name = 'TrailSathi Explorer', otp }) => {
  const year = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>TrailSathi - Password Reset OTP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        background-color: #f3f4f6;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 0;
      }
      .wrapper {
        width: 100%;
        padding: 24px 0;
      }
      .container {
        max-width: 520px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
        border: 1px solid #e5e7eb;
      }
      .header {
        background: linear-gradient(135deg, #16a34a, #22c55e);
        padding: 20px 24px;
        color: #f9fafb;
        text-align: center;
      }
      .logo {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 0.04em;
      }
      .tagline {
        margin-top: 4px;
        font-size: 13px;
        opacity: 0.9;
      }
      .content {
        padding: 24px 24px 8px 24px;
        color: #111827;
      }
      h1 {
        font-size: 20px;
        margin: 0 0 8px;
      }
      p {
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 10px;
        color: #4b5563;
      }
      .otp-box {
        margin: 20px 0;
        text-align: center;
      }
      .otp-label {
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #6b7280;
        margin-bottom: 6px;
      }
      .otp {
        display: inline-block;
        background-color: #ecfdf3;
        color: #166534;
        padding: 12px 22px;
        border-radius: 999px;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 0.35em;
        border: 1px dashed #22c55e;
      }
      .meta-box {
        background-color: #f9fafb;
        border-radius: 12px;
        padding: 12px 14px;
        margin-top: 4px;
        border: 1px solid #e5e7eb;
      }
      .meta-item {
        font-size: 12px;
        color: #6b7280;
        margin: 2px 0;
      }
      .meta-label {
        font-weight: 600;
        color: #374151;
      }
      .btn-wrapper {
        text-align: center;
        margin: 18px 0 8px;
      }
      .btn {
        display: inline-block;
        padding: 10px 22px;
        border-radius: 999px;
        background-color: #16a34a;
        color: #ffffff !important;
        text-decoration: none;
        font-size: 14px;
        font-weight: 600;
      }
      .btn:hover {
        background-color: #15803d;
      }
      .footnote {
        font-size: 12px;
        color: #9ca3af;
        margin-top: 12px;
        text-align: center;
      }
      .footer {
        padding: 16px 24px 20px 24px;
        text-align: center;
        color: #9ca3af;
        font-size: 11px;
      }
      .footer a {
        color: #16a34a;
        text-decoration: none;
      }
      @media (max-width: 600px) {
        .container {
          margin: 0 16px;
        }
        .otp {
          font-size: 20px;
          letter-spacing: 0.25em;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="logo">TrailSathi</div>
          <div class="tagline">Secure access to your hiking journey</div>
        </div>

        <div class="content">
          <h1>Reset your password</h1>
          <p>Hi ${name},</p>
          <p>
            We received a request to reset the password for your
            <strong>TrailSathi</strong> account. Use the OTP below to complete
            the reset process.
          </p>

          <div class="otp-box">
            <div class="otp-label">Your one-time password</div>
            <div class="otp">${otp}</div>
            <div class="meta-box">
              <p class="meta-item">
                <span class="meta-label">Valid for:</span> 10 minutes
              </p>
              <p class="meta-item">
                <span class="meta-label">For account:</span> This email address
              </p>
            </div>
          </div>

          <div class="btn-wrapper">
            <a class="btn" href="#">Enter this OTP in the TrailSathi app</a>
          </div>

          <p>
            If you didn’t request a password reset, you can safely ignore this email.
            Your account will remain secure and no changes will be made.
          </p>

          <p class="footnote">
            For your security, never share this OTP with anyone — not even TrailSathi
            support or friends.
          </p>
        </div>

        <div class="footer">
          © ${year} TrailSathi. All rights reserved.<br />
          You are receiving this email because a password reset was requested for your account.
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
};
