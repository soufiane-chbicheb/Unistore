import React, { useState } from 'react';
import { Send, Clock, Circle, Check, Mail, User, Archive, Star, Flag, Eye, EyeOff, Trash2, UserPlus } from 'lucide-react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';

const currentTheme = {
  bg: '#ffffff',
  text: '#0f172a',
  buttonPrimary: '#8b5cf6',
  buttonSecondary: '#f1f5f9',
  buttonHover: '#7c3aed',
  accent: '#8b5cf6',
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
};

interface Message {
  id: number;
  sender: string;
  initials: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  time: string;
  fullMessage: string;
  isUnread: boolean;
  isResolved: boolean;
  isFlagged: boolean;
  isArchived: boolean;
  assignedTo: string | null;
  avatarColor: string;
}

// Custom Hook for Message Actions
const useMessageActions = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'Amanda Williams',
      initials: 'AW',
      email: 'amanda.williams@email.com',
      subject: 'Persistent headaches',
      preview: 'Hi Dr. Johnson, I have been experiencing persistent headache...',
      date: 'Nov 24',
      time: '05:45 PM',
      fullMessage: 'Hi Dr. Johnson, I have been experiencing persistent headaches for the past week. They seem to get worse in the afternoon. Should I be concerned?',
      isUnread: true,
      isResolved: false,
      isFlagged: false,
      isArchived: false,
      assignedTo: null,
      avatarColor: '#6B9080'
    },
    {
      id: 2,
      sender: 'John Mitchell',
      initials: 'JM',
      email: 'john.mitchell@email.com',
      subject: 'Blood sugar levels',
      preview: 'Doctor, my glucose readings have been higher than usual this...',
      date: 'Nov 23',
      time: '11:20 AM',
      fullMessage: 'Doctor, my glucose readings have been higher than usual this week. I have been following my diet plan. What should I do?',
      isUnread: false,
      isResolved: false,
      isFlagged: false,
      isArchived: false,
      assignedTo: null,
      avatarColor: '#7BA591'
    },
    {
      id: 3,
      sender: 'Robert Chen',
      initials: 'RC',
      email: 'robert.chen@email.com',
      subject: 'Medication refill request',
      preview: 'Dr. Johnson, I am running low on my Warfarin prescription. C...',
      date: 'Nov 22',
      time: '03:15 PM',
      fullMessage: 'Dr. Johnson, I am running low on my Warfarin prescription. Could you please authorize a refill? I have about 3 days left.',
      isUnread: false,
      isResolved: false,
      isFlagged: false,
      isArchived: false,
      assignedTo: null,
      avatarColor: '#8FA998'
    },
    {
      id: 4,
      sender: 'Patricia Davis',
      initials: 'PD',
      email: 'patricia.davis@email.com',
      subject: 'Joint pain worsening',
      preview: 'Hello Dr. Johnson, my knee pain has been getting worse over ...',
      date: 'Nov 21',
      time: '10:30 AM',
      fullMessage: 'Hello Dr. Johnson, my knee pain has been getting worse over the past few days. The exercises you recommended don\'t seem to be helping anymore.',
      isUnread: true,
      isResolved: false,
      isFlagged: true,
      isArchived: false,
      assignedTo: 'Support Team',
      avatarColor: '#A4BDA8'
    },
    {
      id: 5,
      sender: 'Lisa Anderson',
      initials: 'LA',
      email: 'lisa.anderson@email.com',
      subject: 'Migraine frequency update',
      preview: 'Dr. Johnson, I wanted to update you on my migraine frequen...',
      date: 'Nov 20',
      time: '02:15 PM',
      fullMessage: 'Dr. Johnson, I wanted to update you on my migraine frequency. Since starting the new medication, I have only had one migraine this month compared to four last month.',
      isUnread: false,
      isResolved: true,
      isFlagged: false,
      isArchived: false,
      assignedTo: null,
      avatarColor: '#A8C5B0'
    }
  ]);

  const markAsRead = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isUnread: false } : msg
    ));
  };

  const markAsUnread = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isUnread: true } : msg
    ));
  };

  const markAsResolved = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isResolved: true, isUnread: false } : msg
    ));
  };

  const toggleFlag = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isFlagged: !msg.isFlagged } : msg
    ));
  };

  const archiveMessage = (messageId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: true } : msg
    ));
  };

  const deleteMessage = (messageId: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const assignToTeam = (messageId: number, teamMember: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, assignedTo: teamMember } : msg
    ));
  };

  const sendToEmail = (message: Message) => {
    // Simulate opening email client
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
  };

  const viewCustomerProfile = (message: Message) => {
    // Navigate to customer profile page
    console.log(`Navigating to customer profile: ${message.email}`);
    alert(`Opening customer profile for ${message.sender}`);
  };

  return {
    messages,
    markAsRead,
    markAsUnread,
    markAsResolved,
    toggleFlag,
    archiveMessage,
    deleteMessage,
    assignToTeam,
    sendToEmail,
    viewCustomerProfile
  };
};

