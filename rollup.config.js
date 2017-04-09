import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


export default {
  entry: 'dist/ng-realmark.js',
  dest: 'dist/bundles/ng-realmark.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.realmark',
  globals: {
    '@angular/core': 'ng.core',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable',
  },
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs()
  ]
};