import os
import logging
from mailjet_rest import Client

logger = logging.getLogger("mail_service")

# Updated for verified domain integration
MAILJET_API_KEY = "4ef03274bf0ad6341318df9db8937d74"
MAILJET_API_SECRET = "cb7ab62d8b547b994bebaec4a35b96d0"
SENDER_EMAIL = "no-reply@aurocode.in"

class MailService:
    def __init__(self):
        self.client = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')

    def send_otp_email(self, to_email: str, otp: str):
        """Send an OTP email using a nice HTML template."""
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #0056b3; text-align: center;">RouteAura - Your Verification Code</h2>
            <p style="font-size: 16px; color: #333333;">Hello,</p>
            <p style="font-size: 16px; color: #333333;">Please use the verification code below to securely access your account:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; padding: 15px 30px; font-size: 24px; font-weight: bold; color: #ffffff; background-color: #0056b3; border-radius: 5px; letter-spacing: 5px;">
                    {otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #777777;">This code is valid for 5 minutes. If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">&copy; 2026 RouteAura Travel Assistant. All rights reserved.</p>
        </div>
        """
        
        data = {
            'Messages': [
                {
                    "From": {
                        "Email": SENDER_EMAIL,
                        "Name": "RouteAura"
                    },
                    "To": [
                        {
                            "Email": to_email,
                            "Name": "Customer"
                        }
                    ],
                    "Subject": "Your RouteAura Verification Code",
                    "HTMLPart": html_content
                }
            ]
        }
        
        try:
            result = self.client.send.create(data=data)
            logger.info(f"OTP email sent to {to_email}. Status: {result.status_code}")
            return result.status_code == 200
        except Exception as e:
            logger.error(f"Failed to send OTP email to {to_email}: {e}")
            return False

    def send_booking_update_email(self, to_email: str, guest_name: str, package_title: str, status: str, notes: str):
        """Send an email notification when a booking is updated."""
        
        status_color = "#28a745" if status.lower() == "confirmed" else "#dc3545" if status.lower() in ["denied", "cancelled"] else "#ffc107"
        
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #0056b3; text-align: center;">RouteAura Booking Update</h2>
            <p style="font-size: 16px; color: #333333;">Hello {guest_name},</p>
            <p style="font-size: 16px; color: #333333;">There has been an update to your booking for <strong>{package_title}</strong>.</p>
            
            <div style="margin: 20px 0; padding: 15px; border-left: 4px solid {status_color}; background-color: #f9f9f9;">
                <p style="margin: 0; font-size: 16px;"><strong>Current Status:</strong> <span style="color: {status_color};">{status}</span></p>
            </div>
            """
        
        if notes:
            html_content += f"""
            <div style="margin: 20px 0;">
                <p style="font-size: 15px; color: #555;"><strong>Message from our team:</strong></p>
                <p style="font-size: 14px; color: #333; padding: 10px; background-color: #f1f1f1; border-radius: 5px;">{notes}</p>
            </div>
            """
            
        html_content += """
            <p style="font-size: 14px; color: #777777;">If you have any questions, please reply to this email.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #aaaaaa; text-align: center;">&copy; 2026 RouteAura Travel Assistant. All rights reserved.</p>
        </div>
        """
        
        data = {
            'Messages': [
                {
                    "From": {
                        "Email": SENDER_EMAIL,
                        "Name": "RouteAura Team"
                    },
                    "To": [
                        {
                            "Email": to_email,
                            "Name": guest_name
                        }
                    ],
                    "Subject": f"Update on your booking: {package_title}",
                    "HTMLPart": html_content
                }
            ]
        }
        
        try:
            result = self.client.send.create(data=data)
            logger.info(f"Booking update email sent to {to_email}. Status: {result.status_code}")
            return result.status_code == 200
        except Exception as e:
            logger.error(f"Failed to send booking update email to {to_email}: {e}")
            return False

mail_service = MailService()
