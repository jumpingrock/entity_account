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
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { CRUDComponent } from '../../../framework/core.component';
import { DropDownValue } from '../../../framework/models/core.model';
import { NotificationsService } from '../../../notify/notify.service';
import { environment } from '../../../../environments/environment';
import { Security } from '../../../framework/security/security';
import { AmountFormat } from '../../../framework/format/show-amount';

import { EntityAccountService } from '../entity-account.service'
import { Search, EntityAccount } from '../entity-account.model'

@Component({
    templateUrl: 'entity-account-inquiry.component.html',
})

export class EntityAccountInquiryComponent extends CRUDComponent implements OnInit {
    
    /*--------------------------------------------------
    Variable Initialization
    ----------------------------------------------------*/
    total_record = 0;
    total_acc_record = 0;
    action:string = "inquiry";
    searchInput:string;
    searchType:string;
    entityNo:string;
    entityName:string;
    entityServiceType:string;
    noRecord:boolean = true;
    amountValFormat: AmountFormat = new AmountFormat();

    showEntityList:boolean = true;
    showEntityAccountList:boolean = false;
    showEntityAccount:boolean = false;
    showEntityAccountDetail:boolean = false;
    showEntityAccountUpdate:boolean = false;
    showEntityAccountAdd:boolean = false;
    isPayment:boolean = false;
    isCollection:boolean = false;
    isEwallet:boolean = false;
    isOAShowLimit:boolean = false;
    isEDDA:boolean = false;
    isLookup:boolean = false;

    isOAShowLimitAdd:boolean = false;
    isOAShowLimitUpdate:boolean = false;
    isRAShowLookup:boolean = false;

    isRAShowBIC:boolean = false;
    
    searchModel: Search = new Search();
    searchEntityList: Search[];
    entityAccountRecordList: EntityAccount[] = [];

    entityAccountModel: EntityAccount = new EntityAccount();
    newEntityAccountModel: EntityAccount = new EntityAccount();
    
    accType: any[];
    currencyCode: any[];
    oaAccType: any[];
    bankIdentity: any[];

    validAccount:boolean=false;
    searchButtonEnable:boolean=true;
    isAdd:boolean=false;
    isUpdate:boolean=false;
    isOA:boolean=false;
    isOwnBank:boolean=true;
    
    showOldGroupIndicator:boolean = false;

    constructor(router: Router, private entityAccountService: EntityAccountService, private notify: NotificationsService, formBuilder: FormBuilder, private route: ActivatedRoute) {
        super('EntityAccountInquiryComponent', router);
        this.entityAccountService.setApiLink(this.menu.apilink);
    }

    ngOnInit() {
        this.notify.loadingIcon("Loading...");

        this.route.params.subscribe(params => {
            this.model = this.searchModel;
            this.model['SearchInput'] = params['search_input'];
            this.model['SearchType'] = params['search_type'];

            /*--------------------------------------------------------------------
            Preload fcuntion
            ----------------------------------------------------------------------*/
            this.entityAccountService.preload().then( e => {
                this.accType = e.get("ACCOUNTTYPE").Items;
                this.currencyCode = e.get("CURRENCYCODE").Items;
                this.oaAccType = e.get("ACCOUNTSERVICETYPE").Items;
                this.bankIdentity = e.get("BANKIDENTITY").Items;

                /* Call search list function */
                this.search();
    
            }).catch(e => {
                this.notify.eventBus.clearLoadingIcon();
                this.notifyErrorCallBackHome(e);
            });
        });
    }
    
    /*----------------------------------------------------------------------------------------------------------------------------------------
    Search list function
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    search = (page:number=1) => {
        this.notify.loadingIcon("Loading...");
        this.action = "inquiry";
        this.showEntityAccountList = false;
        this.showEntityAccountDetail = false;
        this.showEntityAccountUpdate = false;
        this.showEntityAccountAdd = false;

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
            this.getSearchParameter(this.model['SearchInput'], this.model['SearchType']);
            var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink}-entity"`;
            
            var more_record;
            if((page-1)>0){
                more_record = 'Y';
            }else{
                more_record = 'N';
            }

            this.entityAccountService.inputSearch(standardParamInfo, this.model, page-1, environment.TASK_MAX_RECORD, more_record).then(res => {
                this.searchEntityList = res.RecordListing;
                this.total_record = Math.ceil(res.TotalRecords /environment.TASK_MAX_RECORD);
                this.notify.eventBus.clearLoadingIcon();

            }).catch(er => {
                this.notify.eventBus.clearLoadingIcon();
                this.notifyErrorCallBackHome(er);
            });
        }
    }

    getSearchParameter(SearchInput:string, SearchType:string){
        this.notify.loadingIcon("Loading...");
        this.model['AccountNo'] = "";
        this.model['UENNo'] = "";
        this.model['EntityName'] = "";

        switch (this.model['SearchType']){
            case 'accountNo':{
                this.model['AccountNo'] = this.model['SearchInput'];
                break;
            } 
            case 'uenNo':{
                this.model['UENNo'] = this.model['SearchInput'];
                break;
            } 
            case 'entityName':{
                this.model['EntityName'] = this.model['SearchInput'];
                break;
            }
            default : break;
        }
    }
    
    /*----------------------------------------------------------------------------------------------------------------------------------------
    Entity account list function
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    entityAccountList(entity: EntityAccount, f:any) {
        this.notify.loadingIcon("Loading...");
        this.action = "inquiry";

        /* Screen layout control */
        this.showEntityList = true;
        this.showEntityAccountList = true;
        this.showEntityAccountDetail = false;
        this.showEntityAccountUpdate = false;
        this.showEntityAccountAdd = false;

