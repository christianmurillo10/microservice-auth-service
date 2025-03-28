export interface AccessTypesInterface {
  id: string;
  created_at: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  name: string;
};

class AccessTypes implements AccessTypesInterface {
  id: string = "";
  created_at: Date = new Date();
  updated_at?: Date | null = new Date();
  deleted_at?: Date | null;
  name: string = "";

  constructor(props: AccessTypesInterface) {
    Object.assign(this, props);
  };
};

export default AccessTypes;