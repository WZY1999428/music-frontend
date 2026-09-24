import { permission } from './permission';

const directives = {
  permission,
};

export default {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key]);
    });
  },
};