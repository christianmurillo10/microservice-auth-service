export default interface UserPermission {
  id?: string;
  userId: string;
  permissionId: string;
  grantedAt: Date;
};