export default function MessagesPage() {
  const {
    messages,
    markAsRead,
    markAsUnread,
    markAsResolved,
    toggleFlag,
    archiveMessage,
    deleteMessage,
    assignToTeam,
    sendToEmail,
    viewCustomerProfile
  } = useMessageActions();

  const [selectedMessage, setSelectedMessage] = useState<Message>(messages[2]);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const activeMessages = messages.filter(m => !m.isArchived);
  const unreadCount = activeMessages.filter(m => m.isUnread).length;

  const teamMembers = ['Support Team', 'Technical Team', 'Sales Team', 'Management'];

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.isUnread) {
      markAsRead(message.id);
    }
  };

  const ActionButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    color = currentTheme.text,
    bgColor = currentTheme.buttonSecondary 
  }: any) => (
    <button
      onClick={onClick}
      title={label}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '10px 16px',
        backgroundColor: bgColor,
        color: color,
        border: `1px solid ${currentTheme.border}`,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = currentTheme.borderHover;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = bgColor;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px' 
      }}>
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '700',
          color: currentTheme.text,
          margin: 0
        }}>
          Customer Messages
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Inbox Panel */}
        <div style={{ 
          backgroundColor: currentTheme.bg,
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          height: 'fit-content'
        }}>
          {/* Inbox Header */}
          <div style={{ 
            padding: '24px',
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h2 style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                color: currentTheme.text,
                margin: 0
              }}>
                Inbox
              </h2>
              <span style={{
                backgroundColor: currentTheme.buttonSecondary,
                color: currentTheme.text,
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {unreadCount} unread
              </span>
            </div>
          </div>

          {/* Messages List */}
          <div>
            {activeMessages.length === 0 ? (
              <div style={{ 
                padding: '48px 24px', 
                textAlign: 'center',
                color: '#94a3b8'
              }}>
                <Mail size={48} style={{ margin: '0 auto 16px' }} />
                <p style={{ fontSize: '16px', fontWeight: '500' }}>No messages to display</p>
              </div>
            ) : (
              activeMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${currentTheme.border}`,
                    borderLeft: message.isUnread ? `4px solid #ef4444` : message.isFlagged ? `4px solid #f59e0b` : message.isResolved ? `4px solid #10b981` : '4px solid transparent',
                    cursor: 'pointer',
                    backgroundColor: selectedMessage.id === message.id ? '#faf5ff' : currentTheme.bg,
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedMessage.id !== message.id) {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMessage.id !== message.id) {
                      e.currentTarget.style.backgroundColor = currentTheme.bg;
                    }
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: message.avatarColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '600',
                      flexShrink: 0,
                      position: 'relative'
                    }}>
                      {message.initials}
                      {message.isFlagged && (
                        <div style={{
                          position: 'absolute',
                          top: '-4px',
                          right: '-4px',
                          backgroundColor: '#f59e0b',
                          borderRadius: '50%',
                          padding: '4px',
                          border: '2px solid white'
                        }}>
                          <Star size={10} fill="#f59e0b" />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '4px'
                      }}>
                        <h3 style={{
                          fontSize: '15px',
                          fontWeight: message.isUnread ? '700' : '600',
                          color: currentTheme.text,
                          margin: 0
                        }}>
                          {message.sender}
                          {message.isResolved && (
                            <Check size={14} color="#10b981" style={{ marginLeft: '6px', display: 'inline' }} />
                          )}
                        </h3>
                        {message.isUnread && (
                          <Circle size={10} fill="#ef4444" color="#ef4444" />
                        )}
                      </div>
                      
                      <p style={{
                        fontSize: '14px',
                        fontWeight: message.isUnread ? '700' : '600',
                        color: currentTheme.text,
                        margin: '0 0 4px 0'
                      }}>
                        {message.subject}
                      </p>
                      
                      <p style={{
                        fontSize: '14px',
                        color: '#64748b',
                        margin: '0 0 8px 0',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {message.preview}
                      </p>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        fontSize: '13px'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: '#94a3b8'
                        }}>
                          <Clock size={14} />
                          <span>{message.date}, {message.time}</span>
                        </div>
                        {message.assignedTo && (
                          <span style={{
                            backgroundColor: currentTheme.accent,
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {message.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details Panel */}
        <div style={{ 
          backgroundColor: currentTheme.bg,
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          height: 'fit-content'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '24px',
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: '700',
              color: currentTheme.text,
              margin: 0
            }}>
              Message Details
            </h2>
          </div>

          {/* Sender Info */}
          <div style={{ 
            padding: '24px',
            borderBottom: `1px solid ${currentTheme.border}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: selectedMessage.avatarColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {selectedMessage.initials}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: currentTheme.text,
                    margin: '0 0 4px 0'
                  }}>
                    {selectedMessage.sender}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {selectedMessage.email}
                  </p>
                </div>
              </div>

              {/* Status Badges */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {selectedMessage.isResolved && (
                  <span style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Check size={14} />
                    Resolved
                  </span>
                )}
                {selectedMessage.isFlagged && (
                  <span style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Flag size={14} />
                    Flagged
                  </span>
                )}
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedMessage.isUnread ? (
                <ActionButton 
                  icon={Eye} 
                  label="Mark as Read" 
                  onClick={() => markAsRead(selectedMessage.id)}
                />
              ) : (
                <ActionButton 
                  icon={EyeOff} 
                  label="Mark as Unread" 
                  onClick={() => markAsUnread(selectedMessage.id)}
                />
              )}
              
              {!selectedMessage.isResolved && (
                <ActionButton 
                  icon={Check} 
                  label="Mark as Resolved" 
                  onClick={() => markAsResolved(selectedMessage.id)}
                  color="#10b981"
                />
              )}
              
              <ActionButton 
                icon={selectedMessage.isFlagged ? Star : Flag} 
                label={selectedMessage.isFlagged ? "Unflag" : "Flag Important"} 
                onClick={() => toggleFlag(selectedMessage.id)}
                color="#f59e0b"
              />
              
              <ActionButton 
                icon={Mail} 
                label="Send to Email" 
                onClick={() => sendToEmail(selectedMessage)}
                color={currentTheme.accent}
              />
              
              <ActionButton 
                icon={User} 
                label="View Customer" 
                onClick={() => viewCustomerProfile(selectedMessage)}
              />
              
              <div style={{ position: 'relative' }}>
                <ActionButton 
                  icon={UserPlus} 
                  label={selectedMessage.assignedTo || "Assign to Team"} 
                  onClick={() => setShowAssignMenu(!showAssignMenu)}
                />
                
                {showAssignMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: currentTheme.bg,
                    border: `1px solid ${currentTheme.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    minWidth: '180px'
                  }}>
                    {teamMembers.map((team) => (
                      <button
                        key={team}
                        onClick={() => {
                          assignToTeam(selectedMessage.id, team);
                          setShowAssignMenu(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          border: 'none',
                          backgroundColor: currentTheme.bg,
                          color: currentTheme.text,
                          cursor: 'pointer',
                          fontSize: '14px',
                          borderBottom: `1px solid ${currentTheme.border}`
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.buttonSecondary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentTheme.bg}
                      >
                        {team}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <ActionButton 
                icon={Archive} 
                label="Archive" 
                onClick={() => {
                  archiveMessage(selectedMessage.id);
                  setSelectedMessage(activeMessages[0]);
                }}
              />
              
              <ActionButton 
                icon={Trash2} 
                label="Delete" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this message?')) {
                    deleteMessage(selectedMessage.id);
                    setSelectedMessage(activeMessages[0]);
                  }
                }}
                color="#ef4444"
              />
            </div>
          </div>

          {/* Subject and Date */}
          <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500',
                display: 'block',
                marginBottom: '8px'
              }}>
                Subject
              </label>
              <p style={{
                fontSize: '16px',
                fontWeight: '600',
                color: currentTheme.text,
                margin: 0
              }}>
                {selectedMessage.subject}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                fontSize: '13px',
                color: '#64748b',
                fontWeight: '500',
                display: 'block',
                marginBottom: '8px'
              }}>
                Date
              </label>
              <p style={{
                fontSize: '16px',
                color: currentTheme.text,
                margin: 0
              }}>
                {selectedMessage.date}, {selectedMessage.time}
              </p>
            </div>

            {/* Message Body */}
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: currentTheme.text,
                margin: 0
              }}>
                {selectedMessage.fullMessage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


MessagesPage.layout = (page: any) => <AdminLayout children={page} />
