"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Showdown = require("showdown");
require("rxjs/add/operator/toPromise");
var showdownPrism_1 = require("./lib/showdownPrism");
var RealMarkService = (function () {
    function RealMarkService() {
    }
    RealMarkService.prototype.fromInput = function (raw) {
        var html = this.process(raw);
        return html;
    };
    RealMarkService.prototype.fromInputPromise = function (raw) {
        var html = this.process(raw);
        return Promise.resolve(html);
    };
    RealMarkService.prototype.process = function (markdown) {
        Showdown.extension('showdown-prism', showdownPrism_1.showdownPrism);
        var converter = new Showdown.Converter({ extensions: ['showdown-prism'] });
        return converter.makeHtml(markdown);
    };
    return RealMarkService;
}());
RealMarkService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], RealMarkService);
exports.RealMarkService = RealMarkService;
//# sourceMappingURL=realmark.service.js.map