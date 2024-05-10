import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';
import { useTheme } from 'next-themes';

function FeedbackPopup({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [feedback, setFeedback] = useState('');
  const { theme } = useTheme()

  const handleSubmit = async () => {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: feedback }),
    });
    const data = await response.json();
    if (data.success) {
      toast.success('Cảm ơn bạn đã gửi feedback');
      onClose();
    } else {
      toast.error('Error submitting feedback');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 bg-black bg-opacity-25`} />
        <Dialog.Content className={`fixed bg-${theme === 'dark' ? 'gray-800' : 'white'} p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg shadow-lg`}>
          <Dialog.Title className="text-lg font-bold text-center">
            Phản hồi của bạn là cơ hội để chúng tôi cải tiến!
          </Dialog.Title>
          <Dialog.Close className="absolute top-3 right-3">
            <span className="material-icons-outlined cursor-pointer">close</span>
          </Dialog.Close>
          <div className="mt-4">
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
              Xin vui lòng đánh giá trải nghiệm của bạn với Thoại!
            </label>
            <textarea
              id="feedback"
              rows={5}
              className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Gửi phản hồi của bạn tại đây"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>
          <div className="flex justify-center items-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
            >
              Gửi Phản Hồi
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default FeedbackPopup;
