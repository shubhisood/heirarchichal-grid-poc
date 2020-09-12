import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { IgxHierarchicalGridModule, IgxActionStripModule,
  IgxSwitchModule, IgxTooltipModule } from "igniteui-angular";
import { HierarchicalGridLoDSampleComponent } from "./grid-poc/grid-poc.component";
import { RemoteLoDService } from "./grid-poc/services/data-load.service";
import { HttpClientModule } from "@angular/common/http";
import { IgxPreventDocumentScrollModule } from "./directives/prevent-scroll.directive";



@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
		HierarchicalGridLoDSampleComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
		IgxPreventDocumentScrollModule,
		IgxHierarchicalGridModule,
    HttpClientModule,
    IgxActionStripModule,
    IgxSwitchModule,
    IgxTooltipModule
  ],
  providers: [RemoteLoDService],
  entryComponents: [],
  schemas: []
})
export class AppModule {}