        /* Initialise variable */
        this.entityAccountRecordList = [];
        this.noRecord = true;
        
        /* Store important parameter value */
        this.searchInput = this.model['SearchInput'];
        this.searchType = this.model['SearchType'];
        this.entityNo = entity['EntityNumber'];
        this.entityName = entity['Name'];
        this.entityServiceType = entity['ServiceType'];
        
        /* Defined new model and assigned predefined parameter value to model*/
        this.model = new EntityAccount();
        this.model['SearchInput'] = this.searchInput;
        this.model['SearchType'] = this.searchType;

        /* Defined service type*/
        this.definedServiceTypeSubId(this.entityServiceType, null);

        /* Set field attribue to untouched */
        if(f!=null){
            f.controls['description'] == undefined ? null : this.resetControl(f.controls['description']);
            f.controls['accountNumber'] == undefined ? null : this.resetControl(f.controls['accountNumber']);
            f.controls['accountType'] == undefined ? null : this.resetControl(f.controls['accountType']);
            f.controls['accountCurrency'] == undefined ? null : this.resetControl(f.controls['accountCurrency']);
            f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
            f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);
        }

        /* Start function logic */
        $("label[name='EntityName']").text(this.entityName);
        $("label[name='ServiceName']").text(this.entityServiceType);

        /* Call entity account list page function */
        this.entityAccListPages();
        
    }

    checkDecimal(form:any){
        if(this.entityServiceType == 'PAYMENT'){
            //Daily limit
            this.model['PaymentLimit'] = this.amountValFormat.formatDecimalAmount(form.controls['paymentLimit'].value);
        }
        //IAFT charges
        this.model['IAFTCharge'] = this.amountValFormat.formatDecimalAmount(form.controls['iaftCharge'].value);
        //IBFT charges
        this.model['IBFTCharge'] = this.amountValFormat.formatDecimalAmount(form.controls['ibftCharge'].value);
    }

    entityAccListPages = (page:number=1) => {
        var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink}"`;

        var more_record;
        if((page-1)>0){
            more_record = 'Y';
        }else{
            more_record = 'N';
        }
        
        this.entityAccountService.entityAccountSearch(standardParamInfo, this.entityNo, this.entityServiceType, page-1, environment.TASK_MAX_RECORD, more_record).then(data => {
            this.entityAccountRecordList = data.RecordListing;
            this.total_acc_record = Math.ceil(data.TotalRecords /environment.TASK_MAX_RECORD);

            if(this.entityAccountRecordList.length > 0){
                this.noRecord = false;
            }else{
                this.noRecord = true;
            }

            this.notify.eventBus.clearLoadingIcon();

        }).catch(e => {
            this.notify.eventBus.clearLoadingIcon();
            this.notifyErrorCallBackStatic(e);
        });

    }

    /*----------------------------------------------------------------------------------------------------------------------------------------
    Account check from RBK
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    searchAccount(form:any){
        this.notify.loadingIcon("Loading...");

        if (form.controls['accountNumberNew'].valid) {
            if(this.model['AccountNumberNew'] == null || this.model['AccountNumberNew'].trim() == ''){
                this.notify.eventBus.clearLoadingIcon();
                this.notify.error("Account number must be defined");

            }else{
                /*
                var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink}-check"`;
                
                this.entityAccountService.accountSearch(standardParamInfo, this.model['AccountNumberNew']).then(data => {
                    this.log.debug(data);
                    this.validAccount = true;
                    this.model['CIFNumber'] = data.CIFNumber;
                    this.model['AccountType'] = data.AccountType;
                    this.model['AccountCurrency'] = data.AccountCurrency;

                    for(var i=0; i < this.accType.length; i++){
                        if(this.accType[i].Value ==  this.model['AccountType']){
                            $("label[name='Type']").text(this.accType[i].DisplayValue);
                            break;
                        }
                    }

                    for(var i=0; i < this.currencyCode.length; i++){
                        if(this.currencyCode[i].Value ==  this.model['AccountCurrency']){
                            $("label[name='Currency']").text(this.currencyCode[i].DisplayValue);
                            break;
                        }
                    }

                    form.controls['accountNumberNew'].markAsPristine();
                    form.controls['accountNumberNew'].markAsUntouched();
                    this.notify.eventBus.clearLoadingIcon();
                    
                }).catch(e => {
                    this.validAccount = false;
                    this.notify.eventBus.clearLoadingIcon();
                    this.notifyErrorCallBackStatic(e);
                });
                */

                /* Open to skip bankwcif check and default the mandatory parameter */
                
                this.validAccount = true;
                this.model['CIFNumber'] = Date.now();
                this.model['AccountType'] = 'CUR';
                this.model['AccountCurrency'] = 'SGD';

                for(var i=0; i < this.accType.length; i++){
                    if(this.accType[i].Value ==  this.model['AccountType']){
                        $("label[name='Type']").text(this.accType[i].DisplayValue);
                        break;
                    }
                }

                for(var i=0; i < this.currencyCode.length; i++){
                    if(this.currencyCode[i].Value ==  this.model['AccountCurrency']){
                        $("label[name='Currency']").text(this.currencyCode[i].DisplayValue);
                        break;
                    }
                }
                
                form.controls['accountNumberNew'].markAsPristine();
                form.controls['accountNumberNew'].markAsUntouched();
                this.notify.eventBus.clearLoadingIcon();   
                
            }

        }else{
            this.setControl(form.controls['accountNumberNew']);
            this.notify.eventBus.clearLoadingIcon();
        }
    }


    checkOwnBank(form:any){
        if(form.controls['accountBIC'].value == environment.OWNED_BANK_CD){
            this.isOwnBank = true;
            this.validAccount = false;
            this.model['AccountType'] = '';
            this.model['AccountCurrency'] = '';
            this.model['DescriptionNew'] = '';

            this.resetControl(form.controls['accountNumberNew']);
            this.resetControl(form.controls['descriptionNew']);

        }else{
            this.isOwnBank = false;
            this.validAccount = true;
            this.model['AccountType'] = 'CUR';
            this.model['AccountCurrency'] = 'SGD';
        }
    }

    /*----------------------------------------------------------------------------------------------------------------------------------------
    Entity account details function
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    entityServiceDetails(entityAccount: EntityAccount) {
        this.notify.loadingIcon("Loading...");
        this.action = "inquiry";
        
        /* Screen layout control */
        this.showEntityList = true;
        this.showEntityAccountList = true;
        this.showEntityAccountDetail = true;
        this.showEntityAccountUpdate = false;
        this.showEntityAccountAdd = false;
        this.showOldGroupIndicator = false;

        var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink}"`;

        this.entityAccountService.entityAccountInquiry(standardParamInfo, entityAccount).then(data => {
            this.entityAccountModel = new EntityAccount();
            this.entityAccountModel = data;
            this.entityAccountModel.SearchInput = this.model['SearchInput'];
            this.entityAccountModel.SearchType = this.model['SearchType'];

            /* Format amount value to 2 decimal */
            this.entityAccountModel.PaymentLimit = this.amountValFormat.formatDecimalAmount(this.entityAccountModel.PaymentLimit);
            this.entityAccountModel.IAFTCharge = this.amountValFormat.formatDecimalAmount(this.entityAccountModel.IAFTCharge);
            this.entityAccountModel.IBFTCharge = this.amountValFormat.formatDecimalAmount(this.entityAccountModel.IBFTCharge);

            /* Store original data */
            this.initData(this.copyFrom(this.entityAccountModel));

            /* Defined new model and assigned predefined parameter value to model*/
            this.searchInput = this.copyFrom(this.data['SearchInput']);
            this.searchType = this.copyFrom(this.data['SearchType']);

            this.model = null;
            this.model = this.entityAccountModel;
            this.model['SearchInput'] = this.searchInput;
            this.model['SearchType'] = this.searchType;

            /* Call service type and sub id function*/
            this.definedServiceTypeSubId(this.entityAccountModel.ServiceType, this.entityAccountModel.SubId);
            
            this.model['GroupIndicator'] = (this.entityAccountModel['GroupIndicator'] == 'D' ? true : false);
            $("label[name='Description']").text(this.entityAccountModel.Description);
            $("label[name='Number']").text(this.entityAccountModel.AccountNumber);
            $("label[name='Type']").text(this.entityAccountModel.AccountTypeDescription);
            $("label[name='Currency']").text(this.entityAccountModel.AccountCurrencyDescription);
            $("label[name='Tag']").text((this.entityAccountModel.SubIdDescription == undefined || this.entityAccountModel.SubIdDescription == null) ? "" : this.entityAccountModel.SubIdDescription);
            $("label[name='DailyLimit']").text(this.amountValFormat.formatCommaAmount(this.entityAccountModel.PaymentLimit));
            $("label[name='IAFTCharge']").text(this.amountValFormat.formatCommaAmount(this.entityAccountModel.IAFTCharge));
            $("label[name='IBFTCharge']").text(this.amountValFormat.formatCommaAmount(this.entityAccountModel.IBFTCharge));
            $("label[name='BICCode']").text((this.entityAccountModel.AccountBICDescription == undefined || this.entityAccountModel.AccountBICDescription == null) ? '' : this.entityAccountModel.AccountBICDescription);

            $("label[name='CreateMakerId']").text(this.entityAccountModel.AuditInformation.CreateMakerId);
            $("label[name='CreateMakerDate']").text(this.entityAccountModel.AuditInformation.CreateMakerTimestamp.substring(0,10));
            $("label[name='CreateMakerTime']").text(this.entityAccountModel.AuditInformation.CreateMakerTimestamp.substring(11,19));

            $("label[name='CreateCheckerId']").text(this.entityAccountModel.AuditInformation.CheckerId);
            $("label[name='CreateCheckerDate']").text(this.entityAccountModel.AuditInformation.CreateCheckerTimestamp.substring(0,10));
            $("label[name='CreateCheckerTime']").text(this.entityAccountModel.AuditInformation.CreateCheckerTimestamp.substring(11,19));

            $("label[name='MakerId']").text(this.entityAccountModel.AuditInformation.MakerId);
            $("label[name='MakerDate']").text(this.entityAccountModel.AuditInformation.MakerTimestamp.substring(0,10));
            $("label[name='MakerTime']").text(this.entityAccountModel.AuditInformation.MakerTimestamp.substring(11,19));

            $("label[name='CheckerId']").text(this.entityAccountModel.AuditInformation.CheckerId);
            $("label[name='CheckerDate']").text(this.entityAccountModel.AuditInformation.CheckerTimestamp.substring(0,10));
            $("label[name='CheckerTime']").text(this.entityAccountModel.AuditInformation.CheckerTimestamp.substring(11,19));            
            this.notify.eventBus.clearLoadingIcon();

        }).catch(e => {
            this.notify.eventBus.clearLoadingIcon();
            this.notifyErrorCallBackStatic(e);
        });
        
    }

    /*----------------------------------------------------------------------------------------------------------------------------------------
    Defined service type and sub id
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    definedServiceTypeSubId(serviceType:string, subId:string){
        /* Defined service type*/
        switch(serviceType) {
            case 'COLLECTION':
                this.isCollection = true;
                this.isPayment = false;
                this.isEwallet = false;
                this.validAccount = false;
                this.isEDDA = false;
                this.isLookup = false;
                this.definedSubIDService('OA', null);
                break;

            case 'PAYMENT':
                this.isPayment = true;
                this.isCollection = false;
                this.isEwallet = false;
                this.isEDDA = false;
                this.isLookup = false;
                this.definedSubIDService(subId, null);
                break;

            case 'EWALLET':
                this.isPayment = true;
                this.isEwallet = true;
                this.isCollection = false;
                this.isEDDA = false;
                this.isLookup = false;
                this.definedSubIDService('OA', null);
                break;

            case 'EDDA':
                this.isCollection = false;
                this.isPayment = false;
                this.isEwallet = false;
                this.validAccount = false;
                this.isEDDA = true;
                this.isLookup = false;
                this.definedSubIDService('OA', null);
                break;

            case 'LOOKUP':
                this.isCollection = false;
                this.isPayment = false;
                this.isEwallet = false;
                this.validAccount = false;
                this.isEDDA = false;
                this.isLookup = true;
                this.definedSubIDService('RA', null);
                break;

            default:
                break;
        }
    }
    
    /* Defined sub Id*/
    definedSubIDService(subId:any, f:any){
        if(subId == 'OA' && this.entityServiceType != 'COLLECTION' && this.entityServiceType != 'EDDA'){
            this.isRAShowBIC    = false;
            this.searchButtonEnable = true;
            this.validAccount = false;
            this.isOA = true;
            this.isOAShowLimit = true;
            this.isOwnBank = true;
            this.isEDDA = false;
            this.isLookup = false;
            this.isRAShowLookup = false;
            
            if(this.isAdd == true){
                this.isOAShowLimitAdd = true;
                this.isOAShowLimitUpdate = false;
                /* Save search parameter to model */
                this.initData(this.model);
                this.searchInput = this.copyFrom(this.data['SearchInput']);
                this.searchType = this.copyFrom(this.data['SearchType']);
            
                this.newEntityAccountModel = new EntityAccount();
                this.model = null;
                this.model = this.copyFrom(this.newEntityAccountModel);
                this.model['SearchInput'] = this.searchInput;
                this.model['SearchType'] = this.searchType;
                this.model['AccountBIC'] = environment.OWNED_BANK_CD;
                this.model['AccountType'] = '';
                this.model['AccountCurrency'] = '';
                this.model['PaymentLimitNew'] = this.newEntityAccountModel.PaymentLimit;
                this.model['IAFTChargeNew'] = this.newEntityAccountModel.IAFTCharge;
                this.model['IBFTChargeNew'] = this.newEntityAccountModel.IBFTCharge;
            }

            if(this.isUpdate == true){
                this.isOAShowLimitUpdate = true;
                this.isOAShowLimitAdd = false;
                this.model['PaymentLimit'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.PaymentLimit));
                this.model['IAFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IAFTCharge));
                this.model['IBFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IBFTCharge));
                this.model['AccountBIC'] = this.copyFrom(this.data.AccountBIC);
            }

            /* Set field attribue to untouched */
            if(f!=null && this.isAdd){
                f.controls['descriptionNew'] == undefined ? null : this.resetControl(f.controls['descriptionNew']);
                f.controls['accountNumberNew'] == undefined ? null : this.resetControl(f.controls['accountNumberNew']);
                f.controls['accountType'] == undefined ? null : this.resetControl(f.controls['accountType']);
                f.controls['accountCurrency'] == undefined ? null : this.resetControl(f.controls['accountCurrency']);
                f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
                f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);
            }

        }else if(subId == 'OA' && this.entityServiceType == 'COLLECTION'){
            this.isRAShowBIC    = false;
            this.searchButtonEnable = false;
            this.validAccount = false;
            this.isOA = true;
            this.isOAShowLimit = true;
            this.isOwnBank = true;
            this.isEDDA = false;
            this.isLookup = false;
            this.isRAShowLookup = false;

            if(this.isAdd == true){
                this.isOAShowLimitAdd = true;
                this.isOAShowLimitUpdate = false;
                /* Save search parameter to model */
                this.initData(this.model);
                this.searchInput = this.copyFrom(this.data['SearchInput']);
                this.searchType = this.copyFrom(this.data['SearchType']);
            
                this.newEntityAccountModel = new EntityAccount();
                this.model = null;
                this.model = this.copyFrom(this.newEntityAccountModel);
                this.model['SearchInput'] = this.searchInput;
                this.model['SearchType'] = this.searchType;
                this.model['AccountBIC'] = environment.OWNED_BANK_CD;
                this.model['AccountType'] = '';
                this.model['AccountCurrency'] = '';
                this.model['IAFTChargeNew'] = this.newEntityAccountModel.IAFTCharge;
                this.model['IBFTChargeNew'] = this.newEntityAccountModel.IBFTCharge;
            }

            if(this.isUpdate == true){
                this.isOAShowLimitUpdate = true;
                this.isOAShowLimitAdd = false;
                this.model['AccountBIC'] = ((this.copyFrom(this.data.AccountBIC) == undefined || this.copyFrom(this.data.AccountBIC)  == null) ? "" : this.copyFrom(this.data.AccountBIC));
                this.model['PaymentLimit'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.PaymentLimit));
                this.model['IAFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IAFTCharge));
                this.model['IBFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IBFTCharge));
            }

            /* Set field attribue to untouched */
            if(f!=null && this.isAdd){
                f.controls['descriptionNew'] == undefined ? null : this.resetControl(f.controls['descriptionNew']);
                f.controls['accountNumber'] == undefined ? null : this.resetControl(f.controls['accountNumber']);
                f.controls['accountType'] == undefined ? null : this.resetControl(f.controls['accountType']);
                f.controls['accountCurrency'] == undefined ? null : this.resetControl(f.controls['accountCurrency']);
                f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
                f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);
            }
            
        }else if(subId == 'OA' && this.entityServiceType == 'EDDA'){
            this.isRAShowBIC    = false;
            this.searchButtonEnable = false;
            this.validAccount = false;
            this.isOA = true;
            this.isOAShowLimit = true;
            this.isOwnBank = true;
            this.isEDDA = true;
            this.isLookup = false;
            this.isRAShowLookup = false;

            if(this.isAdd == true){
                this.isOAShowLimitAdd = true;
                this.isOAShowLimitUpdate = false;
                /* Save search parameter to model */
                this.initData(this.model);
                this.searchInput = this.copyFrom(this.data['SearchInput']);
                this.searchType = this.copyFrom(this.data['SearchType']);
            
                this.newEntityAccountModel = new EntityAccount();
                this.model = null;
                this.model = this.copyFrom(this.newEntityAccountModel);
                this.model['SearchInput'] = this.searchInput;
                this.model['SearchType'] = this.searchType;
                this.model['AccountBIC'] = environment.OWNED_BANK_CD;
                this.model['AccountType'] = '';
                this.model['AccountCurrency'] = '';
                //this.model['IAFTChargeNew'] = this.newEntityAccountModel.IAFTCharge;
                //this.model['IBFTChargeNew'] = this.newEntityAccountModel.IBFTCharge;
            }

            if(this.isUpdate == true){
                this.isOAShowLimitUpdate = true;
                this.isOAShowLimitAdd = false;
                this.model['AccountBIC'] = ((this.copyFrom(this.data.AccountBIC) == undefined || this.copyFrom(this.data.AccountBIC)  == null) ? "" : this.copyFrom(this.data.AccountBIC));
                this.model['PaymentLimit'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.PaymentLimit));
                //this.model['IAFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IAFTCharge));
                //this.model['IBFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IBFTCharge));
            }

            /* Set field attribue to untouched */
            if(f!=null && this.isAdd){
                f.controls['descriptionNew'] == undefined ? null : this.resetControl(f.controls['descriptionNew']);
                f.controls['accountNumber'] == undefined ? null : this.resetControl(f.controls['accountNumber']);
                f.controls['accountType'] == undefined ? null : this.resetControl(f.controls['accountType']);
                f.controls['accountCurrency'] == undefined ? null : this.resetControl(f.controls['accountCurrency']);
                f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
                f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);
            }


        }else if(subId == 'RA' && this.entityServiceType != 'LOOKUP' && this.entityServiceType != 'EWALLET'){
            this.isRAShowBIC    = true;
            this.searchButtonEnable = false;
            this.validAccount = false;
            this.isOA = false;
            this.isOAShowLimit = false;
            this.isOwnBank = true;
            this.isEDDA = false;
            this.isLookup = false;
            this.isRAShowLookup = false;

            if(this.isAdd == true){
                this.isOAShowLimitAdd = true;
                this.isOAShowLimitUpdate = false;
                /* Save search parameter to model */
                this.initData(this.model);
                this.searchInput = this.copyFrom(this.data['SearchInput']);
                this.searchType = this.copyFrom(this.data['SearchType']);
            
                this.newEntityAccountModel = new EntityAccount();
                this.model = null;
                this.model = this.copyFrom(this.newEntityAccountModel);
                this.model['SearchInput'] = this.searchInput;
                this.model['SearchType'] = this.searchType;
                this.model['AccountBIC'] = environment.OWNED_BANK_CD;
                this.model['AccountType'] = '';
                this.model['AccountCurrency'] = '';
                this.model['SubId'] = 'RA';
            }

            if(this.isUpdate == true){
                this.isOAShowLimitUpdate = true;
                this.isOAShowLimitAdd = false;
                this.model['AccountBIC'] = ((this.copyFrom(this.data.AccountBIC) == undefined || this.copyFrom(this.data.AccountBIC)  == null) ? "" : this.copyFrom(this.data.AccountBIC));
                this.model['PaymentLimit'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.PaymentLimit));
                this.model['IAFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IAFTCharge));
                this.model['IBFTCharge'] = this.copyFrom(this.amountValFormat.formatDecimalAmount(this.data.IBFTCharge));
            }

            /* Set field attribue to untouched */
            if(f!=null && this.isAdd){
                f.controls['descriptionNew'] == undefined ? null : this.resetControl(f.controls['descriptionNew']);
                f.controls['accountType'] == undefined ? null : this.resetControl(f.controls['accountType']);
                f.controls['accountCurrency'] == undefined ? null : this.resetControl(f.controls['accountCurrency']);
                f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
                f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);
            }

        }else if(subId == 'RA' && this.entityServiceType == 'LOOKUP'){
            this.isRAShowBIC    = true;
            this.searchButtonEnable = false;
            this.validAccount = false;
            this.isOA = false;
            this.isOAShowLimit = false;
            this.isRAShowLookup = true;
            this.isOwnBank = true;
            this.isEDDA = false;
            this.isLookup = true;

            if(this.isAdd == true){
                this.isOAShowLimitAdd = false;
                this.isOAShowLimitUpdate = false;
                /* Save search parameter to model */
                this.initData(this.model);
                this.searchInput = this.copyFrom(this.data['SearchInput']);
                this.searchType = this.copyFrom(this.data['SearchType']);
            
                this.newEntityAccountModel = new EntityAccount();
                this.model = null;
                this.model = this.copyFrom(this.newEntityAccountModel);
                this.model['SearchInput'] = this.searchInput;
                this.model['SearchType'] = this.searchType;
                this.model['AccountBIC'] = environment.OWNED_BANK_CD;
                this.model['AccountType'] = '';
                this.model['AccountCurrency'] = '';
                this.model['SubId'] = 'RA';
            }
        }
    }

    /*----------------------------------------------------------------------------------------------------------------------------------------
    Submit new entity service function (Maker)
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    doAdd(form: any) {
        this.notify.loadingIcon("Loading...");
        // Set field attribue to touched
        switch(this.entityServiceType) {
            case 'COLLECTION':
                this.setControl(form.controls['descriptionNew']);
                break;

            case 'PAYMENT':
                this.setControl(form.controls['subId']);
                if(form.controls['subId'].value == 'RA'){
                    this.setControl(form.controls['accountBIC']);
                    this.setControl(form.controls['accountNumberNew']);
                    this.setControl(form.controls['accountType']);
                    this.setControl(form.controls['accountCurrency']);
                }
                this.setControl(form.controls['descriptionNew']);
                break;

            case 'EWALLET':
                this.setControl(form.controls['descriptionNew']);
                break;

            case 'EDDA':
                this.setControl(form.controls['descriptionNew']);
                break;

            case 'LOOKUP':
                this.setControl(form.controls['descriptionNew']);
                break;

            default:
                break;
        }

        this.notify.eventBus.clearLoadingIcon();

        if (form.valid) {
            this.log.debug(form.value);
            this.notify.loadingIcon("Loading...");
            this.newEntityAccountModel = new EntityAccount();
            this.newEntityAccountModel = this.copyFrom(this.model);

            this.newEntityAccountModel.AccountNumber =  this.model['AccountNumberNew'];
            this.newEntityAccountModel.Description = this.model['DescriptionNew'];
            this.newEntityAccountModel.PaymentLimit = this.model['PaymentLimitNew'];
            this.newEntityAccountModel.IAFTCharge = this.model['IAFTChargeNew'];
            this.newEntityAccountModel.IBFTCharge =  this.model['IBFTChargeNew'];
            
            this.newEntityAccountModel.EntityNumber = this.entityNo;
            this.newEntityAccountModel.Name = this.entityName;
            this.newEntityAccountModel.ServiceType = this.entityServiceType;

            this.newEntityAccountModel.PaymentLimit = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.PaymentLimit);
            this.newEntityAccountModel.IAFTCharge = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.IAFTCharge);
            this.newEntityAccountModel.IBFTCharge = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.IBFTCharge);

            this.newEntityAccountModel.GroupIndicator = (this.model['GroupIndicator'] == true ? 'D' : '');

            var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink + '/approval'}"`;
            this.entityAccountService.entityAccountSave(standardParamInfo, this.newEntityAccountModel)
                .then((res) => {
                    /* Set field attribue to untouched */
                    switch(this.entityServiceType) {
                        case 'COLLECTION':
                            this.resetControl(form.controls['descriptionNew']);
                            break;
            
                        case 'PAYMENT':
                            this.resetControl(form.controls['subId']);
                            this.resetControl(form.controls['accountBIC']);
                            if(form.controls['subId'].value == 'RA'){
                                this.resetControl(form.controls['accountNumberNew']);
                                this.resetControl(form.controls['accountType']);
                                this.resetControl(form.controls['accountCurrency']);
                            }
                            this.setControl(form.controls['descriptionNew']);
                            break;
            
                        case 'EWALLET':
                            this.resetControl(form.controls['descriptionNew']);
                            break;
            
                        default:
                            break;
                    }

                    this.notify.eventBus.clearLoadingIcon();
                    this.notify.confirm2(`Submitted Successful`, `Submission received with acknowledgement number : ${res.getHeader().Response.SessId} on ${res.getHeader().Response.ResponseTimestamp}`, '1',
                    answer2 => {
                        this.resetServiceScreen();
                    })
                })
                .catch(e => {
                    if(e.message.substr(0,(e.message).indexOf(' ')) == 'EP0005'){
                        this.notifyCallForConfirmation(e, form);
                    }else{
                        this.notify.eventBus.clearLoadingIcon();
                        this.notifyErrorCallBackStatic(e);
                    }
                });
                
        }else{
            if(this.entityServiceType != 'COLLECTION'){
                if(form.controls.subId.value == 'OA'){
                    this.resetControl(form.controls['accountNumberNew']);
                }
            }
            this.notify.eventBus.clearLoadingIcon();
        }
    }


    /*----------------------------------------------------------------------------------------------------------------------------------------
    Submit update entity service function (Maker)
    ----------------------------------------------------------------------------------------------------------------------------------------*/
    doUpdate(form: any) {
        this.notify.loadingIcon("Loading...");

        if(this.isRAShowLookup){
            if(this.model['GroupIndicator'] == true || this.model['GroupIndicator'] == 'D'){
                this.model['GroupIndicator'] = 'D';
            }else{
                this.model['GroupIndicator'] = '';
            }

        }else{
            this.model['GroupIndicator'] = '';
        }

        if(JSON.stringify(this.model) === JSON.stringify(this.data)){
            this.notify.eventBus.clearLoadingIcon();
            this.notifyErrorCallBackStatic("No change found");

        }else{
            /* Set field attribue to touched */
            form.controls['accountBIC'] == undefined ? null : this.setControl(form.controls['accountBIC']);
            this.setControl(form.controls['description']);
            
            if (form.valid) {
                /* Store model data */
                this.newEntityAccountModel = new EntityAccount();
                this.newEntityAccountModel = this.copyFrom(this.model);

                if(this.newEntityAccountModel.SubId == 'RA'){
                    this.newEntityAccountModel['PaymentLimit'] = '0.00';
                    this.newEntityAccountModel['IAFTCharge'] = '0.00';
                    this.newEntityAccountModel['IBFTCharge'] = '0.00';

                }else{
                    this.newEntityAccountModel.PaymentLimit = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.PaymentLimit);
                    this.newEntityAccountModel.IAFTCharge = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.IAFTCharge);
                    this.newEntityAccountModel.IBFTCharge = this.amountValFormat.formatDecimalAmount(this.newEntityAccountModel.IBFTCharge);
                }

                var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink + '/approval'}"`;
                this.entityAccountService.entityAccountUpdate(standardParamInfo, this.newEntityAccountModel)
                    .then((res) => {
                        /* Set field attribue to untouched */
                        this.resetControl(form.controls['description']);
                        form.controls['accountBIC'] == undefined ? null : this.resetControl(form.controls['accountBIC']);

                        this.notify.eventBus.clearLoadingIcon();
                        this.notify.confirm2(`Submitted Successful`, `Submission received with acknowledgement number : ${res.getHeader().Response.SessId} on ${res.getHeader().Response.ResponseTimestamp}`, '1',
                        answer2 => {
                            this.resetServiceScreen();
                        })
                    })
                    .catch(e => {
                        this.notify.eventBus.clearLoadingIcon();
                        this.notifyErrorCallBackStatic(e);
                    });

            }else{
                this.notify.eventBus.clearLoadingIcon();
            }
        }
    }

    checkOldData(f:any, event){
        if(event.currentTarget.attributes.name.nodeValue == 'groupIndicator'){
            this.model['GroupIndicator'] = (event.target.checked == true) ? 'D' : '';
        }

        if(this.model['GroupIndicator'] == true || this.model['GroupIndicator'] == 'D'){
            this.model['GroupIndicator'] = 'D';
        }else{
            this.model['GroupIndicator'] = '';
        }

        //let grpIndicator = (this.data.GroupIndicator == null ? '' : this.data.GroupIndicator)

        if(this.data.GroupIndicator != this.model['GroupIndicator']){
            this.showOldGroupIndicator = true;
            let oldValue = (this.data.GroupIndicator == 'D' ? 'Checked' : 'Unchecked')
            $("label[name='OldGroupIndicator']").text(oldValue);
        }else{
            this.showOldGroupIndicator = false;
        }
    }

    clearUpdateData(f){
        this.model = this.copyFrom(this.data);

        /* Set field attribue to untouched */
        f.controls['description'] == undefined ? null : this.resetControl(f.controls['description']);

        if(this.model['GroupIndicator'] != 'D'){
            this.model['GroupIndicator'] = '';
        }
        this.showOldGroupIndicator = false;

        this.isPayment = false;
        this.isCollection = false;
        this.isOAShowLimit = false;
        this.isRAShowBIC = false;
        this.isEDDA = false;
        this.isLookup = false;

        /* Reset service type */
        this.definedServiceTypeSubId(this.model['ServiceType'], this.model['SubId']);
    }

    clearAddData(f){
        /* Set field attribue to untouched */
        this.resetControl(f.controls['accountNumberNew']);
        this.resetControl(f.controls['descriptionNew']);
        this.resetControl(f.controls['accountType']);
        this.resetControl(f.controls['accountCurrency']);
        
        f.controls['subId'] == undefined ? null : this.resetControl(f.controls['subId']);
        f.controls['accountBIC'] == undefined ? null : this.resetControl(f.controls['accountBIC']);

        this.isPayment = false;
        this.isCollection = false;
        this.isOAShowLimit = false;
        this.isRAShowBIC = false;
        this.isEDDA = false;
        this.isLookup = false;

        this.validAccount = false;
        this.searchButtonEnable = true;
        this.isAdd = true;
        this.isUpdate = false;
        
        /* Defined service type*/
        if(f.controls['subId'].value == 'OA'){
            this.definedServiceTypeSubId(this.entityServiceType, 'OA');
        }else{
            this.definedServiceTypeSubId(this.entityServiceType, 'RA');
        }
    }

    resetServiceScreen(){
        this.action = "inquiry"
        this.showEntityAccountList = true;
        this.showEntityAccountDetail = false;
        this.showEntityAccountUpdate = false;
        this.showEntityAccountAdd = false;

        this.entityAccountModel = new EntityAccount();
        this.newEntityAccountModel = new EntityAccount();
    }

    add = () => {
        this.action = "insert"
        this.showEntityAccountList = true;
        this.showEntityAccountAdd = true;
        this.showEntityAccountDetail = false;
        this.showEntityAccountUpdate = false;
        this.isRAShowBIC = false;
        this.isOAShowLimitAdd = true;
        this.isOAShowLimitUpdate = false;
        this.isRAShowLookup = false;

        this.validAccount = false;
        this.searchButtonEnable = true;
        this.isAdd = true;
        this.isUpdate = false;
        this.isOA = true;

        /* Defined service type*/
        this.definedServiceTypeSubId(this.entityServiceType, 'OA');
    }

    update = () => {
        this.entityServiceDetails(this.entityAccountModel);
        this.showEntityAccountList = true;
        this.showEntityAccountUpdate = true;
        this.showEntityAccountDetail = false;
        this.showEntityAccountAdd = false;
        this.isAdd = false;
        this.isUpdate = true;
        
        this.model = null;
        this.model = this.copyFrom(this.data);

        /* Defined service type*/
        this.definedServiceTypeSubId(this.model['ServiceType'], this.model['SubId']);
        this.action = "update";
    }

    inquiry = () => {
        this.action = "inquiry"
        this.showEntityAccountList = true;
        this.showEntityAccountDetail = false;
        this.showEntityAccountUpdate = false;
        this.showEntityAccountAdd = false;
        
        this.validAccount = false;
        this.searchButtonEnable = true;
        this.isAdd = false;
        
        this.entityAccountModel = new EntityAccount();
        this.newEntityAccountModel = new EntityAccount();
        
        this.model = new EntityAccount();
        /* Assigned back the search parameter to model */
        this.model['SearchInput'] = this.searchInput;
        this.model['SearchType'] = this.searchType;
    }

    delete = () => {
        this.notify.confirm(`Do you want to delete this entity account: <b>${this.entityAccountModel.Description}</b> for entity: ${this.entityAccountModel.Name}?`, answer => {
            if (answer == 'ok') {
                this.notify.loadingIcon("Loading...");

                var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink + '/approval'}"`;
                this.entityAccountService.entityAccountDelete(standardParamInfo, this.entityAccountModel)
                    .then(
                    res => {
                        this.notify.eventBus.clearLoadingIcon();
                        this.notify.confirm2(`Submitted Successful`, `Submission received on ${res.getHeader().Response.ResponseTimestamp} with acknowledgement number : ${res.getHeader().Response.SessId}`, `1`,
                        answer => {
                            this.resetServiceScreen();
                        })
                        
                    }).catch(e => {
                        this.notify.eventBus.clearLoadingIcon();
                        this.notifyErrorCallBackStatic(e);
                    });
            }
        });
    }
    
    setControl(control:any) {
        control.markAsTouched();
    }

    resetControl(control:any) {
        control.markAsUntouched();
        control.markAsPristine();
    }

    notifyErrorCallBackHome(e:string){
        this.notify.errorWithNavigateLink(e, answer => {
            if (answer == 'ok') {
                this.navigate("./home/" + this.menu.menulink + "/search");
            }
        });
    }

    notifyErrorCallBackStatic(e:string){
        this.notify.errorWithNavigateLink(e, answer => {
            if (answer == 'ok') {}
        });
    }

    notifyCallForConfirmation(e:string, form:any){
        this.notify.eventBus.clearLoadingIcon();
        this.notify.confirmErrorActionToProceed(e + `<br><br><b>Account NOT owned by the Service Provider.</b> <br> Please Select [OK] option if you want to continue, else Select [CANCEL] to Discard. `, answer => {
            if (answer == 'ok') {
                this.notify.confirm(`<b>Account NOT owned by the Service Provider.</b> <br> Please check, Select [OK] option if you confirm to Continue with linking, else Select [CANCEL] to Discard. `, answer => {
                    if (answer == 'ok') {
                        this.notify.loadingIcon("Loading...");

                        var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${this.menu.id}"&menu_link="${this.menu.menulink + '/approval'}"`;
                        this.entityAccountService.entitySrvcProviderAccSave(standardParamInfo, this.newEntityAccountModel, Security.getSessionItem("user").id)
                            .then((res) => {
                                /* Set field attribue to untouched */
                                switch(this.entityServiceType) {
                                    case 'COLLECTION':
                                        this.resetControl(form.controls['descriptionNew']);
                                        break;
                        
                                    case 'PAYMENT':
                                        this.resetControl(form.controls['subId']);
                                        this.resetControl(form.controls['accountBIC']);
                                        if(form.controls['subId'].value == 'RA'){
                                            this.resetControl(form.controls['accountNumberNew']);
                                            this.resetControl(form.controls['accountType']);
                                            this.resetControl(form.controls['accountCurrency']);
                                        }
                                        this.setControl(form.controls['descriptionNew']);
                                        break;
                        
                                    case 'EWALLET':
                                        this.resetControl(form.controls['descriptionNew']);
                                        break;
                        
                                    default:
                                        break;
                                }
                                
                                this.notify.eventBus.clearLoadingIcon();
                                this.notify.confirm2(`Submitted Successful`, `Submission received with acknowledgement number : ${res.getHeader().Response.SessId} on ${res.getHeader().Response.ResponseTimestamp}`, '1',
                                answer2 => {
                                    this.resetServiceScreen();
                                })
                            })
                            .catch(e => {
                                this.notify.eventBus.clearLoadingIcon();
                                this.notifyErrorCallBackStatic(e);
                            });
                    }
                });
            }
        });
    }
}