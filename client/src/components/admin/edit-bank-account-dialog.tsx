import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { BankAccount } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// สร้าง schema สำหรับการแก้ไขบัญชีธนาคาร
const bankAccountSchema = z.object({
  bankName: z.string().min(1, "กรุณาระบุชื่อธนาคาร"),
  accountNumber: z.string()
    .min(10, "เลขที่บัญชีต้องมีอย่างน้อย 10 หลัก")
    .max(15, "เลขที่บัญชีต้องไม่เกิน 15 หลัก")
    .regex(/^\d+$/, "เลขที่บัญชีต้องเป็นตัวเลขเท่านั้น"),
  accountName: z.string().min(1, "กรุณาระบุชื่อบัญชี"),
});

// กำหนด props ที่จะรับเข้า component
type EditBankAccountDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bankAccount: BankAccount;
  onSuccess: (updatedAccount: BankAccount) => void;
  isAdmin?: boolean;
};

export function EditBankAccountDialog({
  open,
  onOpenChange,
  bankAccount,
  onSuccess,
  isAdmin = true,
}: EditBankAccountDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // สร้าง form ด้วย react-hook-form พร้อมกับ validation ด้วย zod
  const form = useForm<z.infer<typeof bankAccountSchema>>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountName: bankAccount.accountName,
    },
  });

  // ฟังก์ชันสำหรับจัดการการ submit form
  const onSubmit = async (values: z.infer<typeof bankAccountSchema>) => {
    setIsSubmitting(true);
    
    try {
      // ใช้ API endpoint ที่แตกต่างกันระหว่าง admin และผู้ใช้ทั่วไป
      const endpoint = isAdmin 
        ? `/api/admin/bank-accounts/${bankAccount.id}`
        : `/api/bank-accounts/${bankAccount.id}`;
      
      const res = await apiRequest("PATCH", endpoint, values);
      const updatedAccount = await res.json();
      
      onSuccess(updatedAccount);
      onOpenChange(false);
      
      toast({
        title: "แก้ไขบัญชีธนาคารสำเร็จ",
        description: "ข้อมูลบัญชีธนาคารได้รับการแก้ไขเรียบร้อยแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขบัญชีธนาคารได้",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>แก้ไขบัญชีธนาคาร</DialogTitle>
          <DialogDescription>
            แก้ไขข้อมูลบัญชีธนาคารสำหรับการถอนเงิน
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ธนาคาร</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ชื่อธนาคาร" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เลขที่บัญชี</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="เลขที่บัญชี" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อบัญชี</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ชื่อบัญชี" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    กำลังบันทึก...
                  </>
                ) : (
                  "บันทึก"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}