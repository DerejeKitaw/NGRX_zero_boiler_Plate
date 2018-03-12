import { Component, OnInit, Optional, EventEmitter, HostBinding } from '@angular/core';
import { InMemoryDataService } from '../../../in-memory-data.service';
import { AppDispatchers } from '../../store/app-config';

@Component({
  selector: 'app-toggle-data-source',
  templateUrl: './toggle-data-source.component.html',
  styleUrls: ['./toggle-data-source.component.scss']
})
export class ToggleDataSourceComponent {
  @HostBinding('title') nextDataSource: string;

  isRemote: boolean;

  constructor(
    @Optional() private inMemService: InMemoryDataService,
    private appDispatchers: AppDispatchers
  ) {
    this.isRemote = !inMemService;
    this.nextDataSource = `Getting data from local data source.`;
  }

  toggleDataSource(isRemote: boolean) {
    this.isRemote = isRemote;
    this.inMemService.active = !isRemote;
    const location = isRemote ? 'remote' : 'local';
    this.nextDataSource = `Getting data from ${location} data source.`;
    this.appDispatchers.toggleDataSource(location);
  }
}
