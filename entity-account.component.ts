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
import { Search, UrlInfo } from './entity-account.model'

@Component({
    templateUrl: 'entity-account.component.html',
})

export class EntityAccountComponent extends CRUDComponent implements OnInit {
    
    /*----------------------------------------------------------------------------------------------------------------------------------------
    Variable Initialization
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    initModel: Search = new Search();
	urlinfo: UrlInfo = new UrlInfo();
	// initModel: EntitySearch = new EntitySearch();
	total_record = 0;
	action:string = "inquiry";
	showDetails:boolean = false;
	showUpdate:boolean = false;
	// searchEntityList: EntitySearch[];
	// entityDetail: Entity = new Entity();
	searchInput:string;
	searchType:string;
	p: number;

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
    search = (page:number=1) => {
        this.notify.loadingIcon("Loading...");
		this.notify.loadingIcon("Loading...");
		this.action = "inquiry";
		this.showUpdate = false;
		this.showDetails = false;
		// this.entityDetail = new Entity();

		if((this.model['SearchInputAN'] == null || this.model['SearchInputAN'] == '') 
		&& (this.model['SearchInputEN'] == null || this.model['SearchInputEN'] == '') 
		&& (this.model['SearchInputUN'] == null || this.model['SearchInputUN'] == '')){
		this.notify.eventBus.clearLoadingIcon();
		this.notify.error("Either one of the search field must be defined");
		}
		else{
		this.getSearchParameter(this.model['SearchInput'], this.model['SearchType']);
		var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink}"`;
		var more_record;
		if((page-1)>0){
			more_record = 'Y';
		}else{
			more_record = 'N';
		}
		console.log(this.model);
		this.entityAccountService.inputSearch(standardParamInfo, this.model, page-1, environment.TASK_MAX_RECORD, more_record).then(res => {
			// this.searchEntityList = res.RecordListing;
			this.total_record = res.TotalRecords;
			this.p = page;
			this.notify.eventBus.clearLoadingIcon();
		}).catch(er => {
			this.notify.eventBus.clearLoadingIcon();
			this.notifyErrorCallBackHome(er);
		});
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
	getSearchParameter(SearchInput:string, SearchType:string){
		this.model['AccountNo'] = "";
		this.model['UENNo'] = "";
		this.model['EntityName'] = "";
		this.model['AccountNo'] = this.model['SearchInputAN'];
		this.model['UENNo'] = this.model['SearchInputUN'];
		this.model['EntityName'] = this.model['SearchInputEN'];
		if (this.model['SearchInputAN']){
			this.urlinfo["SearchType"] = 'SearchInputAN';
			this.urlinfo["SearchInput"] = this.model['SearchInputAN'];
		}else if (this.model['SearchInputEN']) {
			this.urlinfo["SearchType"] = 'SearchInputEN';
			this.urlinfo["SearchInput"] = this.model['SearchInputEN'];
		}else if (this.model['SearchInputUN']) {
			this.urlinfo["SearchType"] = 'SearchInputUN';
			this.urlinfo["SearchInput"] = this.model['SearchInputUN'];
		}else if(SearchType == "SearchInputEN"){
			this.model['EntityName'] = SearchInput
			this.model['SearchInputEN'] = SearchInput
		}else if (SearchType == 'SearchInputAN'){
			this.model['SearchInputAN'] = SearchInput
			this.model['AccountNo'] = SearchInput;
		}else if (SearchType == 'SearchInputUN'){
			this.model['SearchInputUN'] = SearchInput
			this.model['UENNo'] = SearchInput;
		}
	console.log(this.urlinfo);
  }
  notifyErrorCallBackHome(e:string){
    this.notify.errorWithNavigateLink(e, answer => {
      if (answer == 'ok') {
        this.navigate("./home/" + this.menu.menulink + "/search");
      }
    });
  }
    
}
