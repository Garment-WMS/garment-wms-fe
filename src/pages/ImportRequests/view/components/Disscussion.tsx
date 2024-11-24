import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import importRequestSelector from '../../slice/selector';
import { postChatFn } from '@/api/purchase-staff/importRequestApi';
import { ArrowRight, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetProfile } from '@/hooks/useGetProfile';

type Props = {
  onApproval: () => void;
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
const Discussion = (props: Props) => {
  const chat: any = useSelector(importRequestSelector.importRequest);
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const user = useGetProfile();
  console.log(user);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await postChatFn(chat.discussion.id, message);
        toast({
          variant: 'success',
          title: 'Send Message succesffully',
          description: 'Send message to discussion successfully'
        });
        setMessage('');
        props.onApproval();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Send Message unsuccesffully',
          description: 'We are running into some issue!, please be paitent'
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          {chat?.discussion?.chat.map((message: any) => (
            <div key={message.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={message.sender.avatarUrl} alt={message.sender.username} />
                <AvatarFallback>{message.sender.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{message.sender.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm mt-1"> {renderMessage(message.message)}</p>
              </div>
            </div>
          ))}
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
