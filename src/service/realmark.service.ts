import { Injectable }    from '@angular/core';
import * as Showdown from 'showdown';
import 'rxjs/add/operator/toPromise';
import {showdownPrism} from './lib/showdownPrism';

@Injectable()
export class RealMarkService {

    constructor() {
    }

    fromInput(raw: string): string {
      let html = this.process(raw);
      return html;
    }
    fromInputPromise(raw: string): Promise<string> {
      let html = this.process(raw);
      return Promise.resolve(html);
    }
    process(markdown: string) {
      Showdown.extension('showdown-prism', showdownPrism);
      let converter = new Showdown.Converter({extensions: ['showdown-prism']});
      return converter.makeHtml(markdown);
    }
 
}