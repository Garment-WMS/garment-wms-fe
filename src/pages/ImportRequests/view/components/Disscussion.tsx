import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import React from 'react';
import CommentComponent from './CommentComponent';

type Props = {};

const Disscussion = (props: Props) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border-2 p-4">
      <div className="font-primary text-xl font-bold ">Disscussion</div>
      <form className="mb-6">
        <div className="py-4 px-4 mb-4 bg-white rounded-lg rounded-t-lg dark:bg-gray-800 dark:border-gray-700">
          <label className="sr-only">Your comment</label>
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Textarea
              id="comment"
              rows={6}
              className="px-0 w-full text-sm text-gray-900 p-2"
              placeholder="Write a comment..."
              required></Textarea>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-bluePrimary rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:opacity-20">
            Post comment
          </button>
        </div>
      </form>
      <CommentComponent />
    </div>
  );
};

export default Disscussion;
