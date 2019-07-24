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

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { EntityAccountService } from '../entity-account.service';
import {  } from '../entity-account.model';

import { CRUDComponent } from '../../../framework/core.component';
import { ACTION } from '../../../framework/core.service';
import { Security } from '../../../framework/security/security';
import { AmountFormat } from '../../../framework/format/show-amount';

import { NotificationsService } from '../../../notify/notify.service';
import { QueueService } from '../../../queue/queue.service';
import { Query, AppQueue } from '../../../queue/queue.model';
import { EntityAccount } from '../entity-account.model'
export enum QUEUE_STATUS {APPROVE,REJECT,REDO,REOPEN};

@Component({
    templateUrl: 'entity-account-approval.component.html',
})

export class EntityAccountApprovalComponent extends CRUDComponent implements OnInit {

    makerId:string;
    referenceId:string;
    action:string;
    selectedQ: Query;
    appQueue:AppQueue = new AppQueue();
    entityAccount:EntityAccount = new EntityAccount();
    isPayment:boolean = false;
    isCollection:boolean = false;
    isEDDA:boolean = false;
    isLookup:boolean =false;
    isOAShowLimit:boolean = false;
    isRAShowBIC:boolean = false;
    amountValFormat: AmountFormat = new AmountFormat();

    //MQ Param
    mqMenuId:string;
    mqMenuLink:string;

    //Update Param (Original value)
    showOldSubId:boolean = false;
    showOldPaymentLimit:boolean = false;
    showOldAccountBIC:boolean = false;
    showOldIAFTCharge:boolean = false;
    showOldIBFTCharge:boolean = false;
    showOldDescription:boolean = false;
    showOldGroupIndicator:boolean = false;

    constructor(private entityAccountService: EntityAccountService, private queueService:QueueService, formBuilder: FormBuilder, private notify:NotificationsService, router:Router, private route: ActivatedRoute) {
        super('EntityAccountApprovalComponent', router);
        this.entityAccountService.setApiLink(this.menu.apilink);
    }

    ngOnInit() {
        this.route.params.map(params => params['api_link']).subscribe((apilink) => {
            this.notify.loadingIcon("Loading...");
            if(apilink) {
                this.queueService.setApiLink(apilink);
                
                this.route.params.subscribe(params => {
                    if(params['sess_id'] && params['menu_id'] && params['menu_link']) {
                        this.mqMenuId = params['menu_id'];
                        this.mqMenuLink = params['menu_link'];

                        var sess_id = params['sess_id'];
                        var standardParamInfo = `?user_id="${Security.getSessionItem("user").id}"&menu_id="${params['menu_id']}"&menu_link="${params['menu_link']}"`;
                        
                        this.queueService.getQueueDetail(standardParamInfo, params['sess_id']).then(queue => {
                            this.log.debug(JSON.stringify(queue));
                            this.appQueue = queue;

                            $("label[name='Action']").text(this.appQueue.Action);

                            if(this.appQueue.Action == ACTION.ADD){
                                this.getNewRecord(JSON.parse(this.appQueue.UpdateData));
                                this.action = "Add";

                            }else if(this.appQueue.Action == ACTION.DELETE){
                                this.getDeleteRecord(JSON.parse(this.appQueue.UpdateData));
                                this.action = "Delete";

                            }else if(this.appQueue.Action == ACTION.UPDATE){
                                this.getUpdateRecord(JSON.parse(this.appQueue.OriginalData),JSON.parse(this.appQueue.UpdateData));
                                this.action = "Update";
                            }

                            this.selectedQ = queue;
                            this.notify.eventBus.clearLoadingIcon();

                        }).catch(e => {
                            this.notify.eventBus.clearLoadingIcon();
                            this.notify.error(e);
                        });
                    }
                });
            }
        });
    }

