export default interface RolePermission {
  id?: string;
  roleId: string;
  permissionId: string;
  grantedAt: Date;
};