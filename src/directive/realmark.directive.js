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
var realmark_service_1 = require("../service/realmark.service");
var RealMarkDirective = (function () {
    function RealMarkDirective(elRef, realMarkService) {
        this.elRef = elRef;
        this.realMarkService = realMarkService;
        // reference to the DOM element
        this.ele = this.elRef.nativeElement;
    }
    RealMarkDirective.prototype.ngOnInit = function () {
        var inputMarkdown = this.markdowninput;
        if (this.code) {
            inputMarkdown = "```" + this.code + "\n" + inputMarkdown + "\n```";
        }
        this.ele.innerHTML = this.realMarkService.fromInput(inputMarkdown);
        this.previousHtml = this.markdowninput;
    };
    RealMarkDirective.prototype.ngDoCheck = function () {
        if (!(this.markdowninput === this.previousHtml)) {
            var inputMarkdown = this.markdowninput;
            if (this.code) {
                inputMarkdown = "```" + this.code + "\n" + inputMarkdown + "\n```";
            }
            this.ele.innerHTML = this.realMarkService.fromInput(inputMarkdown);
            this.previousHtml = this.markdowninput;
        }
    };
    return RealMarkDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RealMarkDirective.prototype, "markdowninput", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], RealMarkDirective.prototype, "code", void 0);
RealMarkDirective = __decorate([
    core_1.Directive({
        selector: '[RealMark]'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, realmark_service_1.RealMarkService])
], RealMarkDirective);
exports.RealMarkDirective = RealMarkDirective;
//# sourceMappingURL=realmark.directive.js.map