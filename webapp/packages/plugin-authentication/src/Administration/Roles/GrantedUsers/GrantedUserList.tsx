/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import styled, { css } from 'reshadow';

import { UsersResource } from '@cloudbeaver/core-authentication';
import {
  Table,
  TableBody,
  TableItem,
  TableColumnValue,
  BASE_CONTAINERS_STYLES,
  Group,
  Button,
  useObjectRef,
  getComputed
} from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { TLocalizationToken, useTranslate } from '@cloudbeaver/core-localization';
import type { AdminUserInfoFragment } from '@cloudbeaver/core-sdk';
import { useStyles, composes } from '@cloudbeaver/core-theming';

import { getFilteredUsers } from './getFilteredUsers';
import { GrantedUsersTableHeader, IFilterState } from './GrantedUsersTableHeader/GrantedUsersTableHeader';
import { GrantedUsersTableInnerHeader } from './GrantedUsersTableHeader/GrantedUsersTableInnerHeader';
import { GrantedUsersTableItem } from './GrantedUsersTableItem';

const styles = composes(
  css`
    Table {
      composes: theme-background-surface theme-text-on-surface from global;
    }
  `,
  css`
    Group {
      position: relative;
    }
    Group, container, table-container {
      height: 100%;
    }
    container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    GrantedUsersTableHeader {
      flex: 0 0 auto;
    }
    table-container {
      overflow: auto;
    }
  `
);

interface Props {
  grantedUsers: AdminUserInfoFragment[];
  disabled: boolean;
  onRevoke: (subjectIds: string[]) => void;
  onEdit: () => void;
}

export const GrantedUserList = observer<Props>(function GrantedUserList({
  grantedUsers,
  disabled,
  onRevoke,
  onEdit,
}) {
  const props = useObjectRef({ onRevoke, onEdit });
  const style = useStyles(styles, BASE_CONTAINERS_STYLES);
  const translate = useTranslate();

  const usersResource = useService(UsersResource);

  const [selectedSubjects] = useState<Map<any, boolean>>(() => observable(new Map()));
  const [filterState] = useState<IFilterState>(() => observable({ filterValue: '' }));

  const selected = getComputed(() => Array.from(selectedSubjects.values()).some(v => v));

  const revoke = useCallback(() => {
    const selectedList = Array.from(selectedSubjects.entries()).filter(([key, value]) => value).map(([key]) => key);
    props.onRevoke(selectedList);
    selectedSubjects.clear();
  }, []);

  const users = getFilteredUsers(grantedUsers, filterState.filterValue);

  let tableInfoText: TLocalizationToken | null = null;
  if (!users.length) {
    if (filterState.filterValue) {
      tableInfoText = 'connections_connection_access_filter_no_result';
    } else {
      tableInfoText = 'connections_connection_access_empty_table_placeholder';
    }
  }

  return styled(style)(
    <Group box medium overflow>
      <container>
        <GrantedUsersTableHeader filterState={filterState} disabled={disabled}>
          <Button disabled={disabled || !selected} mod={['outlined']} onClick={revoke}>{translate('ui_delete')}</Button>
          <Button disabled={disabled} mod={['unelevated']} onClick={props.onEdit}>{translate('ui_edit')}</Button>
        </GrantedUsersTableHeader>
        <table-container>
          <Table selectedItems={selectedSubjects}>
            <GrantedUsersTableInnerHeader />
            <TableBody>
              <TableItem item='tableInfo' selectDisabled>
                {tableInfoText && (
                  <TableColumnValue colSpan={5}>
                    {translate(tableInfoText)}
                  </TableColumnValue>
                )}
              </TableItem>
              {users.map(user => (
                <GrantedUsersTableItem
                  key={user.userId}
                  id={user.userId}
                  name={`${user.userId}${usersResource.isActiveUser(user.userId) ? ' (you)' : ''}`}
                  icon='/icons/user.svg'
                  iconTooltip={translate('connections_connection_access_user_tooltip')}
                  disabled={disabled}
                />
              ))}
            </TableBody>
          </Table>
        </table-container>
      </container>
    </Group>
  );
});