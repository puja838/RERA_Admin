import { Component, OnInit } from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent implements OnInit {

  constructor(private modalService: NgbModal, private common: CommonService) { }

  ngOnInit(): void {
  }

  closeModal(): void {
    this.modalService.dismissAll();
  }

  delete(): void {
    this.common.modalSubject.next({deleted: true});
  }

}
