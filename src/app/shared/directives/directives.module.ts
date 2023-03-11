import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DecimalNumberDirective } from './decimal-number.directive/decimal-number.directive';
import { NumbersOnlyDirective } from './number-only.directive/number-only.directive';
import { StringInputDirective } from './string-input/string-input';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    NumbersOnlyDirective,
    DecimalNumberDirective,
    StringInputDirective,
  ],
  exports: [
    NumbersOnlyDirective,
    DecimalNumberDirective,
    StringInputDirective,
  ],
})
export class DirectivesModule { }
