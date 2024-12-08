import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { postChatFn } from '@/api/purchase-staff/importRequestApi';
import { ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetProfile } from '@/hooks/useGetProfile';

type Props = {
  onRender: () => void;
  chat: any;
};

const getInitials = (name: string | undefined): string => {
  if (!name) return 'WM';
  return (
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'WM'
  );
};

const Discussion = ({ chat, onRender }: Props) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const user = useGetProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await postChatFn(chat.id, message);
        toast({
          variant: 'success',
          title: 'Send Message Successfully',
          description: 'Message sent to discussion successfully.'
        });
        setMessage('');
        onRender();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Send Message Unsuccessful',
          description: 'We encountered an issue, please try again later.'
        });
        console.error('Error posting message:', error);
      }
    }
  };

  const renderMessage = (messageText: string) => {
    // Check for status update format: status:oldStatus->newStatus
    const statusMatch = messageText.match(/^status:(.+)->(.+)$/);
    if (statusMatch) {
      const [_, oldStatus, newStatus] = statusMatch;
      return (
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium">{oldStatus}</span>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{newStatus}</span>
          <span className="text-emerald-600 text-xs">(Status)</span>
        </div>
      );
    }

    // Check for system message
    if (messageText.startsWith('system:')) {
      return (
        <p className="text-sm bg-secondary p-3 rounded-lg font-bold">
          {messageText.substring(7).trim()}
        </p>
      );
    }
    return <p className="text-sm bg-secondary p-3 rounded-lg">{messageText}</p>;
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          {chat?.chat?.map((message: any) => {
            const sender = message.sender || { username: 'System', avatarUrl: null };
            return (
              <div key={message.id} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage
                    src={sender.avatarUrl || '/default-avatar.png'}
                    alt={sender.username}
                  />
                  <AvatarFallback>{getInitials(sender.username)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{sender.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // Use 24-hour format
                      })}
                    </span>
                  </div>
                  <div className="text-sm mt-1">{renderMessage(message.message)}</div>
                </div>
              </div>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start space-x-4 justify-center">
            <Avatar>
              <AvatarImage src={user?.avatar} alt="@currentuser" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1"
            />
            <div className="flex justify-end h-full">
              <Button type="submit" className="h-full h-[60px]">
                <Send />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Discussion;
