import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-popover',
  templateUrl: './share-popover.component.html',
  styleUrls: ['./share-popover.component.scss'],
})
export class SharePopoverComponent implements OnInit {

  @Input("facebook") facebook:string;
  @Input("twitter") twitter:string;
  @Input("gmail") gmail:string;
  @Input("linkedin") linkedin:string;
  @Input("whatsapp") whatsapp:string;
  constructor() { }

  ngOnInit() {}

}
