import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatRippleModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({    
    exports: [
        FlexLayoutModule,
        MatRippleModule,
        MatDialogModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatAutocompleteModule,
        MatSnackBarModule,
        MatIconModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatProgressBarModule,
        MatStepperModule,
        MatExpansionModule,
        MatTabsModule,
        MatTooltipModule,
        MatMenuModule
    ],
  })
export class MaterialModule{}