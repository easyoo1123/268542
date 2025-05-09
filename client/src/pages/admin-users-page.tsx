import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, BankAccount } from "@shared/schema";
import { DesktopContainer } from "@/components/layout/desktop-container";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatShortDate } from "@/lib/formatters";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EditBankAccountDialog } from "@/components/admin/edit-bank-account-dialog";
import { DeleteBankAccountDialog } from "@/components/admin/delete-bank-account-dialog";
import {
  Search,
  Bell,
  Users,
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  Shield,
  RefreshCw,
  FilePenLine,
  CreditCard,
  Loader2,
  Pencil,
  Check
} from "lucide-react";

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditUserDialog, setShowEditUserDialog] = useState(false);
  const [showBankAccountsDialog, setShowBankAccountsDialog] = useState(false);
  const [showEditBankAccountDialog, setShowEditBankAccountDialog] = useState(false);
  const [showDeleteBankAccountDialog, setShowDeleteBankAccountDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
  const [userBankAccounts, setUserBankAccounts] = useState<BankAccount[]>([]);
  const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
  
  // Fetch users
  const { data: users, isLoading: loadingUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Filter users based on search query
  const filteredUsers = users?.filter(user => {
    if (!searchQuery) return true;
    
    return (
      user.id.toString().includes(searchQuery) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  // User table columns
  const userColumns = [
    {
      key: 'id',
      header: 'ID',
      width: '70px',
      cell: (user: User) => <span>{user.id}</span>,
    },
    {
      key: 'fullName',
      header: 'ชื่อผู้ใช้',
      cell: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{user.fullName}</div>
            <div className="text-xs text-muted-foreground">@{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'อีเมล',
    },
    {
      key: 'balance',
      header: 'ยอดเงิน',
      cell: (user: User) => (
        <div className="font-medium">
          {formatCurrency(parseFloat(user.balance || "0"))}
        </div>
      ),
    },
    {
      key: 'role',
      header: 'บทบาท',
      cell: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
          {user.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      header: 'วันที่สมัคร',
      cell: (user: User) => formatShortDate(user.createdAt),
    },
    {
      key: 'actions',
      header: 'จัดการ',
      cell: (user: User) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => {
              setSelectedUser(user);
              setShowEditUserDialog(true);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            แก้ไข
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            onClick={async () => {
              setSelectedUser(user);
              setIsLoadingBankAccounts(true);
              setShowBankAccountsDialog(true);
              
              try {
                const res = await apiRequest('GET', `/api/admin/users/${user.id}/bank-accounts`);
                const accounts = await res.json();
                setUserBankAccounts(accounts);
              } catch (error) {
                toast({
                  title: "เกิดข้อผิดพลาด",
                  description: "ไม่สามารถโหลดข้อมูลบัญชีธนาคารได้",
                  variant: "destructive",
                });
              } finally {
                setIsLoadingBankAccounts(false);
              }
            }}
          >
            <CreditCard className="h-4 w-4 mr-1" />
            บัญชีธนาคาร
          </Button>
          
          {user.role !== 'admin' && (
            <Button 
              size="sm" 
              variant="ghost"
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              ระงับ
            </Button>
          )}
        </div>
      ),
    },
  ] as const;

  const handleChangeRole = (userId: number, newRole: 'user' | 'admin') => {
    // Implement this functionality if needed
    toast({
      title: "การเปลี่ยนแปลงบทบาท",
      description: `เปลี่ยนบทบาทของผู้ใช้ ID ${userId} เป็น ${newRole} เรียบร้อยแล้ว`,
    });
  };

  return (
    <DesktopContainer>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="border-b border-border h-16 bg-card">
            <div className="flex items-center justify-between h-full px-6">
              <h1 className="text-2xl font-bold">จัดการผู้ใช้งาน</h1>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="search"
                    placeholder="ค้นหาผู้ใช้..."
                    className="w-64 pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                </div>
                
                <Button size="icon" variant="ghost">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <div className="h-8 w-px bg-border mx-1" />
                
                <ThemeToggle />
              </div>
            </div>
          </header>
          
          {/* Main Content Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-background">
            {/* Page Header with Action Buttons */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">รายชื่อผู้ใช้ทั้งหมด</h2>
                <p className="text-muted-foreground">จัดการผู้ใช้งานทั้งหมดในระบบ</p>
              </div>
              
              <div className="flex space-x-3">
                <Button variant="outline" className="h-9">
                  <FilePenLine className="h-4 w-4 mr-2" />
                  ส่งออกข้อมูล
                </Button>
                <Button className="h-9" onClick={() => setShowAddUserDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  เพิ่มผู้ใช้ใหม่
                </Button>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                      <h3 className="text-2xl font-bold mt-1">{users?.length || 0}</h3>
                      <p className="text-xs text-[hsl(var(--chart-1))] mt-1">
                        ทั้งหมดในระบบ
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">แอดมิน</p>
                      <h3 className="text-2xl font-bold mt-1">{users?.filter(u => u.role === 'admin').length || 0}</h3>
                      <p className="text-xs text-amber-500 mt-1">
                        <ShieldAlert className="h-3 w-3 inline mr-1" />
                        ผู้ดูแลระบบ
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-500/10">
                      <ShieldAlert className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั่วไป</p>
                      <h3 className="text-2xl font-bold mt-1">{users?.filter(u => u.role === 'user').length || 0}</h3>
                      <p className="text-xs text-blue-500 mt-1">
                        <Shield className="h-3 w-3 inline mr-1" />
                        สมาชิกปกติ
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-500/10">
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Users Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>รายชื่อผู้ใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={userColumns as any}
                  data={filteredUsers}
                  isLoading={loadingUsers}
                  emptyMessage="ไม่พบผู้ใช้งาน"
                />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
      
      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้ใหม่ในระบบ
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            const userData = {
              username: formData.get('username') as string,
              email: formData.get('email') as string,
              fullName: formData.get('fullName') as string,
              password: formData.get('password') as string,
              role: formData.get('role') as string
            };
            
            // ตรวจสอบว่ากรอกข้อมูลครบหรือไม่
            if (!userData.username || !userData.email || !userData.fullName || !userData.password) {
              toast({
                title: "กรุณากรอกข้อมูลให้ครบ",
                description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
                variant: "destructive"
              });
              return;
            }
            
            try {
              // ส่งข้อมูลไปยัง API
              const response = await apiRequest('POST', '/api/admin/users', userData);
              const result = await response.json();
              
              // ปิด dialog และแสดงข้อความสำเร็จ
              setShowAddUserDialog(false);
              
              // รีเฟรชข้อมูลผู้ใช้
              queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
              
              toast({
                title: "เพิ่มผู้ใช้สำเร็จ",
                description: `เพิ่มผู้ใช้ ${result.fullName} เรียบร้อยแล้ว`,
              });
              
              // รีเซ็ตฟอร์ม
              form.reset();
            } catch (error: any) {
              console.error("Error creating user:", error);
              toast({
                title: "เกิดข้อผิดพลาด",
                description: error.message || "ไม่สามารถเพิ่มผู้ใช้ได้ กรุณาลองใหม่อีกครั้ง",
                variant: "destructive"
              });
            }
          }}>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input id="username" name="username" placeholder="username" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" name="email" placeholder="email@example.com" type="email" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                <Input id="fullName" name="fullName" placeholder="ชื่อ นามสกุล" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input id="password" name="password" placeholder="รหัสผ่าน" type="password" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">บทบาท</Label>
                <select id="role" name="role" className="w-full h-10 px-3 rounded-md border border-input bg-background">
                  <option value="user">ผู้ใช้ทั่วไป</option>
                  <option value="admin">แอดมิน</option>
                </select>
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddUserDialog(false)}>ยกเลิก</Button>
              <Button type="submit">เพิ่มผู้ใช้</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Bank Accounts Dialog */}
      {selectedUser && (
        <Dialog open={showBankAccountsDialog} onOpenChange={setShowBankAccountsDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>บัญชีธนาคารของผู้ใช้</DialogTitle>
              <DialogDescription>
                จัดการบัญชีธนาคารของ {selectedUser.fullName} (@{selectedUser.username})
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {isLoadingBankAccounts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : userBankAccounts.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">ผู้ใช้ยังไม่มีบัญชีธนาคารที่บันทึกไว้</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBankAccounts.map((account) => (
                    <div 
                      key={account.id}
                      className={`p-3 border rounded-lg ${account.isDefault ? 'border-primary' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium flex items-center">
                            {account.bankName}
                            {account.isDefault && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                บัญชีหลัก
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {account.accountNumber}
                          </div>
                          <div className="text-sm">
                            {account.accountName}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!account.isDefault && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={async () => {
                                try {
                                  await apiRequest("PATCH", `/api/admin/bank-accounts/${account.id}`, {
                                    isDefault: true
                                  });
                                  
                                  // อัปเดตข้อมูลในแอป
                                  const updatedAccounts = userBankAccounts.map(acc => ({
                                    ...acc,
                                    isDefault: acc.id === account.id
                                  }));
                                  setUserBankAccounts(updatedAccounts);
                                  
                                  toast({
                                    title: "ตั้งค่าบัญชีหลักสำเร็จ",
                                    description: "บัญชีธนาคารได้ถูกตั้งเป็นบัญชีหลักเรียบร้อยแล้ว",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "เกิดข้อผิดพลาด",
                                    description: "ไม่สามารถตั้งค่าบัญชีหลักได้",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              title="ตั้งเป็นบัญชีหลัก"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedBankAccount(account);
                              setShowEditBankAccountDialog(true);
                            }}
                            title="แก้ไขบัญชี"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setSelectedBankAccount(account);
                              setShowDeleteBankAccountDialog(true);
                            }}
                            title="ลบบัญชี"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowBankAccountsDialog(false)}
              >
                ปิด
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Edit Bank Account Dialog */}
      {selectedBankAccount && (
        <EditBankAccountDialog
          open={showEditBankAccountDialog}
          onOpenChange={setShowEditBankAccountDialog}
          bankAccount={selectedBankAccount}
          onSuccess={(updatedAccount) => {
            // อัปเดตข้อมูลในแอป
            const updatedAccounts = userBankAccounts.map(acc => 
              acc.id === updatedAccount.id ? updatedAccount : acc
            );
            setUserBankAccounts(updatedAccounts);
          }}
        />
      )}
      
      {/* Delete Bank Account Dialog */}
      {selectedBankAccount && (
        <DeleteBankAccountDialog
          open={showDeleteBankAccountDialog}
          onOpenChange={setShowDeleteBankAccountDialog}
          bankAccount={selectedBankAccount}
          onConfirm={async () => {
            try {
              await apiRequest("DELETE", `/api/admin/bank-accounts/${selectedBankAccount.id}`);
              
              // อัปเดตข้อมูลในแอป
              setUserBankAccounts(userBankAccounts.filter(acc => acc.id !== selectedBankAccount.id));
              
              toast({
                title: "ลบบัญชีธนาคารสำเร็จ",
                description: "บัญชีธนาคารได้ถูกลบเรียบร้อยแล้ว",
              });
              
              setShowDeleteBankAccountDialog(false);
            } catch (error) {
              toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถลบบัญชีธนาคารได้",
                variant: "destructive",
              });
            }
          }}
        />
      )}
      
      {/* Edit User Dialog */}
      {selectedUser && (
        <Dialog open={showEditUserDialog} onOpenChange={setShowEditUserDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
              <DialogDescription>
                แก้ไขข้อมูลของ {selectedUser.fullName} (@{selectedUser.username})
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-email">อีเมล</Label>
                <Input id="edit-email" defaultValue={selectedUser.email} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">ชื่อ-นามสกุล</Label>
                <Input id="edit-fullName" defaultValue={selectedUser.fullName} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">บทบาท</Label>
                <select
                  id="edit-role"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  defaultValue={selectedUser.role}
                >
                  <option value="user">ผู้ใช้ทั่วไป</option>
                  <option value="admin">แอดมิน</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-balance">ยอดเงิน</Label>
                <Input
                  id="edit-balance"
                  defaultValue={selectedUser.balance}
                  type="number"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-password">รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)</Label>
                <Input id="edit-password" type="password" placeholder="รหัสผ่านใหม่" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditUserDialog(false)}>ยกเลิก</Button>
              <Button 
                onClick={() => {
                  // ดึงค่าจาก input
                  const email = (document.getElementById('edit-email') as HTMLInputElement)?.value;
                  const fullName = (document.getElementById('edit-fullName') as HTMLInputElement)?.value;
                  const role = (document.getElementById('edit-role') as HTMLSelectElement)?.value;
                  const balance = (document.getElementById('edit-balance') as HTMLInputElement)?.value;
                  const password = (document.getElementById('edit-password') as HTMLInputElement)?.value;

                  // สร้างข้อมูลสำหรับการอัพเดท
                  const updateData: any = {
                    email,
                    fullName,
                    role,
                    balance
                  };

                  // ถ้ากรอกรหัสผ่านใหม่ ให้รวมไปด้วย
                  if (password) {
                    updateData.password = password;
                  }

                  // ส่งคำขอไปยัง API
                  apiRequest('PATCH', `/api/admin/users/${selectedUser.id}`, updateData)
                    .then(res => res.json())
                    .then(updatedUser => {
                      // อัพเดทข้อมูลในแคช
                      queryClient.invalidateQueries({queryKey: ['/api/admin/users']});
                      // ปิด dialog
                      setShowEditUserDialog(false);
                      // แสดงข้อความสำเร็จ
                      toast({
                        title: "บันทึกเรียบร้อย",
                        description: `อัพเดทข้อมูลผู้ใช้ ${fullName} สำเร็จแล้ว`,
                      });
                    })
                    .catch(error => {
                      toast({
                        title: "เกิดข้อผิดพลาด",
                        description: error.message || "ไม่สามารถอัพเดทข้อมูลผู้ใช้ได้",
                        variant: "destructive"
                      });
                    });
                }}
              >
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DesktopContainer>
  );
}