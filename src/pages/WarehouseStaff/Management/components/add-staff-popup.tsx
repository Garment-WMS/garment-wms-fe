'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/button';
import { StaffDetailsForm } from './staff-details-form';
import { AvatarUpload } from './avatar-upload';
import { ConfirmationDialog } from './confirmation-dialog';
import { createNewAccount, uploadAvatar, uploadAvatarById } from '@/api/account/accountApi';
import { toast } from '@/hooks/use-toast';

export function AddStaffPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [staffDetails, setStaffDetails] = useState<any | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationData, setConfirmationData] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const handleStaffDetailsSubmit = (details: any) => {
    setStaffDetails(details);
    setConfirmationData({
      title: 'Confirm Staff Details',
      description: 'Are you sure you want to proceed with these staff details?'
    });
    setShowConfirmation(true);
  };

  const handleAvatarUpload = async (file: File | Blob) => {
    if (!staffDetails) return;

    setConfirmationData({
      title: 'Confirm Staff Addition',
      description: 'Are you sure you want to add this new staff member with the selected avatar?'
    });
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setShowConfirmation(false);

    if (step === 1 && staffDetails) {
      try {
        const result = await createNewAccount(staffDetails);
        setUser(result.data);
        toast({
          title: 'Account created successfully',
          description: `New staff member ${staffDetails.firstName} ${staffDetails.lastName} has been added.`
        });
        setStep(2);
      } catch (error) {
        toast({
          title: 'Error creating account',
          description: 'There was an error creating the account. Please try again.',
          variant: 'destructive'
        });
        console.error('Error creating account:', error);
      }
    } else if (step === 2) {
      // Avatar upload logic will be handled here
      setOpen(false);
      setStep(1);
      setStaffDetails(null);
    }

    setIsLoading(false);
  };
console.log('us',user);
  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handleAvatarSubmit = async (file: File | Blob) => {
    if (!staffDetails) return;

    setIsLoading(true);
    try {
      const id = user?.user?.id;
      await uploadAvatarById(id,file);
      toast({
        title: 'Avatar uploaded successfully',
        description: "The staff member's avatar has been updated."
      });
      setOpen(false);
      setStep(1);
      setStaffDetails(null);
    } catch (error) {
      toast({
        title: 'Error uploading avatar',
        description: 'There was an error uploading the avatar. Please try again.',
        variant: 'destructive'
      });
      console.error('Error uploading avatar:', error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add New Staff</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{step === 1 ? 'Add New Staff' : 'Upload Avatar'}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                1
              </div>
              <div className={`w-16 h-1 ${step > 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
              <div
                className={`w-8 h-8 rounded-full ${step === 2 ? 'bg-primary' : 'bg-gray-300'} flex items-center justify-center text-white`}>
                2
              </div>
            </div>
          </div>
          {step === 1 ? (
            <StaffDetailsForm onSubmit={handleStaffDetailsSubmit} isLoading={isLoading} />
          ) : (
            <AvatarUpload onUpload={handleAvatarSubmit} isLoading={isLoading} />
          )}
        </DialogContent>
      </Dialog>
      <ConfirmationDialog
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={confirmationData.title}
        description={confirmationData.description}
      />
    </>
  );
}
