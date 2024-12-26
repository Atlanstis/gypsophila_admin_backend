declare namespace ReqUser {
  interface ConfigPermission {
    add: boolean;
    delete: boolean;
    edit: boolean;
    watch: boolean;
  }

  interface Config {
    permission: ConfigPermission;
  }
}
