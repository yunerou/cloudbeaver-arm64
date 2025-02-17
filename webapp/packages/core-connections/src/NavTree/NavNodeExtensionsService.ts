/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2022 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import type { IExtension } from '@cloudbeaver/core-extensions';
import { NavNodeManagerService } from '@cloudbeaver/core-navigation-tree';

import { ConnectionInfoResource, createConnectionParam } from '../ConnectionInfoResource';
import { connectionProvider } from '../extensions/IConnectionProvider';
import { objectCatalogProvider } from '../extensions/IObjectCatalogProvider';
import { objectSchemaProvider } from '../extensions/IObjectSchemaProvider';
import type { IConnectionInfoParams } from '../IConnectionsResource';


@injectable()
export class NavNodeExtensionsService {
  readonly extensions: Array<IExtension<string>>;

  constructor(
    private readonly navNodeManagerService: NavNodeManagerService,
    private readonly connectionInfoResource: ConnectionInfoResource
  ) {
    this.extensions = [
      connectionProvider(this.getConnection.bind(this)),
      objectCatalogProvider(this.getDBObjectCatalog.bind(this)),
      objectSchemaProvider(this.getDBObjectSchema.bind(this)),
    ];
  }

  getConnection(navNodeId: string): IConnectionInfoParams | undefined {
    const connection = this.connectionInfoResource.getConnectionForNode(navNodeId);

    if (!connection) {
      return;
    }

    return createConnectionParam(connection);
  }

  getDBObjectCatalog(navNodeId: string) {
    const nodeInfo = this.navNodeManagerService
      .getNodeContainerInfo(navNodeId);

    return nodeInfo.catalogId;
  }

  getDBObjectSchema(navNodeId: string) {
    const nodeInfo = this.navNodeManagerService
      .getNodeContainerInfo(navNodeId);

    return nodeInfo.schemaId;
  }
}