    definedServiceTypeSubId(serviceType:string, subId:string){
        /* Defined service type*/
        if(serviceType == 'COLLECTION'){
            this.isCollection = true;
            this.isPayment = false;
            this.isEDDA = false;
            this.isLookup = false;

        }else if(serviceType == 'EDDA'){
            this.isCollection = false;
            this.isPayment = false;
            this.isEDDA = true;
            this.isLookup = false;

        }else if(serviceType == 'PAYMENT' || serviceType == 'EWALLET'){
            this.isPayment = true;
            this.isCollection = false;
            this.isEDDA = false;
            this.isLookup = false;

        }else if(serviceType == 'LOOKUP'){
            this.isPayment = false;
            this.isCollection = false;
            this.isEDDA = false;
            this.isLookup = true;
        }

        /* Defined sub Id*/
        if(subId == 'OA'){
            this.isOAShowLimit = true;
            this.isRAShowBIC    = false;

        }else if(subId == 'RA'){
            this.isRAShowBIC    = true;
            this.isOAShowLimit = false;
        }
    }

    getNewRecord(newData: any){
        this.entityAccount = this.copyFrom(newData);
        this.model['GroupIndicator'] = (this.entityAccount['GroupIndicator'] == 'D' ? true : false);
        this.definedServiceTypeSubId(this.entityAccount.ServiceType, this.entityAccount.SubId);
        $("label[name='EntityName']").text(this.entityAccount.Name);
        $("label[name='ServiceType']").text(this.entityAccount.ServiceTypeDescription);
        $("label[name='Description']").text(this.entityAccount.Description);
        $("label[name='Number']").text(this.entityAccount.AccountNumber);
        $("label[name='Type']").text(this.entityAccount.AccountTypeDescription);
        $("label[name='Currency']").text(this.entityAccount.AccountCurrencyDescription);
        $("label[name='Tag']").text(this.entityAccount.SubIdDescription);
        $("label[name='BicCode']").text(this.entityAccount.AccountBICDescription);
        $("label[name='DailyLimit']").text(this.amountValFormat.formatCommaAmount(this.entityAccount.PaymentLimit));
        $("label[name='IAFTCharge']").text(this.amountValFormat.formatCommaAmount(this.entityAccount.IAFTCharge));
        $("label[name='IBFTCharge']").text(this.amountValFormat.formatCommaAmount(this.entityAccount.IBFTCharge));
    }

    
    getDeleteRecord(deleteData: any){
        this.definedServiceTypeSubId(deleteData['ServiceType'], deleteData['SubId']);
        this.model['GroupIndicator'] = (deleteData['GroupIndicator'] == 'D' ? true : false);
        $("label[name='EntityName']").text(deleteData['Name']);
        $("label[name='ServiceType']").text(deleteData['ServiceTypeDescription']);
        $("label[name='Description']").text(deleteData['Description']);
        $("label[name='Number']").text(deleteData['AccountNumber']);
        $("label[name='Type']").text(deleteData['AccountTypeDescription']);
        $("label[name='Currency']").text(deleteData['AccountCurrencyDescription']);
        $("label[name='Tag']").text(deleteData['SubIdDescription']);
        $("label[name='BicCode']").text(deleteData['AccountBICDescription']);
        $("label[name='DailyLimit']").text(this.amountValFormat.formatCommaAmount(deleteData['PaymentLimit']));
        $("label[name='IAFTCharge']").text(this.amountValFormat.formatCommaAmount(deleteData['IAFTCharge']));
        $("label[name='IBFTCharge']").text(this.amountValFormat.formatCommaAmount(deleteData['IBFTCharge']));
    }

    
    getUpdateRecord(oldData:any, newData: any) {
        this.definedServiceTypeSubId(newData['ServiceType'], newData['SubId']);
        this.model['GroupIndicator'] = (newData['GroupIndicator'] == 'D' ? true : false);
        $("label[name='EntityName']").text(newData['Name']);
        $("label[name='ServiceType']").text(newData['ServiceTypeDescription']);
        $("label[name='Description']").text(newData['Description']);
        $("label[name='Number']").text(newData['AccountNumber']);
        $("label[name='Type']").text(newData['AccountTypeDescription']);
        $("label[name='Currency']").text(newData['AccountCurrencyDescription']);
        $("label[name='Tag']").text(newData['SubIdDescription']);
        $("label[name='BicCode']").text(newData['AccountBICDescription']);
       
        /* Format old amount value to 2 decimal */
        oldData['PaymentLimit'] = this.amountValFormat.formatCommaAmount(oldData['PaymentLimit']);
        oldData['IAFTCharge'] = this.amountValFormat.formatCommaAmount(oldData['IAFTCharge']);
        oldData['IBFTCharge'] = this.amountValFormat.formatCommaAmount(oldData['IBFTCharge']);

        /* Format new amount value to 2 decimal */
        newData['PaymentLimit'] = this.amountValFormat.formatCommaAmount(newData['PaymentLimit']);
        newData['IAFTCharge'] = this.amountValFormat.formatCommaAmount(newData['IAFTCharge']);
        newData['IBFTCharge'] = this.amountValFormat.formatCommaAmount(newData['IBFTCharge']);

        $("label[name='DailyLimit']").text(newData['PaymentLimit']);
        $("label[name='IAFTCharge']").text(newData['IAFTCharge']);
        $("label[name='IBFTCharge']").text(newData['IBFTCharge']);

        if(oldData.SubId != newData.SubId){
            this.showOldSubId = true;
            $("label[name='OldTag']").text(oldData.SubIdDescription);
        }
        
        if(oldData.PaymentLimit != newData.PaymentLimit){
            this.showOldPaymentLimit = true;
            $("label[name='OldDailyLimit']").text(oldData.PaymentLimit);
        }

        if(oldData.Description != newData.Description){
            this.showOldDescription = true;
            $("label[name='OldDescription']").text(oldData.Description);
        }

        if(oldData.IAFTCharge != newData.IAFTCharge){
            this.showOldIAFTCharge = true;
            $("label[name='OldIAFTCharge']").text(oldData.IAFTCharge);
        }

        if(oldData.IBFTCharge != newData.IBFTCharge){
            this.showOldIBFTCharge = true;
            $("label[name='OldIBFTCharge']").text(oldData.IBFTCharge);
        }

        if(oldData.AccountBIC != newData.AccountBIC){
            this.showOldAccountBIC = true;
            $("label[name='OldBicCode']").text(oldData.AccountBICDescription);
        }

        if(oldData.GroupIndicator != newData.GroupIndicator){
            this.showOldGroupIndicator = true;
            let oldValue = (oldData.GroupIndicator == 'D' ? 'Checked' : 'Unchecked')
            $("label[name='OldGroupIndicator']").text(oldValue);
        }
    }

