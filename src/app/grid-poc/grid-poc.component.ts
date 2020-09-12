import { AfterViewInit, Component, ViewChild } from "@angular/core";
import {
    IGridCreatedEventArgs,
    IgxHierarchicalGridComponent,
    IgxRowIslandComponent,
    IGridEditEventArgs,
    IgxToastComponent,
    IgxActionStripComponent, IPinningConfig, RowPinningPosition, ColumnPinningPosition, IGridCellEventArgs
} from "igniteui-angular";
import { IDataState, RemoteLoDService } from "./services/data-load.service";
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { Console } from 'console';

@Component({
    providers: [RemoteLoDService],
    selector: "grid-poc",
    styleUrls: ["./grid-poc.component.scss"],
    templateUrl: "./grid-poc.component.html"
})
export class HierarchicalGridLoDSampleComponent implements AfterViewInit {
    @ViewChild("hGrid", { static: true })
    public hGrid: IgxHierarchicalGridComponent;
    @ViewChild(IgxToastComponent, { read: IgxToastComponent, static: true })
    public toast: IgxToastComponent;
    
    private destroy$ = new Subject();

    public pinningConfig: IPinningConfig = { rows: RowPinningPosition.Top, columns: ColumnPinningPosition.End };
    @ViewChild(IgxActionStripComponent, { static: true })
    public actionStrip: IgxActionStripComponent;
    

    constructor(private remoteService: RemoteLoDService) { }

    public ngAfterViewInit() {
        const dataState: IDataState = {
            key: "Customers",
            parentID: "",
            parentKey: "",
            rootLevel: true
        };
        this.hGrid.isLoading = true;
        this.remoteService.getData(dataState).subscribe(
            (data) => {
                this.hGrid.isLoading = false;
                this.hGrid.data = data;
                this.hGrid.cdr.detectChanges();
            },
            (error) => {
                this.hGrid.emptyGridMessage = error.message;
                this.hGrid.isLoading = false;
                this.hGrid.cdr.detectChanges();
            }
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }


    public dateFormatter(val: string) {
        return new Intl.DateTimeFormat("en-US").format(new Date(val));
    }

    public gridCreated(event: IGridCreatedEventArgs, _parentKey: string) {
        const dataState: IDataState = {
            key: event.owner.key,
            parentID: event.parentID,
            parentKey: _parentKey,
            rootLevel: false
        };
        event.grid.isLoading = true;
        this.remoteService.getData(dataState).subscribe(
            (data) => {
                event.grid.isLoading = false;
                event.grid.data = data;
                event.grid.cdr.detectChanges();
            },
            (error) => {
                event.grid.emptyGridMessage = error.message;
                event.grid.isLoading = false;
                event.grid.cdr.detectChanges();
            }
        );
    }

    public handleCellEdit(event: IGridEditEventArgs) {
        const today = new Date();
        const column = event.column;
        if (column.field === "Debut") {
            if (event.newValue > today.getFullYear()) {
                //this.toast.show("The debut date must be in the past!");
                event.cancel = true;
            }
        } else if (column.field === "LaunchDate") {
            if (event.newValue > new Date()) {
                //this.toast.show("The launch date must be in the past!");
                event.cancel = true;
            }
        } else if(column.field === "ShipCountry"){
            event.cancel = true;
        }
    }
    public handleRowSelection(event) {
        // if (args.added.lenght && args.added[0] === 3) {
        //     args.cancel = true;
        // }
        }

    public handleCreate(event: IGridCreatedEventArgs) {
        event.grid.onCellEdit.pipe(takeUntil(this.destroy$)).subscribe((e) => this.handleCellEdit(e));
    }

    public onMouseLeave(actionStrip: IgxActionStripComponent, event?) {
        if (!event || !event.relatedTarget || event.relatedTarget.nodeName.toLowerCase() !== "igx-drop-down-item") {
            actionStrip.hide();
        }
    }

    public changePinningPosition() {
        if (this.pinningConfig.rows === RowPinningPosition.Bottom) {
            this.pinningConfig = { columns: this.pinningConfig.columns, rows: RowPinningPosition.Top };
        } else {
            this.pinningConfig = { columns: this.pinningConfig.columns, rows: RowPinningPosition.Bottom };
        }
    }

    public onMouseOver(actionStrip: IgxActionStripComponent, hierarchicalGrid: IgxHierarchicalGridComponent, event) {
        const target = event.target;
        if (target.nodeName.toLowerCase() === "igx-hierarchical-grid-cell") {
            const gridId = target.parentNode.parentNode.attributes["ng-reflect-grid-i-d"].value;
            const grid = hierarchicalGrid.hgridAPI.getChildGrids(true)
                .find(childGrid => childGrid.id === gridId) || hierarchicalGrid;
            const rowIndex = parseInt(target.attributes["data-rowindex"].value, 10);
            const row = grid.getRowByIndex(rowIndex);
            actionStrip.show(row);
        }
    }

    public onCellClick(args: IGridCellEventArgs) {
        this.actionStrip.show(args.cell.row);
    }

    public getTooltipText(expanded) {
        return expanded ?
            "The column is expanded! Click here to collapse." : "The column is collapsed! Click here to expand";
    }
}
