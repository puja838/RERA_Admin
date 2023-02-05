import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../services/common.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {

  config = {
    paddingAtStart: true,
    interfaceWithRoute: true,
    classname: 'my-custom-class',
    listBackgroundColor: `rgb(242, 243, 245)`,
    fontColor: `black`,
    backgroundColor: `rgb(242, 243, 245)`,
    selectedListFontColor: `#0d6efd`,
    highlightOnSelect: true,
    collapseOnSelect: true,
    useDividers: false,
    rtlLayout: false
  };
  appitems: any = [];
  adminAppItems = [{
    label: 'Global Config',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Entity',
        link: '/mst/entity',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Entity Type',
        link: '/mst/entity-type',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Entity Type Map',
        link: '/mst/entity-type-map',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Steps',
        link: '/mst/stage',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Business Unit Type',
        link: '/mst/business-unit-type',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Business Unit',
        link: '/mst/business-unit',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Keyword Verify',
        link: '/mst/file-verify',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Project Configuration',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Fields',
        link: '/mst/project-fields',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Fields Group',
        link: '/mst/fields-group',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Step Fields Mapping',
        link: '/mst/entitytype-step-fields',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Profile Configuration',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Fields',
        link: '/mst/profile-fields',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Fields Group',
        link: '/mst/profile-fields-group',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Step Fields Mapping',
        link: '/mst/profile-step-fields',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Workflow Configuration',
    faIcon: 'fa fa-sitemap',
    items: [
       {
        label: 'Workflow',
        link: '/mst/workflow',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Steps',
        link: '/mst/workflow-step',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Works Type',
        link: '/mst/step-works',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Workflow Step Works',
        link: '/mst/workflow-step-works',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Step Role ',
        link: '/mst/workflow-step-role',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Step Role User',
        link: '/mst/workflow-steps-role-user',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Check List',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Checklist Config',
        link: '/mst/workflow-steps-role-user-checklist',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'User Config',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Role',
        link: '/mst/user-role',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Users',
        link: '/mst/users',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Checklist Tab Config',
    faIcon: 'fa fa-sitemap',
    items: [
      {
        label: 'Create Tab',
        link: '/mst/checklistTabMaster',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Map Tab With Entity',
        link: '/mst/checklistTabMap',
        faIcon: 'fa fa-sitemap'
      }, {
        label: 'Checklist Group',
        link: '/mst/checklistGroup',
        faIcon: 'fa fa-sitemap'
      }
    ]
  }, {
    label: 'Notice Board',
    link: '/mst/noticeboard',
    faIcon: 'fa fa-bell'
  }];
  userAdminAppItems: any = [{
    label: 'Notice Board',
    link: '/mst/noticeboard',
    faIcon: 'fa fa-bell'
  }];
  userName: any = '';

  constructor(private route: Router, private common: CommonService) {
  }

  ngOnInit(): void {
    this.userName = this.common.getUsername();
    if (this.common.getRoleId() == 11) {
      this.appitems = this.userAdminAppItems;
    } else {
      this.appitems = this.adminAppItems;
    }
  }

  goTo(path: string): void {
    this.route.navigate([path]);
  }

  selectedItem(event: any): void {
    console.log(event);
  }

  logOut() {
    sessionStorage.clear();
    this.route.navigate(['/']);
  }

}
