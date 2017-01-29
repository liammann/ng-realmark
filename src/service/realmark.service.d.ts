/// <reference types="es6-promise" />
import 'rxjs/add/operator/toPromise';
export declare class RealMarkService {
    constructor();
    fromInput(raw: string): string;
    fromInputPromise(raw: string): Promise<string>;
    process(markdown: string): string;
}
