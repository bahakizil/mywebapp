import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmailTemplate: React.FC<Readonly<ContactEmailProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔔 New Contact Form Submission</h2>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
        <h3 style={{ color: '#6366f1', marginTop: '0' }}>Contact Details</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> <a href={`mailto:${email}`} style={{ color: '#6366f1' }}>{email}</a></p>
        <p><strong>Subject:</strong> {subject}</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px' }}>
        <h3 style={{ color: '#6366f1', marginTop: '0' }}>Message</h3>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '4px',
          borderLeft: '4px solid #6366f1',
          fontStyle: 'italic'
        }}>
          {message}
        </div>
      </div>

      <div style={{ 
        textAlign: 'center', 
        fontSize: '14px', 
        color: '#666',
        borderTop: '1px solid #e5e7eb',
        paddingTop: '20px'
      }}>
        <p>This message was sent from your portfolio contact form.</p>
        <p>
          <a href={`mailto:${email}?subject=Re: ${subject}`} 
             style={{ 
               textDecoration: 'none',
               backgroundColor: '#6366f1',
               color: 'white',
               padding: '8px 16px',
               borderRadius: '4px',
               display: 'inline-block'
             }}>
            Reply to {name}
          </a>
        </p>
      </div>
    </div>
  </div>
); 