    back(){
        (Security.getSession("tempQueueData1") == null || Security.getSession("tempQueueData1") == 'undefined') ? this.makerId = '' : this.makerId = Security.getSession("tempQueueData1");
        (Security.getSession("tempQueueData2") == null || Security.getSession("tempQueueData2") == 'undefined') ? this.referenceId = '' : this.referenceId = Security.getSession("tempQueueData2");
        this.navigate("./home/eps_queue", {maker_id:this.makerId, ref_id:this.referenceId});
    }
    
    approve() {
        this.notify.confirm(`Please ensure details entered are correct and click "OK" to complete this transaction,
                                Or click”‘Cancel” to end this transaction.  ${this.selectedQ.menu_action}`, answer => {
        if (answer == 'ok') {
            this.notify.loadingIcon("Loading...");
            this.queueService.approveMqQueues(this.appQueue.MenuId, this.appQueue.MenuLink, this.appQueue.SessId, this.appQueue.Action).then(e => {
                this.notify.eventBus.clearLoadingIcon();
                this.notify.confirm2(`Successfully Approved`, `Record has been approved successfully`, `2`,  answer2 => {
                    (Security.getSession("tempQueueData1") == null || Security.getSession("tempQueueData1") == 'undefined') ? this.makerId = '' : this.makerId = Security.getSession("tempQueueData1");
                    (Security.getSession("tempQueueData2") == null || Security.getSession("tempQueueData2") == 'undefined') ? this.referenceId = '' : this.referenceId = Security.getSession("tempQueueData2");
                    this.navigate("./home/eps_queue", {maker_id:this.makerId, ref_id:this.referenceId});
                })
            }).catch(er => {
                this.notify.eventBus.clearLoadingIcon();
                this.notify.error(er);
            }); 
        }
        });
    }

