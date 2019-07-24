/*
/**
 * =============================================================================
 * COPYRIGHT (C) SOLDERFIELD
 *
 * ALL RIGHTS RESERVED. SOLDERFIELD'S SOURCE CODE IS AN UNPUBLISHED WORK AND
 * THE USE OF COPYRIGH NOTICE DOES NOT IMPLY  OTHERWISE.  THIS  SOURCE  CODE
 * CONTAINS CONFIDENTIAL, TRADE SECRET MATERIAL OF SOLDERFIELD. ANY  ATTEMPT
 * OR PARTICIPATION IN DECIPHERING, DECODING, REVERSE ENGINEERING OR IN  ANY
 * WAY ALTERING THE SOURCE CODE IS STRICTLY  PROHIBITED,  UNLESS  THE  PRIOR
 * WRITTEN CONSENT OF SOLDERFIELD IS OBTAINED.
 * -----------------------------------------------------------------------------
 *
 * @author Jimmy  2018/08/01
 * -----------------------------------------------------------------------------
 * =============================================================================
 */

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { CRUDComponent } from '../../framework/core.component';
import { DropDownValue } from '../../framework/models/core.model';
import { NotificationsService } from '../../notify/notify.service';
import { environment } from '../../../environments/environment';
import { Security } from '../../framework/security/security';

import { EntityAccountService } from './entity-account.service'
import { Search } from './entity-account.model'

@Component({
    templateUrl: 'entity-account.component.html',
})

export class EntityAccountComponent extends CRUDComponent implements OnInit {
    
    /*----------------------------------------------------------------------------------------------------------------------------------------
    Variable Initialization
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    initModel: Search = new Search();

    constructor(router: Router, private entityAccountService: EntityAccountService, private notify: NotificationsService, formBuilder: FormBuilder, private route: Router) {
        super('EntityAccountComponent', router);
        this.entityAccountService.setApiLink(this.menu.apilink);
    }

    ngOnInit() {
        this.notify.loadingIcon("Loading...");
        this.model = this.initModel;
        this.notify.eventBus.clearLoadingIcon();
    }
    
    /*----------------------------------------------------------------------------------------------------------------------------------------
    Search list function
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    search() {
        this.notify.loadingIcon("Loading...");

        if((this.model['SearchInput'] == null || this.model['SearchInput'] == '') && this.model['SearchType'] == ''){
            this.notify.eventBus.clearLoadingIcon();
            this.notify.error("Search input and search type must be defined");

        }else if((!(this.model['SearchInput'] == null || this.model['SearchInput'] == '')) && this.model['SearchType'] == ''){
            this.notify.eventBus.clearLoadingIcon();
            this.notify.error("Search type must be defined");

        }else if((this.model['SearchInput'] == null || this.model['SearchInput'] == '') && !(this.model['SearchType'] == '')){
            this.notify.eventBus.clearLoadingIcon();
            this.notify.error("Search input must be defined");

        }else{
            this.navigate("./home/" + this.menu.menulink + "/inquiry", {search_input:this.model['SearchInput'], search_type:this.model['SearchType']});
        }
    }
    
    notifyError(er){
        this.notify.error(er);
    }

    clearList(f){
        this.initModel = new Search();
        this.model = this.initModel;
    }

    add(){
        this.navigate("./home/" + this.menu.menulink + "/add");
    }
    
}
