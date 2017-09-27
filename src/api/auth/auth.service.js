"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", {value: true});
var core_1 = require("@angular/core");
require("rxjs/add/operator/catch");
var AuthService = (function () {
  function AuthService(http) {
    this.http = http;
    var at = localStorage.getItem('access-token');
    if (at != null)
      this.access_token = at;
  }

  AuthService.prototype.login = function (user) {
    return this.http.post('/api/auth', user);
  };
  AuthService.prototype.register = function (user) {
    return this.http.post('/api/user', user);
  };
  AuthService.prototype.signinup = function (user) {
    var _this = this;
    return this
      .login(user)
      .catch(function (_) {
        return _this.register(user);
      });
  };
  AuthService.prototype.logout = function () {
  };
  return AuthService;
}());
AuthService = __decorate([
  core_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
