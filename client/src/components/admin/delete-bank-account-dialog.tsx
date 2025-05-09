import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BankAccount } from '@shared/schema';

interface DeleteBankAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccount: BankAccount;
  onConfirm: () => Promise<void>;
}

export function DeleteBankAccountDialog({
  open,
  onOpenChange,
  bankAccount,
  onConfirm,
}: DeleteBankAccountDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบบัญชี</AlertDialogTitle>
          <AlertDialogDescription>
            คุณต้องการลบบัญชีธนาคาร {bankAccount.bankName} {bankAccount.accountNumber} ใช่หรือไม่?
            <br />
            การลบบัญชีจะไม่สามารถกู้คืนได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction 
            onClick={async () => {
              try {
                await onConfirm();
              } catch (error) {
                console.error("Error deleting bank account:", error);
              }
            }}
          >
            ยืนยันการลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}