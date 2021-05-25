/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import { ContextMenuService, IContextMenuItem, IMenuPanel } from '@cloudbeaver/core-dialogs';
import type { IDatabaseDataModel } from '@cloudbeaver/plugin-data-viewer';

export interface IDataGridCellMenuContext {
  model: IDatabaseDataModel<any>;
  resultIndex: number;
  row: number;
  column: number;
}

@injectable()
export class DataGridContextMenuService {
  static cellContext = 'data-grid-cell-context-menu';
  private static menuToken = 'dataGridCell';

  constructor(
    private contextMenuService: ContextMenuService,
  ) { }

  getMenuToken(): string {
    return DataGridContextMenuService.menuToken;
  }

  constructMenuWithContext(
    model: IDatabaseDataModel<any>,
    resultIndex: number,
    row: number,
    column: number
  ): IMenuPanel {
    return this.contextMenuService.createContextMenu<IDataGridCellMenuContext>({
      menuId: this.getMenuToken(),
      contextType: DataGridContextMenuService.cellContext,
      data: { model, resultIndex, row, column },
    });
  }

  add(panelId: string, menuItem: IContextMenuItem<IDataGridCellMenuContext>): void {
    this.contextMenuService.addMenuItem(panelId, menuItem);
  }

  register(): void { }
}