    reject() {
        this.notify.confirmInput(`to confirm`, `Please ensure details entered are correct and click "OK" to complete this transaction,
        Or click”‘Cancel” to end this transaction.  ${this.selectedQ.menu_action} <br>
        Reason : <select class="form-control" name='reason_cd' required>
                    <option value="U001">User is not authorized</option>
                    <option value="U002">User is restricted</option>
                </select>
        Remark :
                <input class="form-control" name="remark" required/>
        `, `2`, data => {
                this.selectedQ['exception_code'] = data[0]['value'];
                this.selectedQ['trans_remark'] = data[1]['value'];

                this.notify.loadingIcon("Loading...");
                this.queueService.rejectMqQueues(this.appQueue.MenuId, this.appQueue.MenuLink, this.appQueue.SessId, this.appQueue.Action, this.selectedQ['exception_code'], this.selectedQ['trans_remark']).then( e => {
                    this.notify.eventBus.clearLoadingIcon();
                    this.notify.confirm2(`Successfully Rejected`, `Record has been rejected successfully`, `2`,  answer2 =>{
                        (Security.getSession("tempQueueData1") == null || Security.getSession("tempQueueData1") == 'undefined') ? this.makerId = '' : this.makerId = Security.getSession("tempQueueData1");
                        (Security.getSession("tempQueueData2") == null || Security.getSession("tempQueueData2") == 'undefined') ? this.referenceId = '' : this.referenceId = Security.getSession("tempQueueData2");
                        this.navigate("./home/eps_queue", {maker_id:this.makerId, ref_id:this.referenceId});
                    })
                }).catch(er => {
                    this.notify.eventBus.clearLoadingIcon();
                    this.notify.error(er);
                });
            }
        );
    }

    redo() {
        this.notify.confirmInput(`to confirm`, `Please ensure details entered are correct and click "OK" to complete this transaction,
        Or click”‘Cancel” to end this transaction.  ${this.selectedQ.menu_action} <br>
        Reason : <select class="form-control" name='reason_cd' required>
                    <option value="U001">User is not authorized</option>
                    <option value="U002">User is restricted</option>
                </select>
        Remark :
                <input class="form-control" name="remark" required/>
        `, `2`, data => {
                this.selectedQ['exception_code'] = data[0]['value'];
                this.selectedQ['trans_remark'] = data[1]['value'];

                this.notify.loadingIcon("Loading...");
                this.queueService.redoMqQueues(this.appQueue.MenuId, this.appQueue.MenuLink, this.appQueue.SessId, this.appQueue.Action, this.selectedQ['exception_code'], this.selectedQ['trans_remark']).then( e => {
                    this.notify.eventBus.clearLoadingIcon();
                    this.notify.confirm2(`Successfully Rejected`, `Record has been redo successfully`, `2`,  answer2 =>{
                        (Security.getSession("tempQueueData1") == null || Security.getSession("tempQueueData1") == 'undefined') ? this.makerId = '' : this.makerId = Security.getSession("tempQueueData1");
                        (Security.getSession("tempQueueData2") == null || Security.getSession("tempQueueData2") == 'undefined') ? this.referenceId = '' : this.referenceId = Security.getSession("tempQueueData2");
                        this.navigate("./home/eps_queue", {maker_id:this.makerId, ref_id:this.referenceId});
                        })
                }).catch(er => {
                    this.notify.eventBus.clearLoadingIcon();
                    this.notify.error(er);
                }); 
            }
        );
    }
}